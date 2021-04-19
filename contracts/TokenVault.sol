// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'openzeppelin-solidity/contracts/access/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/IERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol';

contract TokenVault is Ownable {

    using SafeERC20 for IERC20;
    uint etherBalance; 

    constructor () {
    }

    /**
     * @dev Sends tokens to specified address
     * @param _token address of the token being transferred
     * @param _to address where tokens will be sent
     * @param _amount amount of tokens to send
     */
    function sendTokens(IERC20 _token, address _to, uint _amount) public onlyOwner {
        _token.safeTransfer(_to, _amount);
    }

    /**
     * @dev Sends Ether to specified address
     * @param _to address where Ether will be sent
     * @param _amount amount of Ether to send in wei
     */
    function sendEther(address _to, uint _amount) public payable onlyOwner {
        (bool sent, bytes memory data) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    /**
     * @dev Returns Ether balance of this contract
     */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {}
    fallback() external payable {}
}