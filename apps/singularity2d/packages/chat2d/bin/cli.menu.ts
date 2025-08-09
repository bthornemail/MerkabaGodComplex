import startEditor from "./start.editor.js";
import startREPLSession from "../../../components/menu/start.repl.session.js";
import startChatMode from '../../../components/menu/start.chat.mode.js';
import { BGPT_READLINE } from "../examples/index.js";
import showWelcomeMessage from "../../../components/menu/show.welcome.message.js";
import openSystemCamera from "./open.system.camera.js";
import JsonRpcCli from "../json.rpc.cli.js";
import peerId from '../utils/new.peer.id.js';

export type CLI_MENU_PROPS = {
    title: string;
    summary?: string;
    description?: string;
    menu?: [string, string][];
    alert?: string;
} | undefined
const cliMenu = ({ rl, title, summary, description, menu, alert }: BGPT_READLINE & CLI_MENU_PROPS) => {
    rl.question('Selection: ', (choice: string) => {
        switch (choice) {
            case '0':
                showWelcomeMessage({ title: 'CID-RPC', summary: 'Run and/or request CID processes', description: "CID-RPC is a command line interface for running and/or requesting CID processes" });
                const rpc = new JsonRpcCli({ publicKey: peerId.publicKey });
                break;
            case '1':
                showWelcomeMessage({ title: 'Chat Mode', summary: 'Chat with me through natural language', description: "Chat with me by typing your messages and questions. I will do my best to understand and respond to help you out." });
                startChatMode({ rl });
                break;
            case '2':
                // rl.close();
                startREPLSession({ rl });
                break;
            case '3':
                startEditor({ editor: 'nano', filePath: choice, rl });
                break;
            case '4':
                startEditor({ editor: 'emacs', filePath: choice, rl });
                break;
            case '5':
                startEditor({ editor: 'code', filePath: choice, rl });  // Common command for VS Code
                break;
            case '6':
                startEditor({ editor: 'obsidian', filePath: choice, rl });
                break;
            case '7':
                // TODO: Implement Camera functionality
                console.log("Camera not implemented yet.");
                rl.pause()
                openSystemCamera()
                rl.resume()
                cliMenu({ rl });
                break;
            case '8':
                // TODO: Implement Audio functionality
                console.log("Audio not implemented yet.");
                cliMenu({ rl });
                break;
            case '9':
                // TODO: Implement Video functionality
                console.log("Video not implemented yet.");
                cliMenu({ rl });
                break;
            case '10':
                // TODO: Implement File functionality
                console.log("File option not implemented yet.");
                cliMenu({ rl });
                break;
            case '11':
                rl.close();
                process.exit(0);
                break;
            default:
                console.log("Invalid choice. Please select again.");
                cliMenu({ rl });
                break;
        }
    });
}
export default cliMenu;