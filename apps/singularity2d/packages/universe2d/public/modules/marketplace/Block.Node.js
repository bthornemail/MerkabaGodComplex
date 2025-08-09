import crypto from 'crypto';
import { CID } from 'multiformats/cid'
import { base64 } from "multiformats/bases/base64"
import { ethers, toUtf8Bytes, sha256, hexlify, randomBytes } from 'ethers';
import { base58btc } from 'multiformats/bases/base58';
import P2PNode from './P2P.Node.js';
import { bright, reset, yellow } from '../bin/consoleColors.js';
import { pipe } from 'it-pipe'

class Block {
	constructor(index, previousHash, timestamp, data, hash) {
		this.index = index;
		// this.previousHash = previousHash.toString();
		this.previousHash = previousHash
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash
	}
}

export default class Blockchain extends P2PNode {
	async buildChainFromLatestBlock(latestBlock) {
		let chain = [latestBlock];
		let currentBlock = latestBlock;

		while (currentBlock && currentBlock.previousHash !== "0") { // Assuming genesis block has previousHash "0"
			try {
				// console.log("currentBlock.previousHash", currentBlock.previousHash);
				const previousBlockCID = currentBlock.previousHash;
				// console.log("previousBlockCID", previousBlockCID);

				// Try to parse the CID, if it fails, it's not a valid CID
				let parsedCID;
				try {
					parsedCID = CID.parse(previousBlockCID);
				} catch (error) {
					console.error("Invalid CID format: ", previousBlockCID, error.message);
					break;
				}

				const previousBlockData = await this.dag.get(parsedCID);
				// console.log("previousBlockData", previousBlockData);

				// Recompute the hash for the block
				const previousBlockHash = await this.calculateHash(
					previousBlockData.index,
					previousBlockData.previousHash,
					previousBlockData.timestamp,
					previousBlockData.data
				);

				const previousBlock = new Block(
					previousBlockData.index,
					previousBlockData.previousHash,
					previousBlockData.timestamp,
					previousBlockData.data,
					previousBlockHash // Assign the recomputed hash
				);

				chain.unshift(previousBlock); // Add to the beginning of the chain array
				currentBlock = previousBlock;

			} catch (error) {
				console.log("Current Block Error", currentBlock);
				console.error("Error while building the chain: ", error);
				break;
			}
		}

		return chain;
	}

	async loadLatestBlock() {
		try {
			let mostRecentTimestamp = -1;
			let mostRecentBlock = null;

			for await (const pin of this.node.pins.ls()) {
				// console.log("metadata", pin.metadata)
				if (pin.metadata.hash && pin.metadata.previousHash) {
					// console.log("loading genesis", pin)
					const cid = pin.cid;
					const blockData = await this.dag.get(cid);
					const timestamp = blockData.timestamp; // Adjust as necessary if the timestamp is located elsewhere

					if (timestamp > mostRecentTimestamp) {
						mostRecentTimestamp = timestamp;
						mostRecentBlock = new Block(blockData.index, blockData.previousHash, timestamp, blockData.data, blockData.hash);
					}
				}

			}

			// console.log(" If a pinned block was found, return it; otherwise, create a new genesis block")
			return mostRecentBlock || await this.createGenesisBlock();

		} catch (error) {
			console.error("Error loading genesis block", error);
			// Handle error appropriately, e.g., by creating a new genesis block if necessary
			return await this.createGenesisBlock();
		}
	}
	async createGenesisBlock() {
		const data = await this.createCID({ info: "Genesis Block" });
		const genesisBlock = new Block(0, "0", Date.now(), data, await this.calculateHash(0, "0", Date.now(), data));
		// const pin = await this.node.pins.add(await this.dag.add(genesisBlock), { metadata: genesisBlock });
		const pin = await this.node.pins.add(await this.dag.add(genesisBlock), { metadata: genesisBlock });
		// console.log("creating genesis", pin)
		return genesisBlock;
	}

