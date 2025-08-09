import React, { useState, useEffect } from 'react';
import useAssetNFTContract from '../hooks/useAssetNFTContract';

const AssetList: React.FC = () => {
  const { contract } = useAssetNFTContract();
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    if (contract) {
      fetchAssets();
    }
  }, [contract]);

  const fetchAssets = async () => {
    if (!contract) return;

    try {
      const assetsCount = await contract.totalSupply();
      const assetsPromises = [];

      for (let i = 0; i < assetsCount; i++) {
        assetsPromises.push(contract.assets(i));
      }

      const assetsData = await Promise.all(assetsPromises);
      setAssets(assetsData);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  return(
    <div>
      <h1>Assets List</h1>
      {assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <ul>
          {assets.map((asset, index) => (
            <li key={index}>
              <h2>{asset.name}</h2>
              <p>Description: {asset.description}</p>
              <p>Price: {asset.price}</p>
              <p>Security Deposit: {asset.securityDeposit}</p>
              <p>Repair Cost: {asset.repairCost}</p>
              <p>Total Loss Cost: {asset.totalLossCost}</p>
              <p>Metadata Hash: {asset.metadataHash}</p>
              <p>Rented: {asset.isRented ? 'Yes' : 'No'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssetList;
