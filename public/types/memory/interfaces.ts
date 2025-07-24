import { hash } from "crypto";
import { encodeJSON } from "../../../unity2d/bin/encoders/encode.json";
import EventRegister, { iRegisterEvents } from "../../../unity2d/types/environment/event.register";
// import { iContent } from "../vault/interfaces";
// import { SINK, STREAM } from "../vault/types";
import { iBlock } from "../blockchain/interfaces";
import { BLOCK_MATRIX } from "../blockchain/types";
import { STATE, HISTORY } from "./types";
import { iContent } from "../../types/interfaces";
import { SINK, STREAM } from "../network/types";
export interface iState {
    state: STATE;
}
export interface iHistory {
    history: HISTORY;
}
export interface iMemory {
    dynamicBuffer: SharedArrayBuffer;
    position: number;
}
export interface iHaveMemory extends Partial<iState> {
    write(data: string, sink?: SINK): Promise<{ id: number, bytes: Uint8Array, time: number }>

    read(size: number, stream?: STREAM): string;

    access(startIndex: number, endIndex: number, stream?: STREAM): DataView
}
export interface iUseMemory extends Required<iHistory> {
    decode(bytes: BLOCK_MATRIX): iContent;
    encode(content: iContent): BLOCK_MATRIX;
    add(block: BLOCK_MATRIX): Promise<iBlock>
    view(block: iBlock): Promise<DataView>
    import(blocks: Required<iBlock>[][]): Promise<void>;
    export(): Promise<iBlock[][]>;
    test(): Promise<void>
}