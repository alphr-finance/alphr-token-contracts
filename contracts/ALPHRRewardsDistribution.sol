// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'openzeppelin-solidity/contracts/access/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol';
import 'openzeppelin-solidity/contracts/utils/math/SafeMath.sol';

contract ALPHRRewardsDistribution is Ownable {

    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    mapping (address => uint) private _rewards;
    IERC20 alphr;

    event RewardAdded(address indexed _address, uint256 _amount);
    event RewardClaimed(address indexed _address, uint256 _amount);

    /**
     * @dev Sets ALPHR address
     * @param _alphr address of the ALPHR token 
     */
    constructor (IERC20 _alphr) {
        alphr = _alphr;
    }

    /**
     * @dev Adds ALPHR rewards to specified account
     * @param _address address that rewards being added
     * @param _amount amount of ALPHR reward tokens 
     */
    function addRewards(address _address, uint _amount) external onlyOwner {
        _rewards[_address] = _rewards[_address].add(_amount);
        emit RewardAdded(_address, _amount);
    }

    /**
     * @dev Adds ALPHR rewards to batched accounts
     * @param _addresses addresses that rewards being added
     * @param _amounts amounts of ALPHR reward tokens 
     */
    function addRewardsBatch(address[] calldata _addresses, uint256[] calldata _amounts) external onlyOwner {
        require(_addresses.length == _amounts.length);
        for (uint i = 0; i < _amounts.length; i++) {
            _rewards[_addresses[i]] = _rewards[_addresses[i]].add(_amounts[i]);
            emit RewardAdded(_addresses[i], _amounts[i]);
        }
    }

    /**
     * @dev Claims ALPHR rewards for message sender
     */
    function claimRewards() external {
        require(_rewards[_msgSender()] > 0);
        alphr.safeTransfer(_msgSender(), _rewards[_msgSender()]);
        emit RewardClaimed(_msgSender(), _rewards[_msgSender()]);
    }

    /**
     * @dev Returns current rewards amount for address
     * @param _address address being checked for rewards
     */
    function getPendingRewards(address _address) public view returns(uint) {
        return _rewards[_address];
    }

}