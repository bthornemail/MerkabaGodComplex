// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Asset {
    struct AssetData {
        address owner;
        string metadataURI;
        bool forSale;
        uint256 price;
    }

    mapping(uint256 => AssetData) public assets;
    uint256 public nextAssetId;

    event AssetRegistered(uint256 indexed assetId, address indexed owner, string metadataURI);
    event AssetUpdated(uint256 indexed assetId, address indexed owner, string metadataURI);
    event AssetListedForSale(uint256 indexed assetId, uint256 price);
    event AssetSaleCancelled(uint256 indexed assetId);
    event AssetSold(uint256 indexed assetId, address indexed oldOwner, address indexed newOwner, uint256 price);

    function registerAsset(string memory _metadataURI) public {
        uint256 assetId = nextAssetId++;
        assets[assetId] = AssetData(msg.sender, _metadataURI, false, 0);
        emit AssetRegistered(assetId, msg.sender, _metadataURI);
    }

    function updateAsset(uint256 _assetId, string memory _metadataURI) public {
        AssetData storage asset = assets[_assetId];
        require(msg.sender == asset.owner, "Only owner can update asset");

        asset.metadataURI = _metadataURI;
        emit AssetUpdated(_assetId, msg.sender, _metadataURI);
    }

    function listAssetForSale(uint256 _assetId, uint256 _price) public {
        AssetData storage asset = assets[_assetId];
        require(msg.sender == asset.owner, "Only owner can list asset for sale");

        asset.forSale = true;
        asset.price = _price;
        emit AssetListedForSale(_assetId, _price);
    }

    function cancelAssetSale(uint256 _assetId) public {
        AssetData storage asset = assets[_assetId];
        require(msg.sender == asset.owner, "Only owner can cancel asset sale");

        asset.forSale = false;
        emit AssetSaleCancelled(_assetId);
    }

    function buyAsset(uint256 _assetId) public payable {
        AssetData storage asset = assets[_assetId];
        require(asset.forSale, "Asset not for sale");
        require(msg.value == asset.price, "Incorrect payment amount");

        address oldOwner = asset.owner;
        asset.owner = msg.sender;
        asset.forSale = false;
        payable(oldOwner).transfer(msg.value);

        emit AssetSold(_assetId, oldOwner, msg.sender, asset.price);
    }
}
