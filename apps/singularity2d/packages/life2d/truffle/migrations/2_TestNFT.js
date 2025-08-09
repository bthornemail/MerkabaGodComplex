const fs = require('fs');
const path = require('path');
var Test = artifacts.require("Test");

module.exports = async function(deployer) {
  // deployment steps
  await deployer.deploy(Test);
  // Write TestNFT contract address to file
  const testNFTAddress = Test.address;
  const filePath = path.join(__dirname, 'testNFTAddress.txt');
  fs.writeFileSync(filePath, testNFTAddress);
  console.log(`TestNFT contract deployed at address: ${testNFTAddress}`);
};
