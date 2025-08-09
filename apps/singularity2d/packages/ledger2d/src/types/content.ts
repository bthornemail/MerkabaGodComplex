/*
If i can make pgp as a main feature of content then each content will have a email address attached to it and can then automatically be a refrenced rss feed through email
this will also faciiate automatic authorship and singing
*/
import { Wordlist, WordlistOwl } from "ethers";
import getContentString from "../bin/commands/get.content.string";
import { BASE_JSON, ROOT_OPTIONAL_DATA_TYPE } from './vault';
import { CID } from '../www/service.board/public/modules/multiformats/src/cid';

export type BASE_CONTENT = {
    mime: string;
    content: string; //mime type // application/json
    [key: string]: ROOT_OPTIONAL_DATA_TYPE;
}
export type CONTENT = {
    title?: string;
    summary?: string;
    description?: string;
    date?: string;
    author?: string;
    content: string; //mime type // application/json
    [key: string]: ROOT_OPTIONAL_DATA_TYPE;
}
export type CONTENT = {
    title?: string;
    summary?: string;
    description?: string;
    date?: string;
    author?: string;
    content: string; //mime type // application/json
    [key: string]: ROOT_OPTIONAL_DATA_TYPE;
}
export type CONTENT = {
    title?: string;
    summary?: string;
    description?: string;
    date?: string;
    author?: string;
    content: string; //mime type // application/json
    [key: string]: ROOT_OPTIONAL_DATA_TYPE;
}
export type GET_CONTENT_STRING = (content: Record<string, any>, mimeType?: string)=> string 
export interface iContent {
    getContentString: GET_CONTENT_STRING
}
abstract class BaseContent implements iContent {
    abstract content: string; //mime type // application/json
    [key: string]: any;
    abstract getContentString: GET_CONTENT_STRING;
}
export class Content extends BaseContent {
    title?: string;
    summary?: string;
    description?: string;
    date?: string;
    author?: string;
    content: string; //mime type // application/json
    getContentString: GET_CONTENT_STRING = getContentString;
    constructor(content: BASE_JSON) {
        super()
        this.content = this.getContentString(content);
        Object.entries(content).forEach(([key,value])=>{
            this[key] = value;
        });
    }
}