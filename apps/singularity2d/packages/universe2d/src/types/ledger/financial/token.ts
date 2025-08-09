import * as secp from '@noble/secp256k1';
// import { VERT_COIN_TX_INPUT } from "./token.exchange.types";
import { TransactionLike} from "ethers";

export default  class Token {
    id: string;
    address:string;
    value: number;
    constructor(input: TransactionLike){
    // constructor(input: VERT_COIN_TX_INPUT){
        this.value = input.value as number;
        this.address = input.from!;
        this.id = secp.utils.randomPrivateKey().toString();
    }
} 