// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    
    mapping(address => bool) public isOwner;
    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    address[] public owners;
    uint256 public required;
    uint public transactionId;

    struct Transaction {
        address payable destination;
        uint value;
        bool executed;
    }

    modifier onlyOwner {
        require(isOwner[msg.sender], "Only owners can execute this operation");
        _;
    }

    constructor(address[] memory _owners, uint _required) {
        require(_owners.length >= _required && _required > 0, "Invalid number of owners/required confirmations");

        for (uint256 i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
        }

        owners = _owners;
        required = _required;
    }

    function submitTransaction(address payable _destination, uint _value) external onlyOwner {
        transactionId++;
        transactions[transactionId] = Transaction(_destination, _value, false);
        confirmations[transactionId][msg.sender] = true;
    }

    function confirmTransaction(uint _transactionId) external onlyOwner {
        require(!transactions[_transactionId].executed, "Transaction already executed");
        confirmations[_transactionId][msg.sender] = true;
    }

    function executeTransaction(uint _transactionId) external onlyOwner {
        require(!transactions[_transactionId].executed, "Transaction already executed");

        uint confirmationCount;
        for (uint i = 0; i < owners.length; i++) {
            if (confirmations[_transactionId][owners[i]]) {
                confirmationCount++;
            }
        }

        require(confirmationCount >= required, "Not enough confirmations");

        Transaction storage txn = transactions[_transactionId];
        txn.executed = true;
        txn.destination.transfer(txn.value);
    }
}