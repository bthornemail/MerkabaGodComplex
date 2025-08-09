import { resolve } from 'node:path';
import { readFileSync } from 'fs';
import postFileMenu from './post.file.menu.js';
import { BGPT_READLINE_FILEPATH } from '../../../components/menu/main.menu.js';
export default function selectFile({filePath,rl}:BGPT_READLINE_FILEPATH) {
    filePath = resolve(filePath); // Resolve to absolute path
    const content = readFileSync(filePath, 'utf8');
    postFileMenu({filePath, content,rl,bGPT});
}

