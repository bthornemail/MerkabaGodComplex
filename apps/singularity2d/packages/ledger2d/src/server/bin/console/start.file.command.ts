import { start } from "node:repl";
import mainMenu, { BGPT_READLINE } from "../../../components/menu/main.menu";
import selectFile from "./select.file";
export default function startFileCommandMode({rl,bGPT,}:BGPT_READLINE) {
    const r = start({ prompt: 'File-Mode> ' });
    r.context.selectFile = selectFile;
    r.on('exit', () => {
        console.log('Exiting file command mode...');
        mainMenu({rl});
    });
}