const fs = require('fs');
const path = require('path');
var VertCoin = artifacts.require("../contracts/VertCoin.sol");

module.exports = async function(deployer) {
  // deployment steps
  await deployer.deploy(VertCoin);
  // Write VertCoin contract address to file
  const vertCoinAddress = VertCoin.address;
  const filePath = path.join(__dirname, 'vertCoinAddress.txt');
  fs.writeFileSync(filePath, vertCoinAddress);
  console.log(`VertCoin contract deployed at address: ${vertCoinAddress}`);
};
