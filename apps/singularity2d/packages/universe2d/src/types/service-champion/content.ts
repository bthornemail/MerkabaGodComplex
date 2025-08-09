import getContentString from "../bin/get.content.string";

export type CONTENT = {
    title: string;
    summary?: string;
    description?: string;
    date?: string;
    author: string;
    content?: string; //mime type // application/json
    [key: string]: string | Uint8Array | undefined;
}
export interface iContent {
    title: string;
    summary?: string;
    description?: string;
    date?: string;
    author: string;
    // content?: string; //mime type // application/json
    [key: string]: string | Uint8Array | undefined;
}
export class Content implements iContent {
    title: string;
    summary?: string;
    description?: string;
    date?: string;
    author: string;
    content: string; //mime type // application/json
    [key: string]: any;
    constructor(content: CONTENT) {
        Object.assign(this, { content: getContentString(content) }, content)
    }
}