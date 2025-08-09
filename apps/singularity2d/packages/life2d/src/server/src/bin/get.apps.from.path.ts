import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export default function getAppsFromPath(): string[] {
    const allFiles: string[] = [];
    const pathSeparator = process.platform === "win32" ? ";" : ":";

    // Split PATH by the appropriate separator and filter out non-existent directories
    const directories = process.env.PATH?.split(pathSeparator).filter(directory => existsSync(directory)) || [];

    for (const directory of directories) {
        try {
            // Read all files in the directory
            const files = readdirSync(directory);
            allFiles.push(...files.map(file => path.join(directory, file)));
        } catch (err) {
            console.error(`Error reading directory ${directory}: ${err}`);
        }
    }

    return allFiles;
}