// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AssetNFT is ERC721 {
    struct Asset {
        string metadata;
        bool rented;
        uint256 rentalPrice;
        uint256 duration;
        uint256 rentedAt;
        address renter;
    }

    mapping(uint256 => Asset) private assets;

    event AssetRegistered(uint256 indexed assetId, address indexed owner, string metadata);
    event AssetRented(uint256 indexed assetId, address indexed renter, uint256 duration, uint256 rentalPrice);
    event AssetReturned(uint256 indexed assetId, address indexed renter);
    event AssetTransferred(uint256 indexed assetId, address indexed previousOwner, address indexed newOwner);

    constructor() ERC721("AssetNFT", "ANFT") {}

    function registerAsset(string memory _metadata) external {
        uint256 assetId = totalSupply() + 1;
        _safeMint(msg.sender, assetId);
        assets[assetId] = Asset(_metadata, false, 0, 0, 0, address(0));
        emit AssetRegistered(assetId, msg.sender, _metadata);
    }

    function rentAsset(uint256 _assetId, uint256 _duration, uint256 _rentalPrice) external {
        require(_isAssetExist(_assetId), "Asset does not exist");
        require(!assets[_assetId].rented, "Asset is already rented");

        Asset storage asset = assets[_assetId];
        asset.rented = true;
        asset.rentalPrice = _rentalPrice;
        asset.duration = _duration;
        asset.rentedAt = block.timestamp;
        asset.renter = msg.sender;

        emit AssetRented(_assetId, msg.sender, _duration, _rentalPrice);
    }

    function returnAsset(uint256 _assetId) external {
        require(_isAssetExist(_assetId), "Asset does not exist");
        require(assets[_assetId].rented, "Asset is not rented");
        require(assets[_assetId].renter == msg.sender, "Only the renter can return the asset");

        Asset storage asset = assets[_assetId];
        asset.rented = false;
        asset.rentalPrice = 0;
        asset.duration = 0;
        asset.rentedAt = 0;
        asset.renter = address(0);

        emit AssetReturned(_assetId, msg.sender);
    }

    function transferAsset(uint256 _assetId, address _newOwner) external {
        require(_isAssetExist(_assetId), "Asset does not exist");
        require(ownerOf(_assetId) == msg.sender, "Only the asset owner can transfer the asset");

        _transfer(msg.sender, _newOwner, _assetId);
        emit AssetTransferred(_assetId, msg.sender, _newOwner);
    }

    function getAssetDetails(uint256 _assetId)
        external
        view
        returns (
            string memory metadata,
            bool rented,
            uint256 rentalPrice,
            uint256 duration,
            uint256 rentedAt,
            address renter
        )
    {
        require(_isAssetExist(_assetId), "Asset does not exist");

        Asset storage asset = assets[_assetId];
        return (
            asset.metadata,
            asset.rented,
            asset.rentalPrice,
            asset.duration,
            asset.rentedAt,
            asset.renter
        );
    }

    function _isAssetExist(uint256 _assetId) private view returns (bool) {
        return ownerOf(_assetId) != address(0);
    }
}