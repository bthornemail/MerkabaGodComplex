import { STREAMING_READLINE_INPUT_INIT_MESSAGES_HANDLE_CHAT } from "../../../components/menu/main.menu.js";
import showHelp from "./show.help.js";

const processInput = async ({input,initMessages,streaming,rl,handleChat}:STREAMING_READLINE_INPUT_INIT_MESSAGES_HANDLE_CHAT) => {
    const command = input.split(' ')[0]; // Assuming commands are the first word of the input string

    switch (command) {
        case '/system':
            console.log('System message edit mode');
            initMessages[0] = {
                role: "system",
                content: `bot:${command}:system`
            }
            // Handle system logic
            break;
        case '/stream':
            console.log('Streaming mode');
            streaming = !streaming;
            // initMessages[0] = {
            //     role: "system",
            //     content: `bot:${command}:system`
            // }
            // Handle system logic
            break;

        case '/assistant':
            console.log('Assistant message edit mode');
            // Handle assistant logic
            initMessages[1] = {
                role: "system",
                content: `bot:${command}:system`
            }
            break;

        case '/good':
            // Display list of commands
            let count = 0
            console.log("You entered:", ++count);
            process.stdout.write('\x1b[0G\x1b[0K');
            console.log("You entered:", ++count);
            console.log("You entered:", ++count);
            break;

        // case '/bad':
        //     // Display list of commands
        //     let bad_count = 0
        //     console.log("You entered:", ++bad_count);
        //     rl.cursorTo(process.stdout, 0);
        //     rl.clearLine(process.stdout, 1);
        //     console.log("You entered:", ++bad_count);
        //     console.log("You entered:", ++bad_count);
        //     break;
        case '/help':
            // Display list of commands
            showHelp();
            break;
        case '/chat':
        default:
            // Handle chatbot interaction, for simplicity, we'll echo the input
            try {
                await handleChat(command, input);
            } catch (error) {
                console.log(error)
            }
            break;
    }
}
export default processInput;