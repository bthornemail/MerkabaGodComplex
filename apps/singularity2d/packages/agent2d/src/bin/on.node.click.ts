import { logger } from "../app";
import EasyMDE from 'easymde'


const extendedKeyInput = document.querySelector("#key") as HTMLInputElement;
export default async function onNodeClick({ user, client, domElement, tree,node ,editor}: any): Promise<void> {
    console.log(node.org);
    editor.edit(node.org);//value(node.org);
    extendedKeyInput.value = node.extendedKey;
    // window.localStorage.setItem(node.extendedKey,"")
    // logger(JSON.stringify(node));
    logger(node.extendedKey);
    return;
}