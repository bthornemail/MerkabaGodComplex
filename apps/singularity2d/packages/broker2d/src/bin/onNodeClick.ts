import { logger } from "../app";
import EasyMDE from 'easymde'


const extendedKeyInput = document.querySelector("#key") as HTMLInputElement;
const hostInput = document.querySelector("#host-url") as HTMLInputElement;
const hostExtendedKeyInput = document.querySelector("#host-address") as HTMLInputElement;
const graphElement = document.getElementById('graph') as HTMLDivElement;
const connectButton = document.querySelector("#connect") as HTMLButtonElement;
const createButton = document.querySelector("#create") as HTMLButtonElement;
const registerButton = document.querySelector("#register") as HTMLButtonElement;
const activateButton = document.querySelector("#activate") as HTMLButtonElement;
const easyMDE = new EasyMDE({ element: (document.getElementById('controller-area') as HTMLDivElement), });
export default function onNodeClick({ user, client, domElement, tree,node }: any) {
    easyMDE.value(JSON.stringify(node));
    extendedKeyInput.value = node.extendedKey;
    window.localStorage.setItem(node.extendedKey,"")
    logger(JSON.stringify(node));
}