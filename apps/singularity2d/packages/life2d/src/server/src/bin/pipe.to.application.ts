import { spawn } from "child_process";
import { createReadStream } from "fs";
import postFileMenu from "./post.file.menu.js";
import { BGPT_READLINE_FILEPATH, readline } from "../../../components/menu/main.menu.js";
export default function pipeToApplication({ filePath, rl,bGPT }: BGPT_READLINE_FILEPATH) {
    rl.question('Enter the application you want to use (e.g. "grep"): ', (appCommand: string) => {
        rl.question(`Enter arguments for ${appCommand} (space-separated): `, (userInput: string) => {
            const appArgs = userInput.split(' ');

            const appProcess = spawn(appCommand, appArgs);

            // Reading the file and piping its content to the application
            const fileStream = createReadStream(filePath);
            fileStream.pipe(appProcess.stdin);

            // Collect data from the application's output
            let outputData = '';
            appProcess.stdout.on('data', (data) => {
                outputData += data;
            });

            // Handle errors from the application
            appProcess.stderr.on('data', (data) => {
                console.error(`Error from ${appCommand}: ${data}`);
            });

            // Handle application exit and return to the previous menu
            appProcess.on('exit', (code) => {
                if (code === 0) {
                    console.log(`Output from ${appCommand}:\n${outputData}`);
                } else {
                    console.error(`${appCommand} exited with code ${code}`);
                }
                postFileMenu({ filePath, content:outputData, rl,bGPT });  // Returning to the previous menu
            });
        });
    });
}