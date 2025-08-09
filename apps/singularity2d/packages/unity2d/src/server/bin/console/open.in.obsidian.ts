import { spawn } from "node:child_process";
import { BGPT_READLINE_FILEPATH } from "../examples/index.js";
import isCommandAvailable from "./is.command.available.js";
import mainMenu from "../../../components/menu/main.menu.js";


export default function openInObsidian({rl,filePath}:BGPT_READLINE_FILEPATH){
    if (!isCommandAvailable('obsidian')) {
        console.error("It seems Obsidian is not available on your system's PATH.");
        console.log("To set it up:");
        console.log("1. Ensure Obsidian is installed.");
        console.log("2. Add the path to the Obsidian executable to your system's PATH.");
        console.log("3. If you're unsure how to do this, consult the Obsidian documentation or seek help online.");
        mainMenu({rl});
        return;
    }

    const obsidianPath = 'obsidian';
    const child = spawn(obsidianPath, [filePath], {
        detached: true,
        stdio: 'ignore'
    });
    child.unref();
    console.log("Opened in Obsidian.");
    mainMenu({rl});
}