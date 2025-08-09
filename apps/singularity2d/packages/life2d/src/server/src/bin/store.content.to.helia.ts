export default async function storeContentToHelia(content: string,fileSysten:any) {
    const encoder = new TextEncoder();
    const cid = await fileSysten.addBytes(encoder.encode(content));
    return cid.toString();
}