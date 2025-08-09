// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Escrow {
    enum EscrowState { CREATED, AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, CANCELLED }

    struct EscrowData {
        address payable buyer;
        address payable seller;
        uint256 amount;
        EscrowState state;
    }

    mapping(uint256 => EscrowData) public escrows;
    uint256 public nextEscrowId;

    event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount);
    event PaymentReceived(uint256 indexed escrowId);
    event DeliveryConfirmed(uint256 indexed escrowId);
    event EscrowCancelled(uint256 indexed escrowId);

    function createEscrow(address payable _seller, uint256 _amount) public {
        uint256 escrowId = nextEscrowId;
        escrows[escrowId] = EscrowData(payable(msg.sender), _seller, _amount, EscrowState.CREATED);
        nextEscrowId++;
        emit EscrowCreated(escrowId, msg.sender, _seller, _amount);
    }

    function deposit(uint256 _escrowId) public payable {
        EscrowData storage escrow = escrows[_escrowId];
        require(escrow.state == EscrowState.CREATED, "Invalid escrow state");
        require(msg.sender == escrow.buyer, "Only buyer can deposit");
        require(msg.value == escrow.amount, "Incorrect deposit amount");

        escrow.state = EscrowState.AWAITING_DELIVERY;
        emit PaymentReceived(_escrowId);
    }

    function confirmDelivery(uint256 _escrowId) public {
        EscrowData storage escrow = escrows[_escrowId];
        require(escrow.state == EscrowState.AWAITING_DELIVERY, "Invalid escrow state");
        require(msg.sender == escrow.buyer, "Only buyer can confirm delivery");

        escrow.state = EscrowState.COMPLETE;
        escrow.seller.transfer(escrow.amount);
        emit DeliveryConfirmed(_escrowId);
    }

    function cancelEscrow(uint256 _escrowId) public {
        EscrowData storage escrow = escrows[_escrowId];
        require(escrow.state == EscrowState.CREATED, "Invalid escrow state");
        require(msg.sender == escrow.buyer, "Only buyer can cancel");

        escrow.state = EscrowState.CANCELLED;
        escrow.buyer.transfer(escrow.amount);
        emit EscrowCancelled(_escrowId);
    }
}
