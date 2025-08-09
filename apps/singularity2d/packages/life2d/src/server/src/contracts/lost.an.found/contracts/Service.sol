// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Service {
    struct ServiceData {
        address provider;
        string metadataURI;
        uint256 price;
        bool available;
    }

    mapping(uint256 => ServiceData) public services;
    uint256 public nextServiceId;

    event ServiceCreated(uint256 indexed serviceId, address indexed provider, string metadataURI, uint256 price);
    event ServiceUpdated(uint256 indexed serviceId, address indexed provider, string metadataURI, uint256 price);
    event ServiceAvailabilityChanged(uint256 indexed serviceId, bool available);

    function createService(string memory _metadataURI, uint256 _price) public {
        uint256 serviceId = nextServiceId++;
        services[serviceId] = ServiceData(msg.sender, _metadataURI, _price, true);
        emit ServiceCreated(serviceId, msg.sender, _metadataURI, _price);
    }

    function updateService(uint256 _serviceId, string memory _metadataURI, uint256 _price) public {
        ServiceData storage service = services[_serviceId];
        require(msg.sender == service.provider, "Only provider can update service");

        service.metadataURI = _metadataURI;
        service.price = _price;
        emit ServiceUpdated(_serviceId, msg.sender, _metadataURI, _price);
    }

    function changeServiceAvailability(uint256 _serviceId, bool _available) public {
        ServiceData storage service = services[_serviceId];
        require(msg.sender == service.provider, "Only provider can change service availability");

        service.available = _available;
        emit ServiceAvailabilityChanged(_serviceId, _available);
    }

    function purchaseService(uint256 _serviceId) public payable {
        ServiceData storage service = services[_serviceId];
        require(service.available, "Service is not available");
        require(msg.value == service.price, "Incorrect payment amount");

        payable(service.provider).transfer(msg.value);
    }
}
