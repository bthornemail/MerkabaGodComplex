// import { iContent } from "../vault/interfaces";
import { iContent } from "../../types/interfaces";
import { BLOCK_HASH } from "./types";
export interface iBlock {
    entity?: string;
    previous?: BLOCK_HASH;
    hash?: BLOCK_HASH; // Hashed of Encrypted Weights and/or Encrypted Weights & Features
    signature?: string;
    timestamp?: number;
    content?: iContent;
}