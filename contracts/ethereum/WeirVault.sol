// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WeirVault
 * @notice Inbound commercial revenue collection vault on Ethereum Sepolia.
 *         Accepts gross commercial payments in whitelisted tokens (e.g. mUSDC)
 *         and emits verifiable events for cross-chain attestation by Attestcoin.
 */
contract WeirVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Asset {
        string name;
        address sponsor;
        address token;
        uint256 expectedPeriodAmount;
        uint256 currentPeriod;
        uint256 totalRevenueCollected;
        bool active;
    }

    /// @notice assetId => Asset configuration
    mapping(uint256 => Asset) public assets;

    /// @notice Emitted whenever a gross revenue payment is accepted
    /// @dev This event is cryptographically verified on Creditcoin via Attestcoin precompile 0x0FD2
    event RevenueDeposited(
        uint256 indexed assetId,
        uint256 grossAmount,
        uint256 period,
        address indexed payor
    );

    event AssetRegistered(
        uint256 indexed assetId,
        string name,
        address indexed sponsor,
        address token,
        uint256 expectedPeriodAmount
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Registers a new income-producing RWA / IP asset
     */
    function registerAsset(
        uint256 assetId,
        string calldata name,
        address sponsor,
        address token,
        uint256 expectedPeriodAmount
    ) external onlyOwner {
        require(!assets[assetId].active, "Asset already registered");
        require(token != address(0), "Invalid token address");
        require(sponsor != address(0), "Invalid sponsor address");

        assets[assetId] = Asset({
            name: name,
            sponsor: sponsor,
            token: token,
            expectedPeriodAmount: expectedPeriodAmount,
            currentPeriod: 0,
            totalRevenueCollected: 0,
            active: true
        });

        emit AssetRegistered(assetId, name, sponsor, token, expectedPeriodAmount);
    }

    /**
     * @notice Accepts gross revenue payment for an asset
     * @param assetId The registered asset identifier
     * @param amount The gross payment amount in asset's payment token
     */
    function depositRevenue(uint256 assetId, uint256 amount) external nonReentrant {
        Asset storage asset = assets[assetId];
        require(asset.active, "Asset is not active");
        require(amount > 0, "Amount must be greater than zero");

        asset.currentPeriod += 1;
        asset.totalRevenueCollected += amount;

        // Transfer payment token from payor to this vault
        IERC20(asset.token).safeTransferFrom(msg.sender, address(this), amount);

        emit RevenueDeposited(assetId, amount, asset.currentPeriod, msg.sender);
    }

    /**
     * @notice Helper to inspect asset details
     */
    function getAsset(uint256 assetId) external view returns (Asset memory) {
        return assets[assetId];
    }
}
