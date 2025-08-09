// Import required modules from libp2p, ethers, and libp2p-peer-id
import { generateKeyPair, marshalPublicKey, marshalPrivateKey, importKey } from '@libp2p/crypto/keys';
import { peerIdFromKeys } from '@libp2p/peer-id';
import { ethers, Wallet } from 'ethers';
import createPrivateKey from './create.private.key.js';

import QRCode from 'qrcode'

/**
 * Generate a Peer ID from a given key pair.
 * @param {Object} keyPair - Key pair for generating the Peer ID
 * @returns {Promise} - A Promise resolving to the Peer ID
 */
async function createPeerIdFromKeyPair(keyPair) {
    const marshalledPublicKey = marshalPublicKey(keyPair.public);
    const marshalledPrivateKey = marshalPrivateKey(keyPair);
    return peerIdFromKeys(marshalledPublicKey, marshalledPrivateKey);
}

/**
 * Convert a Uint8Array private key to an Ethereum-compatible hex string.
 * @param {Uint8Array} uint8ArrayKey - Private key as Uint8Array
 * @returns {string} - Ethereum-compatible hex string
 */
function convertToEthereumPrivateKey(uint8ArrayKey) {
    return '0x' + Buffer.from(uint8ArrayKey).toString('hex');
}

/**
 * Create both a Peer ID and Ethereum Wallet using the same key pair.
 * @param {Object} _keyPair - Optional key pair for generating Peer ID and Ethereum Wallet
 * @returns {Promise} - A Promise resolving to an object with the Peer ID and Ethereum Wallet
 */
async function createEntities(_keyPair) {
    try {
        const keyPair = _keyPair || await generateKeyPair('secp256k1', 256);
        if (!keyPair._key || !keyPair._publicKey) throw new Error('Keys are not generated properly.');

        const peerId = await createPeerIdFromKeyPair(keyPair);
        const ethereumPrivateKey = convertToEthereumPrivateKey(keyPair._key);
        const wallet = new Wallet(ethereumPrivateKey);

        return { peerId, wallet };
    } catch (error) {
        console.error("Error creating entities:", error);
    }
}


/**
 * Generate private key image.
 * @returns {Promise} - A Promise resolving to the private key image
 */
async function createPrivateKeyImage(privateKey, type) {
    let image;
    switch (type) {
        case "dataUrl":
            image = await QRCode.toDataURL(privateKey);
            break;
        case "svg":
            image = await QRCode.toString(privateKey, { type: 'svg', width: 256 });
            break;
        default:
            image = await QRCode.toString(privateKey, { type: 'terminal', width: 256 });
            break;
    }
    console.log(image);
    console.log("Created Peer ID Private Key For", privateKey);
    return image;
}
/**
 * Default function to create a Peer ID and Ethereum Wallet.
 * @returns {Promise} - A Promise resolving to the created Peer ID and Ethereum Wallet
 */
export default async function createAccount(passwd, key, getPrivateKey) {
    try {
        const keyPair = key ? await importKey(key, passwd) : await createPrivateKey();
        const { peerId, wallet } = await createEntities(keyPair);
        // console.log("Successfully created entities:", { peerId: peerId.toString(), wallet: wallet.address });
        if (getPrivateKey) {
            const privateKey = await keyPair.export(passwd, "libp2p-key");
            getPrivateKey(privateKey);
        }
        return { peerId, wallet };
    } catch (error) {
        console.error("Error in the process:", error);
    }
}
// Export specific functions
export { createEntities, createPrivateKey };
