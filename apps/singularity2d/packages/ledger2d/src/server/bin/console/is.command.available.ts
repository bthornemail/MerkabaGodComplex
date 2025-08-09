import { execSync } from "node:child_process";

export default function isCommandAvailable(command: any):boolean {
    try {
        if (process.platform === 'win32') {
            // Use 'where' on Windows
            execSync(`where ${command}`);
        } else {
            // Use 'which' on macOS/Linux
            execSync(`which ${command}`);
        }
        return true;
    } catch (error) {
        return false;
    }
}