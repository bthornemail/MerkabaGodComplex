import { ethers, Wallet } from 'ethers';
import createNode from './node.js';
import { dagJson } from '@helia/dag-json'
import { CID } from 'multiformats';
import { io } from "socket.io-client";
class Node {
    socket;
    wallet;
    node; //helia node
    dag;
    provider;
    constructor(name, provider = false) {
        this.wallet = Wallet.createRandom();
        // this.socket = io("http://127.0.0.1:30303");
        this.provider = provider;

        // create helia node
        createNode().then((node) => {
            this.node = node;
            this.dag = dagJson(node);

            // connect them together
            const multiaddrs = node.libp2p.getMultiaddrs()
            this.domain = {
                name,
                version: '1',
                multiaddr: multiaddrs[0],
                address: this.wallet.address,
                peerId: node.libp2p.peerId
            };
        });
    }

}

class AssetManager extends Node {
    domain;
    types = {
        Asset: [
            { name: 'name', type: 'string' },
            { name: 'cid', type: 'string' }
        ],
        Create: [
            { name: 'asset', type: 'Asset' },
        ]
    };
    register = async ({ value }) => {
        const types = {
            Asset: [
                { name: 'name', type: 'string' },
                { name: 'cid', type: 'string' }
            ],
            Create: [
                { name: 'asset', type: 'Asset' },
            ]
        };
        let signature;
        if (window.ethereum) {
            // A Web3Provider wraps a standard Web3 provider, which is
            // what MetaMask injects as window.ethereum into each page
            const provider = new ethers.providers.Web3Provider(window.ethereum)

            // MetaMask requires requesting permission to connect users accounts
            await provider.send("eth_requestAccounts", []);

            // The MetaMask plugin also allows signing transactions to
            // send ether and pay to change state within the blockchain.
            // For this, you need the account signer...
            const signer = provider.getSigner()
            signature = await signer._signTypedData(this.domain, types, value);
        } else if (this.provider) {
            // If you don't specify a //url//, Ethers connects to the default 
            // (i.e. ``http:/\/localhost:8545``)
            const provider = new ethers.providers.JsonRpcProvider();

            // The provider also allows signing transactions to
            // send ether and pay to change state within the blockchain.
            // For this, we need the account signer...
            const signer = provider.getSigner()
            signature = await signer._signTypedData(this.domain, types, value);
        } else {
            let wallet = ethers.Wallet.createRandom();
            signature = await wallet.signTypedData(this.domain, types, value);
        }
        // this.socket.emit("register:asset", { value, signature })
        return signature;
    }
    create = async ({ name, metadata }) => {
        const cid = this.dag.add(metadata);
        const value = {
            name,
            cid: cid.toString(),
        }
        return value;
    }
    constructor(name = 'Asset Manager') {
        super(name);
        const node = this.node;
        // const socket = this.socket;
        // The named list of all type definitions
        console.log(name + "Peer Id", node.libp2p.peerId)
        // socket.emit("asset-manager:peer-id", node.libp2p.peerId)
        console.log("------------------------------")

        // connect them together
        const multiaddrs = node.libp2p.getMultiaddrs()
        // socket.emit("asset-manager:multiaddr", multiaddrs[0])

        // socket.on("register:asset", async ({ cid, registrationSignature }) => {
        //     console.log({ cid, registrationSignature })
        // });
        // socket.on("connect", async () => {
        //     return console.log("Connected")
        // });
    }
}
export default AssetManager;
(async()=>{
    const am = new AssetManager("Asset Manager");


})()