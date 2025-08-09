import { HDNodeWallet, SigningKey, sha256 } from "ethers";
import Tools from "../../../unity2d/agents/tools";
import { iRegisterEvents } from "../../../unity2d/types/environment/event.register";
import * as THREE from 'three';
import { MerkleTree } from 'merkletreejs'
import { Script } from "node:vm";
// import { iEntity, iDefinitions, iDescription, iContent } from "../vault/interfaces";
import { BLOCK_MATRIX } from "../blockchain/types";
import { TARGET, SOURCE } from "./types";
import { iEntity, iDescription, iDefinitions } from "../../types/interfaces";

export interface iMessage extends iEntity {
    summary: string;
    description?: string;
}
export interface iPackage extends iEntity {
    to: TARGET;
    from: SOURCE;
    description: iDescription;
    payload: BLOCK_MATRIX;
}
export interface iNetwork extends Partial<iDefinitions> {
    messages: {
        outgoing?: {
            [souurce: string]: [...target: string[]];
        };
        incoming?: {
            [target: string]: [...source: string[]];
        };
    };
    connections: {
        peers?: {
            [input: string]: [...outputs: string[]]
        }
        brokers?: {
            [sink: string]: [...streams: string[]];
        }
    };
}