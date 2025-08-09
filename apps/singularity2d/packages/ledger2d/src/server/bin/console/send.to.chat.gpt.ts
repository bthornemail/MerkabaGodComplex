import { readFileSync } from "node:fs";
import mainMenu from "../../../components/menu/main.menu.js";
import { BGPT_READLINE_FILEPATH } from "../examples/index.js";
export default function sendToBGPT({ rl,filePath}:BGPT_READLINE_FILEPATH) {
    const content = readFileSync(filePath, 'utf-8');
    // Here, you'll need to send 'content' to BGPT.
    // For simplicity, I'm just outputting it.
    console.log(`Sending to BGPT: ${content}`);
    // After sending to BGPT:
    mainMenu({ rl});
}