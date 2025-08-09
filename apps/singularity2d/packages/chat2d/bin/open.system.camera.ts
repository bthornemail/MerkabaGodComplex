import { exec } from "child_process";
import { platform } from "os";

export default function openSystemCamera(): void {
    const platform = process.platform;

    if (platform === "win32") {
        // For Windows:
        exec("start microsoft.windows.camera:");
    } else if (platform === "darwin") {
        // For macOS (This will open the Photo Booth app):
        exec("open -a Photo\\ Booth");
    } else {
        console.log("This platform is not supported yet!");
    }
}