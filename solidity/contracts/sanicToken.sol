// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SanicToken is ERC20 {
    constructor() ERC20("SanicToken", "SANIC") {
        // Mint 500 tokens to msg.sender
        // Similar to how
        // 1 dollar = 100 cents
        // 1 token = 1 * (10 ** decimals)
        _mint(msg.sender, 500 * 10**uint(decimals()));
    }
}