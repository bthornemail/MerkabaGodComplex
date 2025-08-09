import { execFileSync } from "node:child_process";
import { BGPT_READLINE_FILEPATH } from "../examples/index.js";
import discardChanges from "./discard.changes.js";
import mainMenu from "../../../components/menu/main.menu.js";
import openInObsidian from "./open.in.obsidian.js";
import sendToBGPT from "./send.to.chat.gpt.js";
import startEditor from "./start.editor.js";
import parseReadlineToExecsync, { BGPT_READLINE_COMMAND } from "./get.readline.args.js";

const commandsFromDB: BGPT_READLINE_COMMAND[] = [
  {
    name: "Send to BGPT",
    rpc: {
      method: "sendToBGPTMethod",
      params: ["param1Value", "param2Value"]  // Default parameters to be passed to the RPC method
    },
    allowedArgs: ["--arg1", "--arg2"]  // Allowed arguments from the user input
  },
  {
    name: "Save to disk",
    rpc: {
      method: "saveToDiskMethod",
      params: ["defaultFilename", "/default/path"]  // Default parameters
    },
    allowedArgs: ["--filename", "--path"]  // User input arguments
  },
  // ... similar structure for other commands
];
export default function postEditMenu({ filePath, rl }: BGPT_READLINE_FILEPATH) {
  console.log("\nWhat would you like to do with the edited content?");
  console.log("1. Send to BGPT");
  console.log("2. Save to disk");
  console.log("3. Discard changes");
  console.log("4. Open in Obsidian");
  let commnads = {
    obsidian: "4. Open in Obsidian",
    save: "2. Save to disk",
    discard: "3. Discard changes",
    sendBGPT: "1. Send to BGPT",
  };
  rl.question("Selection: ", (choice: string) => {
    // throw new Error("Selection: ");

    choice.trim();
    console.log(choice);

    const { command, args } = parseReadlineToExecsync(choice);
    console.log(command);
    execFileSync(command, args);
    // switch (command) {
    //   case "1":
    //     sendToBGPT({ filePath, rl });
    //     break;
    //   case "2":
    //     console.log("Content saved.");
    //     mainMenu({ rl });
    //     break;
    //   case "3":
    //     discardChanges({ rl, filePath });
    //     break;
    //   case "4":
    //     openInObsidian({ rl, filePath });
    //     break;
    //   default:
    //     console.log("Invalid choice. Please select again.");
    //     startEditor({ editor: "emacs", rl, filePath });
    //     break;
    // }
  });
}
