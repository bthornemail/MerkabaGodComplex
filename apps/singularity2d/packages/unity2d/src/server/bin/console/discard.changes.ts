import { unlinkSync } from "node:fs";
import mainMenu from "../../../components/menu/main.menu.js";
import { BGPT_READLINE_FILEPATH } from "../examples/index.js";

export default function discardChanges({rl,filePath}:BGPT_READLINE_FILEPATH) {
    unlinkSync(filePath);
    console.log("Changes discarded.");
    mainMenu({rl});
}