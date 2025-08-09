const fs = require('fs');
const path = require('path');

var ServiceNFT = artifacts.require("ServiceNFT");
// var VertCoin = artifacts.require("../build/contracts/VertCoin.json");
module.exports = async function(deployer) {
  // deployment steps
  // premade address of the VertCoin contract 0x0Fb549071d529FaD5F4feFdad607Da825DEc519B

  const filePath = path.join(__dirname, 'vertCoinAddress.txt');
  const vertCoinAddress = fs.readFileSync(filePath, 'utf8').trim();
  // deployer.deploy(ServiceNFT, "0x55274f1a3A212F07abE2FcdE45B368A94D72d87b");
  await deployer.deploy(ServiceNFT, vertCoinAddress);
  console.log(`ServiceNFT contract deployed with VertCoin contract address: ${vertCoinAddress}`);
};
