import { CID } from "multiformats/src/cid";

export default async function getContentFromHelia(cidStr: string,fs:any) {
    const decoder = new TextDecoder();
    let text = '';
    for await (const chunk of fs.cat(CID.parse(cidStr))) {
        text += decoder.decode(chunk, { stream: true });
    }
    return text;
}