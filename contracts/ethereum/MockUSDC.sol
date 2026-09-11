// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Standard 6-decimal ERC-20 token simulating Circle USDC on Ethereum Sepolia.
 *         Includes a public faucet() for demo day testing.
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant _DECIMALS = 6;

    event FaucetUsed(address indexed recipient, uint256 amount);

    constructor() ERC20("Mock USD Coin", "mUSDC") Ownable(msg.sender) {
        // Mint initial 1,000,000 mUSDC to deployer
        _mint(msg.sender, 1_000_000 * 10 ** _DECIMALS);
    }

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    /**
     * @notice Public faucet for demo testing. Mints up to 50,000 mUSDC per call.
     */
    function faucet(address to, uint256 amount) external {
        require(amount <= 50_000 * 10 ** _DECIMALS, "Exceeds faucet cap (50k)");
        _mint(to, amount);
        emit FaucetUsed(to, amount);
    }

    /**
     * @notice Owner mint for administrative setup.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
