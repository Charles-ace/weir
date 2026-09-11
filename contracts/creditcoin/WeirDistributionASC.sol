// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/INativeQueryVerifier.sol";
import "./interfaces/IEvmV1Decoder.sol";

/**
 * @title WeirDistributionASC
 * @notice Attestcoin Smart Contract on Creditcoin CC3 Testnet.
 *         Verifies gross commercial revenue deposits on Ethereum Sepolia via
 *         the native Block Prover Precompile (0x0FD2) and executes an O(1)
 *         Cumulative Dividend-Per-Share Index calculation for fractional asset investors.
 */
contract WeirDistributionASC is Ownable, ReentrancyGuard {
    /// @notice Address of the native Block Prover Precompile on Creditcoin runtime
    INativeQueryVerifier public constant VERIFIER =
        INativeQueryVerifier(0x0000000000000000000000000000000000000FD2);

    /// @notice Address of the deployed on-chain EvmV1Decoder on CC3 Testnet
    IEvmV1Decoder public immutable DECODER;

    /// @notice Supported source chainKey (1 = Ethereum Sepolia on CC3 Testnet)
    uint64 public constant SEPOLIA_CHAIN_KEY = 1;

    /// @notice keccak256("RevenueDeposited(uint256,uint256,uint256,address)")
    bytes32 public constant REVENUE_DEPOSITED_SIG =
        keccak256("RevenueDeposited(uint256,uint256,uint256,address)");

    /// @notice Replay protection: txKey => processed
    mapping(bytes32 => bool) public processedQueries;

    struct AssetState {
        string name;
        uint256 totalShares;
        uint256 expectedPeriodAmount; // Target lease/revenue covenant
        uint256 cumulativeDividendPerShare; // Scaled by 1e18
        uint256 totalRevenueProcessed;
        uint256 currentPeriod;
        bool active;
    }

    /// @notice assetId => AssetState
    mapping(uint256 => AssetState) public assetStates;

    /// @notice assetId => investor => share count
    mapping(uint256 => mapping(address => uint256)) public investorShares;

    /// @notice assetId => investor => last processed dividend index (scaled 1e18)
    mapping(uint256 => mapping(address => uint256)) public userLastClaimedIndex;

    /// @notice assetId => investor => total dividend amount claimed
    mapping(uint256 => mapping(address => uint256)) public totalClaimed;

    /// @notice Designated demo investors for the 3-party cap table
    mapping(uint256 => address[3]) public assetInvestors;

    // Events
    event AssetRegistered(
        uint256 indexed assetId,
        string name,
        uint256 totalShares,
        uint256 expectedPeriodAmount
    );

    event DividendsCalculated(
        uint256 indexed assetId,
        uint256 grossAmount,
        uint256 period,
        uint256 newCumulativeIndex,
        bytes32 txKey
    );

    event RevenueShortfall(
        uint256 indexed assetId,
        uint256 expectedAmount,
        uint256 receivedAmount,
        uint256 period
    );

    event DividendClaimed(
        uint256 indexed assetId,
        address indexed investor,
        uint256 amountClaimed
    );

    constructor(address _decoder) Ownable(msg.sender) {
        require(_decoder != address(0), "Invalid decoder address");
        DECODER = IEvmV1Decoder(_decoder);
    }

    /**
     * @notice Registers a real-world asset and sets up the locked 3-party cap table
     * @param assetId The asset identifier (matches Ethereum vault assetId)
     * @param name Name of the underlying asset
     * @param totalShares Total fractional units (e.g. 10,000)
     * @param expectedPeriodAmount Monthly covenant target (e.g. 10,000 mUSDC)
     * @param alice Address of Investor 1 (50% = 5,000 shares)
     * @param bob Address of Investor 2 (30% = 3,000 shares)
     * @param charlie Address of Investor 3 (20% = 2,000 shares)
     */
    function registerAssetWithCapTable(
        uint256 assetId,
        string calldata name,
        uint256 totalShares,
        uint256 expectedPeriodAmount,
        address alice,
        address bob,
        address charlie
    ) external onlyOwner {
        require(!assetStates[assetId].active, "Asset already registered");
        require(totalShares > 0, "Total shares must be > 0");
        require(alice != address(0) && bob != address(0) && charlie != address(0), "Invalid investor addresses");

        assetStates[assetId] = AssetState({
            name: name,
            totalShares: totalShares,
            expectedPeriodAmount: expectedPeriodAmount,
            cumulativeDividendPerShare: 0,
            totalRevenueProcessed: 0,
            currentPeriod: 0,
            active: true
        });

        // 50% / 30% / 20% cap table split
        uint256 aliceShares = (totalShares * 50) / 100;
        uint256 bobShares = (totalShares * 30) / 100;
        uint256 charlieShares = totalShares - aliceShares - bobShares;

        investorShares[assetId][alice] = aliceShares;
        investorShares[assetId][bob] = bobShares;
        investorShares[assetId][charlie] = charlieShares;

        assetInvestors[assetId] = [alice, bob, charlie];

        emit AssetRegistered(assetId, name, totalShares, expectedPeriodAmount);
    }

    /**
     * @notice Verifies an Ethereum Sepolia revenue deposit via Attestcoin precompile 0x0FD2
     *         and updates the O(1) Cumulative Dividend Index.
     */
    function verifyAndDistribute(
        uint64 chainKey,
        uint64 blockHeight,
        bytes calldata encodedTransaction,
        bytes32 merkleRoot,
        INativeQueryVerifier.MerkleProofEntry[] calldata siblings,
        bytes32 lowerEndpointDigest,
        bytes32[] calldata continuityRoots
    ) external nonReentrant returns (bool success) {
        require(chainKey == SEPOLIA_CHAIN_KEY, "Unsupported source chain");

        // 1. Calculate transaction index and unique query key for replay protection
        uint256 transactionIndex = _calculateTransactionIndex(siblings);
        bytes32 txKey;
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, chainKey)
            mstore(add(ptr, 32), shl(192, blockHeight))
            mstore(add(ptr, 40), transactionIndex)
            txKey := keccak256(ptr, 72)
        }
        require(!processedQueries[txKey], "Query already processed (Replay protection)");

        // 2. Cryptographically verify inclusion using native Block Prover Precompile (0x0FD2)
        INativeQueryVerifier.MerkleProof memory merkleProof = INativeQueryVerifier.MerkleProof({
            root: merkleRoot,
            siblings: siblings
        });

        INativeQueryVerifier.ContinuityProof memory continuityProof = INativeQueryVerifier.ContinuityProof({
            lowerEndpointDigest: lowerEndpointDigest,
            roots: continuityRoots
        });

        bool verified = VERIFIER.verifyAndEmit(
            chainKey,
            blockHeight,
            encodedTransaction,
            merkleProof,
            continuityProof
        );
        require(verified, "Cryptographic proof verification failed at 0x0FD2");

        // Mark query as processed
        processedQueries[txKey] = true;

        // 3. Decode transaction receipt using on-chain EvmV1Decoder
        (uint256 assetId, uint256 grossAmount, uint256 period) = _decodeRevenueReceipt(encodedTransaction);

        AssetState storage asset = assetStates[assetId];
        require(asset.active, "Asset not active on Creditcoin");
        require(grossAmount > 0, "Gross amount must be > 0");

        // 4. Shortfall check (Locked decision: Log shortfall event only, distribute actual pro-rata)
        if (grossAmount < asset.expectedPeriodAmount) {
            emit RevenueShortfall(assetId, asset.expectedPeriodAmount, grossAmount, period);
        }

        // 5. Execute O(1) Cumulative Dividend Index update
        // deltaIndex = (grossAmount * 1e18) / totalShares
        uint256 deltaIndex = (grossAmount * 1e18) / asset.totalShares;
        asset.cumulativeDividendPerShare += deltaIndex;
        asset.totalRevenueProcessed += grossAmount;
        asset.currentPeriod = period;

        emit DividendsCalculated(
            assetId,
            grossAmount,
            period,
            asset.cumulativeDividendPerShare,
            txKey
        );

        return true;
    }

    /**
     * @notice Pull-pattern claim: Investor withdraws accrued dividends for an asset
     * @param assetId The asset identifier
     */
    function claimDividend(uint256 assetId) external nonReentrant returns (uint256 owed) {
        AssetState storage asset = assetStates[assetId];
        require(asset.active, "Asset not active");

        uint256 shares = investorShares[assetId][msg.sender];
        require(shares > 0, "No shares owned in this asset");

        uint256 currentIndex = asset.cumulativeDividendPerShare;
        uint256 lastIndex = userLastClaimedIndex[assetId][msg.sender];

        require(currentIndex > lastIndex, "No new dividends to claim");

        // O(1) entitlement calculation: shares * (currentIndex - lastIndex) / 1e18
        owed = (shares * (currentIndex - lastIndex)) / 1e18;
        require(owed > 0, "Owed amount is zero");

        // Update user checkpoint
        userLastClaimedIndex[assetId][msg.sender] = currentIndex;
        totalClaimed[assetId][msg.sender] += owed;

        emit DividendClaimed(assetId, msg.sender, owed);

        return owed;
    }

    /**
     * @notice View function to inspect unclaimed dividends for an investor
     */
    function getClaimableDividend(uint256 assetId, address investor) external view returns (uint256) {
        AssetState storage asset = assetStates[assetId];
        if (!asset.active) return 0;

        uint256 shares = investorShares[assetId][investor];
        if (shares == 0) return 0;

        uint256 currentIndex = asset.cumulativeDividendPerShare;
        uint256 lastIndex = userLastClaimedIndex[assetId][investor];

        if (currentIndex <= lastIndex) return 0;

        return (shares * (currentIndex - lastIndex)) / 1e18;
    }

    /**
     * @notice Helper to get the 3 designated demo investors and their shares
     */
    function getCapTable(uint256 assetId)
        external
        view
        returns (
            address[3] memory investors,
            uint256[3] memory shares,
            uint256 totalShares
        )
    {
        investors = assetInvestors[assetId];
        shares = [
            investorShares[assetId][investors[0]],
            investorShares[assetId][investors[1]],
            investorShares[assetId][investors[2]]
        ];
        totalShares = assetStates[assetId].totalShares;
    }

    /**
     * @dev Extracts and validates RevenueDeposited event from encoded receipt bytes
     */
    function _decodeRevenueReceipt(bytes calldata encodedTransaction)
        internal
        view
        returns (uint256 assetId, uint256 grossAmount, uint256 period)
    {
        // Decode receipt fields using deployed EvmV1Decoder contract
        IEvmV1Decoder.ReceiptFields memory receipt = DECODER.decodeReceiptFields(encodedTransaction);
        require(receipt.receiptStatus == 1, "Source transaction did not succeed (status != 1)");

        IEvmV1Decoder.LogEntry[] memory logs = DECODER.getLogsByEventSignature(receipt, REVENUE_DEPOSITED_SIG);
        require(logs.length > 0, "No RevenueDeposited event found in transaction logs");

        IEvmV1Decoder.LogEntry memory targetLog = logs[0];
        require(targetLog.topics.length >= 2, "Invalid topics length for RevenueDeposited");

        // Topic 1: indexed assetId
        assetId = uint256(targetLog.topics[1]);

        // Unpack non-indexed parameters: grossAmount, period, payor
        (grossAmount, period, ) = abi.decode(targetLog.data, (uint256, uint256, address));

        return (assetId, grossAmount, period);
    }

    /**
     * @dev Calculates transaction index from Merkle path siblings
     */
    function _calculateTransactionIndex(INativeQueryVerifier.MerkleProofEntry[] calldata siblings)
        internal
        pure
        returns (uint256)
    {
        uint256 index = 0;
        for (uint256 i = 0; i < siblings.length; i++) {
            if (!siblings[i].isLeft) {
                index |= (1 << i);
            }
        }
        return index;
    }
}
