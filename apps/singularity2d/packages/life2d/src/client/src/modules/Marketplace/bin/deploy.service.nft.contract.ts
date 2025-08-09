import { ethers } from "ethers";
import ServiceNFT from "../contracts/ServiceNFT.json";

export default async function deployServiceNFTContract(signer: any) {
    // Get the Contract Factory
    const contractFactory = new ethers.ContractFactory(
        ServiceNFT.abi,
        ServiceNFT.bytecode,
        signer
    );
    // Deploy the Contract
    console.log(`ServiceNFT Contract deployment in progress...`);
    const deployment = await contractFactory.deploy() as ethers.Contract;
    await deployment.wait();
    console.log(`ServiceNFT Contract deployed at: ${deployment.address}`);
    return deployment.address;
}
