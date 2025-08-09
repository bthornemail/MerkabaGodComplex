import { SigningKey, HDNodeWallet } from 'ethers';
import { io, Socket } from 'socket.io-client';
import { blue, reset, yellow, bright, red, getDirName, formatMarkdown, getAllFilesInDirectory, green } from "../..";

export type TESTER = {
    identity: string;
    encryptedWallet: string;
    keyStore: string;
    signer: SigningKey;
    wallet: HDNodeWallet;
    password: string;
    extendedKey: string;
    host: string;
    protocol: string;
    port: number;
    merkleRoot: string;
    // socket: Socket;
  }
  export function generateTester(identity: string, phrase: string, password?: string, path: string = "m/369/0", host: string = "127.0.0.1", protocol: string = "ws", port: number = 3883): TESTER {
    // const wallet = HDNodeWallet.fromMnemonic(Mnemonic.fromEntropy(privateKey));
    const wallet = HDNodeWallet.fromPhrase(phrase, password, path);
    const signer = wallet.signingKey
    const keyStore = wallet.encryptSync(password ?? wallet.address);
    return { keyStore, encryptedWallet: keyStore, identity, signer, wallet, password: password ?? wallet.address, extendedKey: wallet.extendedKey, host, protocol, port, merkleRoot: "" };
  }