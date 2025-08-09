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
    const signer = createSign('sha256');
    signer.update(data);
    signer.end();
    return signer.sign(privateKey, 'base64');
  }

  static verify(data: string, signature: string, publicKey: string): boolean {
    try {
      const verifier = createVerify('sha256');
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch (e) {
      return false;
    }
  }
}