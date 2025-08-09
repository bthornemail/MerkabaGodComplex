import { createSign, createVerify, generateKeyPairSync } from 'crypto';
import { KeyPair } from './types';

export class CryptoUtil {
  static generateKeyPair(): KeyPair {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  static sign(data: string, privateKey: string): string {
    const signer = createSign('SHA256');
    signer.update(data);
    signer.end();
    return signer.sign(privateKey, 'base64');
  }

  static verify(data: string, signature: string, publicKey: string): boolean {
    try {
      const verifier = createVerify('SHA256');
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch (e) {
      return false;
    }
  }

  static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    // Add additional mixing to improve distribution
    hash ^= hash >>> 16;
    hash *= 0x85ebca6b;
    hash ^= hash >>> 13;
    hash *= 0xc2b2ae35;
    hash ^= hash >>> 16;
    return Math.abs(hash);
  }
}