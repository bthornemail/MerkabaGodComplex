import mainMenu, { BGPT_READLINE_FILEPATH, BGPT_READLINE_FILEPATH_CONTENT } from '../../../components/menu/main.menu.js';
import openInObsidian from './open.in.obsidian.js';
import pipeToApplication from './pipe.to.application.js';
import sendToBGPT from './send.to.chat.gpt.js';
export default function postFileMenu({filePath,content,rl,bGPT}:BGPT_READLINE_FILEPATH_CONTENT) {
    console.log("\nWhat would you like to do with the selected file?");
    console.log("1. Send to BGPT");
    console.log("2. Send to Obsidian Vault");
    console.log("3. Pipe to Application");
    console.log("4. Save to Disk");  // Depending on the modifications you might do
    console.log("5. Discard changes");
    console.log("6. Exit");
    rl.question('Selection: ', (choice: string) => {
        switch (choice) {
            case '1':
                sendToBGPT({ filePath,rl,bGPT});
                break;
            case '2':
                openInObsidian({filePath,rl});
                break;
            case '3':
                pipeToApplication({filePath,rl});
                break;
            case '4':
                console.log("File saved.");  // Placeholder
                postFileMenu({filePath, content,rl,bGPT});
                break;
            case '5':
                console.log("Changes discarded.");  // Placeholder
                postFileMenu({filePath, content,rl,bGPT});
                break;
            case '6':
                mainMenu({rl});
                break;
            default:
                console.log("Invalid choice. Please select again.");
                postFileMenu({filePath, content,rl,bGPT});
                break;
        }
    });
}