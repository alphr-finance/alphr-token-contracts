// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'openzeppelin-solidity/contracts/token/ERC20/IERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol';
import 'openzeppelin-solidity/contracts/utils/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/utils/Address.sol';
import 'openzeppelin-solidity/contracts/access/Ownable.sol';

/**
 * @title TokenVesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period.
 */
contract TokenVesting is Ownable {
    // The vesting schedule is time-based (i.e. using block timestamps as opposed to e.g. block numbers), and is
    // therefore sensitive to timestamp manipulation (which is something miners can do, to a certain degree). Therefore,
    // it is recommended to avoid using short time durations (less than a minute). Typical vesting schemes, with a
    // cliff period of a year and a duration of four years, are safe to use.
    // solhint-disable not-rely-on-time

    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    event TokensReleased(uint256 amount);

    // beneficiary of tokens after they are released
    address private _beneficiary;

    // Durations and timestamps are expressed in UNIX time, the same units as block.timestamp.
    uint256 private _cliff;
    uint256 private _start;
    uint256 private _duration;
    uint256 private _released;

    IERC20 private _alphr;

    /**
     * @dev Creates a vesting contract that vests its balance of ALPHR ERC20 token to the
     * beneficiary, gradually in a linear fashion until start + duration. By then all
     * of the balance will have vested.
     * @param beneficiary_ address of the beneficiary to whom vested tokens are transferred
     * @param cliffDuration_ duration in seconds of the cliff in which tokens will begin to vest
     * @param start_ the time (as Unix time) at which point vesting starts
     * @param duration_ duration in seconds of the period in which the tokens will vest
     * @param alphr_ address of ALPHR token
     */
    constructor (address beneficiary_, uint256 start_, uint256 cliffDuration_, uint256 duration_, IERC20 alphr_) {
        require(beneficiary_ != address(0), "TokenVesting: beneficiary is the zero address");
        // solhint-disable-next-line max-line-length
        require(cliffDuration_ <= duration_, "TokenVesting: cliff is longer than duration");
        require(duration_ > 0, "TokenVesting: duration is 0");
        // solhint-disable-next-line max-line-length
        require(start_.add(duration_) > block.timestamp, "TokenVesting: final time is before current time");

        _beneficiary = beneficiary_;
        _duration = duration_;
        _cliff = start_.add(cliffDuration_);
        _start = start_;
        _alphr = alphr_;
    }

    /**
     * @return the beneficiary of the tokens.
     */
    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    /**
     * @return the cliff time of the token vesting.
     */
    function cliff() public view returns (uint256) {
        return _cliff;
    }

    /**
     * @return the start time of the token vesting.
     */
    function start() public view returns (uint256) {
        return _start;
    }

    /**
     * @return the duration of the token vesting.
     */
    function duration() public view returns (uint256) {
        return _duration;
    }

    /**
     * @return ALPHR address
     */
    function alphr() public view returns (address) {
        return address(_alphr);
    }

    /**
     * @return ALPHR address
     */
    function released() public view returns (uint) {
        return _released;
    }

    /**
     * @notice Transfers vested tokens to beneficiary.
     */
    function release() public {
        uint256 unreleased = _releasableAmount();

        require(unreleased > 0, "TokenVesting: no tokens are due");

        _released = _released.add(unreleased);

        _alphr.safeTransfer(_beneficiary, unreleased);

        emit TokensReleased(unreleased);
    }

    /**
     * @dev Calculates the amount that has already vested but hasn't been released yet.
     */
    function _releasableAmount() private view returns (uint256) {
        return _vestedAmount().sub(_released);
    }

    /**
     * @dev Calculates the amount that has already vested.
     */
    function _vestedAmount() private view returns (uint256) {
        uint256 currentBalance = _alphr.balanceOf(address(this));
        uint256 totalBalance = currentBalance.add(_released);

        if (block.timestamp < _cliff) {
            return 0;
        } else if (block.timestamp >= _start.add(_duration)) {
            return totalBalance;
        } else {
            return totalBalance.mul(block.timestamp.sub(_start)).div(_duration);
        }
    }
}