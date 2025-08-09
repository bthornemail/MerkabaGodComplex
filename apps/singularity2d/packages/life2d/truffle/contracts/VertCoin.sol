// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./MultiSigWallet.sol";

contract VertCoin is ERC20, Ownable {
    mapping(address => uint256) private stakes;
    mapping(address => address) public stakerToMultiSig;

    event StakePlaced(address staker, uint256 amount, address multiSigWallet);
    event StakeReleased(address staker, uint256 amount);
    event StakeForfeited(address staker, uint256 amount);

    constructor() ERC20("VertCoin", "VTC") {}

    function stake(uint256 _amount, address _multiSigWallet) public {
        // Require that the staker has sufficient balance
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance to stake");

        // Record the stake details
        stakes[msg.sender] += _amount;
        stakerToMultiSig[msg.sender] = _multiSigWallet;

        emit StakePlaced(msg.sender, _amount, _multiSigWallet);
    }

    function releaseStake(address _staker) external onlyOwner {
        uint256 stakeAmount = stakes[_staker];
        require(stakeAmount > 0, "No stake to release");

        // Transfer VertCoin from the multi-sig wallet to staker
        _transfer(stakerToMultiSig[_staker], _staker, stakeAmount);

        // Clear the stake details
        stakes[_staker] = 0;
        delete stakerToMultiSig[_staker];

        emit StakeReleased(_staker, stakeAmount);
    }

    function forfeitStake(address _staker) external onlyOwner {
        uint256 stakeAmount = stakes[_staker];
        require(stakeAmount > 0, "No stake to forfeit");

        // Clear the stake details
        stakes[_staker] = 0;
        delete stakerToMultiSig[_staker];

        emit StakeForfeited(_staker, stakeAmount);
    }

    function getStake(address _staker) external view returns (uint256) {
        return stakes[_staker];
    }
}