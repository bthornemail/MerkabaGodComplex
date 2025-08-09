// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Vesting {
    struct VestingData {
        address beneficiary;
        uint256 start;
        uint256 cliff;
        uint256 duration;
        uint256 released;
    }

    mapping (address => VestingData) public vestings;

    event VestingCreated(
        address indexed beneficiary,
        uint256 start,
        uint256 cliff,
        uint256 duration
    );

    function createVesting(
        address _beneficiary,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration
    ) public {
        vestings[_beneficiary] = VestingData(
            _beneficiary,
            _start,
            _cliff,
            _duration,
            0
        );
        emit VestingCreated(_beneficiary, _start, _cliff, _duration);
    }

    function release(address _beneficiary) public {
        VestingData storage vesting = vestings[_beneficiary];

        require(vesting.duration != 0, "Vesting not found");
        require(block.timestamp >= vesting.cliff, "Vesting cliff not reached");

        uint256 elapsedTime = block.timestamp - vesting.start;
        uint256 totalAmount = elapsedTime * 100 / vesting.duration;

        require(totalAmount > vesting.released, "No more tokens to release");

        uint256 amountToRelease = totalAmount - vesting.released;
        vesting.released += amountToRelease;

        // Add your logic to transfer VertCoin to the beneficiary here
    }

    function getReleasedAmount(address _beneficiary) public view returns (uint256) {
        VestingData storage vesting = vestings[_beneficiary];
        return vesting.released;
    }
}
