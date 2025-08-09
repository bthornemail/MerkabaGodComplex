import { hash } from "crypto";
import { encodeJSON } from "../../../unity2d/bin/encoders/encode.json";
import EventRegister, { iRegisterEvents } from "../../../unity2d/types/environment/event.register";
import { iContent } from "../../types/interfaces";
import { PATH } from "../../types/types";
// import { iContent } from "../vault/interfaces";
// import { PATH } from "../vault/types";
export type HASH = string;
export type LEAF = HASH[];
export type TREE = TREE[];
export type INDEX = number;
export type VECTOR = Float32Array[];
export type MATRIX = VECTOR[];
export type STEP = [path: PATH, content?: iContent];
export type STATE = {
    [change: string]: {
        path: PATH, content?: iContent
    }
};
export type RANGES = {
    [periods: string]: [start: number, ...steps: number[],end:number],
};
export type MEMORY = {
    [merkleRoot: string]: STATE[];
};
export type HISTORY = {
    [merkleRoot: string]: {
        [merkleRoot: string]: STATE[];
    };
};