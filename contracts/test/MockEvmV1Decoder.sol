// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "../creditcoin/interfaces/IEvmV1Decoder.sol";

/**
 * @title MockEvmV1Decoder
 * @notice Mock implementation of on-chain EvmV1Decoder library for local unit testing.
 */
contract MockEvmV1Decoder is IEvmV1Decoder {
    uint256 public mockStatus = 1;
    LogEntry[] private mockLogs;

    function setMockStatus(uint256 _status) external {
        mockStatus = _status;
    }

    function setMockLog(address emitter, bytes32[] calldata topics, bytes calldata data) external {
        delete mockLogs;
        mockLogs.push(LogEntry({
            address_: emitter,
            topics: topics,
            data: data
        }));
    }

    function getTransactionType(bytes calldata) external pure override returns (uint8) {
        return 2; // EIP-1559
    }

    function isValidTransactionType(uint8 txType) external pure override returns (bool) {
        return txType <= 4;
    }

    function decodeReceiptFields(bytes calldata) external view override returns (ReceiptFields memory) {
        return ReceiptFields({
            receiptStatus: mockStatus,
            receiptGasUsed: 50000,
            receiptLogs: mockLogs,
            receiptLogsBloom: ""
        });
    }

    function getLogsByEventSignature(ReceiptFields calldata receipt, bytes32 eventSig)
        external
        pure
        override
        returns (LogEntry[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < receipt.receiptLogs.length; i++) {
            if (receipt.receiptLogs[i].topics.length > 0 && receipt.receiptLogs[i].topics[0] == eventSig) {
                count++;
            }
        }

        LogEntry[] memory matches = new LogEntry[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < receipt.receiptLogs.length; i++) {
            if (receipt.receiptLogs[i].topics.length > 0 && receipt.receiptLogs[i].topics[0] == eventSig) {
                matches[j] = receipt.receiptLogs[i];
                j++;
            }
        }
        return matches;
    }
}