	async calculateHash(index, previousHash, timestamp, data) {
		return (await this.dag.add({ index, previousHash, timestamp, data })).toString();
	}
	async createCID(data) {
		return (await this.dag.add(data)).toString();
	}
	async getCID(cid){
		return await this.dag.get(CID.parse(cid))
	}
	getBlockByIndex(index) {
		if (index < 0 || index >= this.chain.length) return null;
		return this.chain[index];
	}
	getBlockByHash(hash) {
		for (const block of this.chain) {
			if (block.hash === hash) return block;
		}
		return null;
	}
	walkBackwardFromBlock(block) {
		let currentBlock = block;
		while (currentBlock && currentBlock.index !== 0) {
			// console.log(currentBlock); // Log each block as it walks back.
			currentBlock = this.getBlockByIndex(currentBlock.index - 1);
		}
		if (currentBlock) console.log(currentBlock); // Finally, log the genesis block or the last valid block.
	}
	async addBlock(data) {
		const previousBlock = await this.loadLatestBlock();
		// const previousBlock = this.getLatestBlock();
		const index = previousBlock.index + 1;
		const timestamp = Date.now();
		const cid = await this.createCID(data);
		const hash = await this.calculateHash(index, previousBlock.hash, timestamp, cid);
		const newBlock = new Block(index, previousBlock.hash, timestamp, cid, hash);
		// this.chain.push(newBlock);
		this.node.libp2p.safeDispatchEvent("block:created", { detail: { newBlock } });
		return await this.node.pins.add(await this.dag.add(newBlock), { metadata: newBlock });
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}
	// new
	async synchronizeWithNetwork() {
		// console.log("peers", peers)
		while (this.node.libp2p.getConnections().length === 0) {
			console.log("Waiting for peers...")
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
		let peers = this.node.libp2p.getConnections();
		// Iterate over connected peers and query for their latest block or block height
		for (const peer of peers) {
			if (!peer) return;
			// console.log("peerId", peer.remoteAddr)
			// console.log("peerId", peer.remotePeer)
			// console.log(JSON.stringify(peer))
			// Logs the PeerId string and the observed remote multiaddr of each Connection
			// const peerLatestBlock = await this.queryPeerForLatestBlock(peer.remoteAddr);
			const peerLatestBlock = await this.queryPeerForLatestBlock(peer.remotePeer);

			// // If the peer has a newer block, start the synchronization process
			// if (this.isNewerBlock(peerLatestBlock)) {
			// 	await this.synchronizeBlocks(peer, peerLatestBlock);
			// }
		}
	}

	async queryPeerForLatestBlock(peer) {
		// console.log("dial",await this.node.libp2p.dial(peer))
		this.node.libp2p.safeDispatchEvent("get-latest-block", { detail: { peer } });
		// try {
		// 	console.log("peer", peer)
		// 	console.log(this.node.libp2p.getProtocols())
		// 	while (!this.node.libp2p.getProtocols().includes("/my-protocol/1.0.0")) {
		// 		console.log("/my-protocol/1.0.0 Waiting for peers...")
		// 		try {
		// 			this.node.libp2p.handle('/my-protocol/1.0.0', async ({ stream }) => {
		// 				let data = ''
		// 				await pipe(
		// 					stream,
		// 					async function (source) {
		// 						for await (const msg of source) {
		// 							data += msg.toString()
		// 						}
		// 						// Process the received message, and reply with the requested data
		// 						await pipe(
		// 							[`Requested data for ${data}`],
		// 							stream
		// 						)
		// 					}
		// 				)
		// 			})
		// 			console.log(this.node.libp2p.getProtocols())
		// 		} catch (error) {
		// 			console.log(error)
		// 			await new Promise((resolve) => setTimeout(resolve, 1000));
		// 		}
		// 		console.log(this.node.libp2p.getProtocols());
		// 	}

		// 	// const { stream } = await this.node.libp2p.dialProtocol(peer, '/my-protocol/1.0.0')
		// 	// await pipe(
		// 	// 	[message], // This would be the 'request' you are sending.
		// 	// 	stream,
		// 	// 	async function (source) {
		// 	// 		for await (const msg of source) {
		// 	// 			console.log('Received:', msg.toString())
		// 	// 		}
		// 	// 	}
		// 	// )
		// } catch (error) {
		// 	console.log(error)
		// }
		// Send a message to the peer requesting their latest block or block height
		// and wait for their response.
		// This will depend on your messaging and network protocol.
	}

	isNewerBlock(block) {
		// Compare the received block with the local latest block
		// and return true if the received block is newer.
		// console.log(yellow, "block -------------------------", block)
		// console.log(yellow, "block -------------------------", this.chain[this.chain.length - 1])
		console.log(block.timestamp > this.chain[this.chain.length - 1].timestamp ? "Found a newer block" : "Latest Blockchain Implemented")
		return block.timestamp > this.chain[this.chain.length - 1].timestamp;
	}

	async synchronizeBlocks(peer, latestBlock) {
		// Request, verify and add the missing blocks from the peer
		// Handle any forks if necessary
		this.chain = await this.buildChainFromLatestBlock(latestBlock);
	}

	async connect(node) {
		await super.connect(node);
		node.libp2p.addEventListener("get-latest-block", async (event) => {
			console.log("get-latest-block", event);
			const peerLatestBlock = await this.loadLatestBlock();
			// If the peer has a newer block, start the synchronization process
			if (this.isNewerBlock(peerLatestBlock)) {
				await this.synchronizeBlocks(null, peerLatestBlock);
			}
			return;
		})
		node.libp2p.addEventListener("new-block", async (event) => {
			console.log(bright,yellow,"new-block added",reset);
			// console.log("new-block", event.detail.newBlock)
			// this.chain.push(event.detail.newBlock);
			await this.node.pins.add(await this.dag.add(event.detail.newBlock), { metadata: event.detail.newBlock });
			// const file = await this.dag.get(CID.parse(cid));
			// return console.log(bright, green, "coin2d:mint", reset, file)
			return;
		})
		try {
			node.libp2p.handle('/my-protocol/1.0.0', async ({ stream }) => {
				let data = ''
				await pipe(
					stream,
					async function (source) {
						for await (const msg of source) {
							data += msg.toString()
						}
						// Process the received message, and reply with the requested data
						await pipe(
							[`Requested data for ${data}`],
							stream
						)
					}
				)
			})
			// console.log(this.node.libp2p.getProtocols())
		} catch (error) {
			console.log(error)
		}
		const latestBlock = await this.loadLatestBlock();
		// console.log("bknknn",latestBlock)
		this.chain = await this.buildChainFromLatestBlock(latestBlock);
		// await this.synchronizeWithNetwork();
	}
	constructor(options) {
		super(options);
	}
}
