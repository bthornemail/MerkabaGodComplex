// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ServiceNFT is ERC721 {
    // Event emitted when a service is registered
    event ServiceRegistered(uint256 indexed serviceId, address indexed provider, string metadata);

    // Event emitted when a service is booked
    event ServiceBooked(uint256 indexed serviceId, address indexed booker, uint256 startTime, uint256 endTime);

    // Event emitted when a service is canceled
    event ServiceCanceled(uint256 indexed serviceId, address indexed canceler);

    // Event emitted when ownership of a service is transferred
    event ServiceTransferred(uint256 indexed serviceId, address indexed previousOwner, address indexed newOwner);

    mapping(uint256 => Service) private services;

    struct Service {
        string metadata;
        address provider;
        bool booked;
        uint256 startTime;
        uint256 endTime;
        address booker;
    }

    constructor() ERC721("ServiceNFT", "SNFT") {}

    function registerService(string memory _metadata) external {
        uint256 serviceId = totalSupply() + 1;
        _safeMint(msg.sender, serviceId);

        services[serviceId] = Service(_metadata, msg.sender, false, 0, 0, address(0));

        emit ServiceRegistered(serviceId, msg.sender, _metadata);
    }

    function bookService(uint256 _serviceId, uint256 _startTime, uint256 _endTime) external {
        require(ownerOf(_serviceId) != address(0), "Service does not exist");
        require(!services[_serviceId].booked, "Service is already booked");

        services[_serviceId].booked = true;
        services[_serviceId].startTime = _startTime;
        services[_serviceId].endTime = _endTime;
        services[_serviceId].booker = msg.sender;

        emit ServiceBooked(_serviceId, msg.sender, _startTime, _endTime);
    }

    function cancelService(uint256 _serviceId) external {
        require(ownerOf(_serviceId) != address(0), "Service does not exist");
        require(services[_serviceId].booked, "Service is not booked");
        require(services[_serviceId].booker == msg.sender, "Only the booker can cancel the service");

        services[_serviceId].booked = false;
        services[_serviceId].startTime = 0;
        services[_serviceId].endTime = 0;
        services[_serviceId].booker = address(0);

        emit ServiceCanceled(_serviceId, msg.sender);
    }

    function transferService(uint256 _serviceId, address _newOwner) external {
        require(ownerOf(_serviceId) != address(0), "Service does not exist");
        require(ownerOf(_serviceId) == msg.sender, "Only the service owner can transfer the service");

        _transfer(msg.sender, _newOwner, _serviceId);

        emit ServiceTransferred(_serviceId, msg.sender, _newOwner);
    }

    function getServiceDetails(uint256 _serviceId)
        external
        view
        returns (
            string memory metadata,
            address provider,
            bool booked,
            uint256 startTime,
            uint256 endTime,
            address booker
        )
    {
        require(ownerOf(_serviceId) != address(0), "Service does not exist");

        Service storage service = services[_serviceId];
        return (service.metadata, service.provider, service.booked, service.startTime, service.endTime, service.booker);
    }
}
