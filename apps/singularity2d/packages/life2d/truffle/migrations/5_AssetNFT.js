const fs = require('fs');
const path = require('path');

var AssetNFT = artifacts.require("AssetNFT");
module.exports = async function(deployer) {
  // deployment steps
  // await deployer.deploy(AssetNFT);
  // Read VertCoin contract address from file
  const filePath = path.join(__dirname, 'vertCoinAddress.txt');
  const vertCoinAddress = fs.readFileSync(filePath, 'utf8').trim();
  // premade address of the VertCoin contract 0x0Fb549071d529FaD5F4feFdad607Da825DEc519B
  // deployer.deploy(AssetNFT, "0x55274f1a3A212F07abE2FcdE45B368A94D72d87b");
  deployer.deploy(AssetNFT,vertCoinAddress);
  console.log(`AssetNFT contract deployed with VertCoin contract address: ${vertCoinAddress}`);
};
