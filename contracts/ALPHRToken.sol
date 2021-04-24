// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ALPHRToken is ERC20Burnable {
    /**
     * @dev Mint 10mln tokens to deplyer
     */
    constructor() ERC20("ALPHR", "ALPHR") {
        _mint(_msgSender(), 10_000_000 * (10**uint256(decimals())));
    }
}
