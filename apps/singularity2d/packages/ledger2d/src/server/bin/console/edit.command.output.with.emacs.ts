import { ExecSyncOptions, execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BGPT_READLINE_FILEPATH } from "../examples/index.js";
import startEditor from "./start.editor.js";

export  default function editCommandBuffer({filePath,rl }:BGPT_READLINE_FILEPATH): string {
    const execOptions: ExecSyncOptions = {
        encoding: 'utf8',
        stdio: 'pipe'
    };

    try {
        // Capture the output of the command
        const output = execSync(filePath, execOptions);
        // add a cid to the end of the file path to avoid overwriting the original file
        // Write the output to a temporary file
        const tempFilePath = join(tmpdir(), 'temp_emacs_edit.txt');
        writeFileSync(tempFilePath, output, 'utf8');

        // Open the file with Emacs and wait for the user to finish editing
        execSync(`emacs "${tempFilePath}"`, { stdio: 'inherit' });

        // Read the edited contents back
        const editedContent = readFileSync(tempFilePath, 'utf8');
        startEditor({editor:"emacs",filePath:editedContent,rl});
        return editedContent;
    } catch (error) {
        console.error('Failed to edit the command output with Emacs.', error);
        return '';
    }
}

// Example usage
// const editedContent = editCommandOutputWithEmacs('echo "Hello, World!"');
// console.log(editedContent);