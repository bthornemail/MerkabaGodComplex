const fs = require('fs');
const path = require('path');
var TaskNFT = artifacts.require("Task");

module.exports = async function(deployer) {
  // deployment steps
  await deployer.deploy(TaskNFT);
  // Write TaskNFT contract address to file
  const taskNFTAddress = TaskNFT.address;
  const filePath = path.join(__dirname, 'taskNFTAddress.txt');
  fs.writeFileSync(filePath, taskNFTAddress);
  console.log(`TaskNFT contract deployed at address: ${taskNFTAddress}`);
};
