import { execSync, spawn } from "node:child_process";
import postEditMenu from "./post.edit.menu.js";
import { BGPT_READLINE_EDITOR_FILEPATH, BGPT_READLINE_EDITOR_FILEPATH_FILENAME_ARGUMENTS, BGPT_READLINE_FILEPATH_FILENAME, BGPT_READLINE_FILEPATH_FILENAME_ARGUMENTS } from "../examples/index.js";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BGPT_READLINE_EDITOR_FILEPATH_FILENAME } from '../examples/index';
export default function startEditor({editor,rl,filePath}:BGPT_READLINE_EDITOR_FILEPATH | BGPT_READLINE_EDITOR_FILEPATH_FILENAME |BGPT_READLINE_EDITOR_FILEPATH_FILENAME_ARGUMENTS){
    const child = spawn(editor, [filePath], {
        detached: true,
        stdio: 'inherit'
    });

    try {
        // Open the file with Emacs and wait for the user to finish editing
        execSync(`${editor} "${filePath}"`, { stdio: 'inherit' });
        console.log(`Edited and saved: ${filePath}`);

        // add a cid to the end of the file path to avoid overwriting the original file
        // Write the output to a temporary file
        const tempFilePath = join(tmpdir(), 'temp_emacs_edit.txt');
        // Read the edited contents back
        const editedContent = readFileSync(tempFilePath, 'utf8');
        startEditor({editor,filePath:editedContent,rl});
        return;
    } catch (error) {
        console.error('Failed to edit the file with Emacs.', error);
    }
    child.on('exit', (exitCode: number) => {
        console.log(`${editor} exited with code ${exitCode}`);
        postEditMenu({filePath,rl});
    });
}