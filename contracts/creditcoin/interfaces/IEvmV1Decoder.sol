// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title IEvmV1Decoder
 * @notice Interface for the deployed EvmV1Decoder library on Creditcoin CC3 Testnet at 0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f.
 */
interface IEvmV1Decoder {
    struct LogEntry {
        address address_;
        bytes32[] topics;
        bytes data;
    }

    struct ReceiptFields {
        uint256 receiptStatus;
        uint256 receiptGasUsed;
        LogEntry[] receiptLogs;
        bytes receiptLogsBloom;
    }

    function getTransactionType(bytes calldata encodedTx) external view returns (uint8);
    function isValidTransactionType(uint8 txType) external view returns (bool);
    function decodeReceiptFields(bytes calldata encodedTx) external view returns (ReceiptFields memory);
    function getLogsByEventSignature(ReceiptFields calldata receipt, bytes32 eventSig) external view returns (LogEntry[] memory);
}
