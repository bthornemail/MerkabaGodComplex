import { generateKeyPair } from '@libp2p/crypto/keys';

/**
 * Generate a key pair.
 * @returns {Promise} - A Promise resolving to the key pair
 */
export default async function createPrivateKey() {
    return generateKeyPair('secp256k1', 256);
}