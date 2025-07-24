/*
If i can make pgp as a main feature of content then each content will have a email address attached to it and can then automatically be a refrenced rss feed through email
this will also faciiate automatic authorship and singing
*/
import { BASE_JSON, ROOT_OPTIONAL_DATA_TYPE } from '../storage/vault';

export type BASE_DOCUMENT = {
    mime: string;
    content: string; //mime type // application/json
    [key: string]: ROOT_OPTIONAL_DATA_TYPE;
}
export type DOCUMENT = {
    title?: string;
    summary?: string;
    description?: string;
    date?: string;
    author?: string;
    images?:string[];
    tags?: string[];
    keywords?: string;
    content: string; //mime type // application/json
    [key: string]: ROOT_OPTIONAL_DATA_TYPE;
}
export type GET_DOCUMENT_STRING = (content: Record<string, any>, mimeType?: string)=> string 
export interface iContent {
    getDocumentString: GET_DOCUMENT_STRING
}
abstract class BaseDocument implements iContent {
    abstract content: string; //mime type // application/json
    [key: string]: any;
    abstract getDocumentString: GET_DOCUMENT_STRING;
}
export class Document extends BaseDocument {
    title?: string;
    summary?: string;
    description?: string;
    date?: string;
    author?: string;
    content: string; //mime type // application/json
    getDocumentString: GET_DOCUMENT_STRING = (content: Record<string, any>, mimeType?: string) => JSON.stringify({content,mimeType});
    constructor(content: BASE_JSON) {
        super()
        this.content = this.getDocumentString(content);
        Object.entries(content).forEach(([key,value])=>{
            this[key] = value;
        });
    }
}