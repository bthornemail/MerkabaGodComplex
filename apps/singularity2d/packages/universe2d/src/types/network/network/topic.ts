import { SigningKey } from "ethers";
import setLink from "../../bin/console/set.link";
import { ROOT_DATA_TYPE } from "../storage/vault";
import { CONTEXT } from "../marketplace/context";
import { iRegisterEvents } from "../environment/event.register";
import EventRegister from '../environment/event.register';
import { DOCUMENT } from "../vocabulary/document";
export type PUBLISH = (topic: string, message: ROOT_DATA_TYPE, options?: ROOT_DATA_TYPE) => Promise<number>;
export interface iPublish {
    publish: PUBLISH;
}
export type SUBSCRIBE = (topic: string, options?: ROOT_DATA_TYPE) => Promise<number>;
export interface iSubscribe {
    subscribe: SUBSCRIBE;
}
export type LINK = string;
export type MESSAGES = Set<DOCUMENT>;
export type TOPIC = {
    link: LINK;
}

export abstract class BaseTopic extends EventRegister implements iPublish, iSubscribe, iRegisterEvents {
    abstract link: LINK;
    abstract publish: PUBLISH;
    abstract subscribe: SUBSCRIBE;
}

export class Topic extends BaseTopic {
    link: LINK;
    messages: MESSAGES = new Set()
    publish = async (topic: string, message: ROOT_DATA_TYPE, options?: ROOT_DATA_TYPE): Promise<number> => {
        this.emit(topic, message);
        return 1;
    };
    subscribe = async (topic: string, options?: ROOT_DATA_TYPE): Promise<number> => {
        this.on(topic, (content: DOCUMENT) => {
            this.messages.add(content);
        });
        return 1;
    };
    constructor(context: CONTEXT, signature?: string) {
        super();
        if (signature) {
            this.link = setLink(SigningKey.recoverPublicKey(context.bytes, signature))
        }
    }
}