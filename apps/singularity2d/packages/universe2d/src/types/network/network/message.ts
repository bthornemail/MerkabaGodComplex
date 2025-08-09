export type MESSGE_PLACEHOLDER = {
    from?: string;
    to?: string;
    body: string;
}
export abstract class BaseMessage  {
    abstract from: string;
    abstract to: string;
    abstract body: string;
    abstract attachments?: string[];
}

export class Message extends BaseMessage {
    from: string;
    to: string;
    body: string;
    attachments?: string[] | undefined;
    constructor(message: MESSGE_PLACEHOLDER, signature?: string) {
        super();
    }
}