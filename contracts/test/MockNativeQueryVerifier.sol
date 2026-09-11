// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "../creditcoin/interfaces/INativeQueryVerifier.sol";

/**
 * @title MockNativeQueryVerifier
 * @notice Stateless mock of Creditcoin's 0x0FD2 Block Prover Precompile for local testing.
 */
contract MockNativeQueryVerifier is INativeQueryVerifier {
    event TransactionVerified(uint64 indexed chainKey, uint64 indexed blockHeight);

    function verify(
        uint64,
        uint64,
        bytes calldata,
        MerkleProof calldata,
        ContinuityProof calldata
    ) external pure override returns (bool) {
        return true;
    }

    function verifyAndEmit(
        uint64 chainKey,
        uint64 blockHeight,
        bytes calldata,
        MerkleProof calldata,
        ContinuityProof calldata
    ) external override returns (bool) {
        emit TransactionVerified(chainKey, blockHeight);
        return true;
    }
}
