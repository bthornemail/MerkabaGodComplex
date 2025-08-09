import { ExecSyncOptions, execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BGPT_READLINE_FILEPATH } from "../examples/index.js";
import startEditor from '../../../../temp/Main/BCLI/bin/start.editor';

export default function editWithEmacs({filePath,rl }:BGPT_READLINE_FILEPATH): void {
    try {
        // Open the file with Emacs and wait for the user to finish editing
        execSync(`emacs "${filePath}"`, { stdio: 'inherit' });
        console.log(`Edited and saved: ${filePath}`);

        // add a cid to the end of the file path to avoid overwriting the original file
        // Write the output to a temporary file
        const tempFilePath = join(tmpdir(), 'temp_emacs_edit.txt');
        // Read the edited contents back
        const editedContent = readFileSync(tempFilePath, 'utf8');
        startEditor({editor:"emacs",filePath:editedContent,rl});
        return;
    } catch (error) {
        console.error('Failed to edit the file with Emacs.', error);
    }
    
}