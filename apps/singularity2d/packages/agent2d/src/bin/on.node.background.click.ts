import EasyMDE from 'easymde'


const extendedKeyInput = document.querySelector("#key") as HTMLInputElement;
export default async function onNodeBackgroundClick({ user, client, domElement, tree,node,editor }: any): Promise<void> {
    editor.value("");
    extendedKeyInput.value = "";
    return;
}