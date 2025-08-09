import RelayP2P from "./relay.p2p";
import { generateKeyPair, generateKeyPairFromSeed} from '@libp2p/crypto/keys'

export type TICK = {
    peerId: string;
    signature: string;
    merkleRoot: string;
    vectorClock: { [peerId: string]: number };
};
export type TOCK = {
    address: string;
    entity: string;
    identity: { [peerId: string]: number };
    signature: string; // MerkleRoot as a signature of the graph state
};
export type CLOCK_ENTRY = [index: string, child: number];
export type CLOCK_TICK = [...CLOCK_ENTRY, start: number]
export type CLOCK_TOCK = [...CLOCK_TICK, stop: number]
export type LOGIC_CLOCK = Array<CLOCK_ENTRY | CLOCK_TICK | CLOCK_TOCK>
// export type CLOCK = Array<[index: string, child: number,start: number,stop: number]>

const seed = new Uint8Array([
    40, 10, 196, 7, 245, 215, 252, 172,
    239, 107, 78, 229, 36, 139, 16, 134,
    27, 157, 243, 211, 84, 68, 102, 209,
    3, 127, 20, 76, 245, 8, 35, 3
]);

(async () => {
    const key = await generateKeyPair("Ed25519")
    
    // console.log(key.raw)
    // const server = new P2P(key.raw);
    const server = new RelayP2P({ identity: key.publicKey.toString() });
    // await server.start({privateKey: key})
    await server.start()
})();