const fs = require('fs');
const path = require('path');
var VertCoin = artifacts.require("VertCoin");
var TestNFT = artifacts.require("Test");
var TaskNFT = artifacts.require("Task");
var ExamNFT = artifacts.require("Exam");

module.exports = async function(deployer) {
  // Get contract addresses from files
  const vertCoinAddress = fs.readFileSync(path.join(__dirname, 'vertCoinAddress.txt')).toString();
  const testNFTAddress = fs.readFileSync(path.join(__dirname, 'testNFTAddress.txt')).toString();
  const taskNFTAddress = fs.readFileSync(path.join(__dirname, 'taskNFTAddress.txt')).toString();

  // deployment steps
  await deployer.deploy(ExamNFT, taskNFTAddress, testNFTAddress, vertCoinAddress);
  // Write ExamNFT contract address to file
  const examNFTAddress = ExamNFT.address;
  const filePath = path.join(__dirname, 'examNFTAddress.txt');
  fs.writeFileSync(filePath, examNFTAddress);
  console.log(`ExamNFT contract deployed at address: ${examNFTAddress}`);
};
