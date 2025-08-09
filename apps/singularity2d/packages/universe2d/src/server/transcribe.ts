import path from 'path'
import { nodewhisper } from 'nodejs-whisper'
import { exec } from 'child_process';
import { unlinkSync, writeFile, writeFileSync } from 'fs';

// Model list
export const MODELS_LIST = [
  'tiny',
  'tiny.en',
  'base',
  'base.en',
  'small',
  'small.en',
  'medium',
  'medium.en',
  'large-v1',
  'large',
  'large-v3-turbo',
]
const UPLOAD_FOLDER = path.resolve(import.meta.dirname, "../../public/src/uploads")
export default async function transcribeFile(fileName: string, outputDir?: string) {
  try {
    // Need to provide exact path to your audio file.
    let filePath: string = path.resolve(UPLOAD_FOLDER, fileName); //path.resolve(__dirname, filePath);
    return await transcribe(filePath, outputDir)    // console.log('Transcriptions:', data); // all the selected files paths (default: json, tsv, srt, txt, vtt)
  } catch (error: any) {
    console.error('Error:', error.message);
  }
};
export async function transcribeBuffer(wavData: any, outputDir?: string) {
  return new Promise((resolve, reject) => {
    try {
      if (!(wavData instanceof Buffer)) {
        console.error("Invalid data received");
        return;
      }
      const filePath = path.resolve(UPLOAD_FOLDER, "temp_audio.wav");
      // Save the audio file
      writeFile(filePath, wavData, async (err: any) => {
        if (err) {
          console.error("Error saving audio:", err);
          // ws.send(JSON.stringify({ error: "Failed to save audio" }));
          unlinkSync(filePath);
          reject()
        }
        resolve(await transcribe(filePath, outputDir));
      });
      // console.log('Transcriptions:', data); // all the selected files paths (default: json, tsv, srt, txt, vtt)
    } catch (error: any) {
      reject('Error:' + error.message);
    }
  })
};
export async function transcribe(absolutePath: any, outputDir?: string) {
  return new Promise((resolve, reject) => {
    console.error("Transcribing");
    try {
      // Need to provide exact path to your audio file.
      exec(`whisper "${absolutePath}" --model base --language English --output_dir "${outputDir ?? absolutePath.split("/").slice(0, -2).join("/") + "/transcriptions"}"`, (error, stdout, stderr) => {
        // /home/main/.local/bin/whisper
        if (error) {
          reject("Transcription failed:" + error);
          return;
        }
        if (stderr) {
          // reject("Whisper Warning:" + JSON.stringify(stderr)); // Log warnings without failing
          // console.warn("Whisper Warning:", stderr); // Log warnings without failing
        }
        // console.log("Transcription:", stdout.trim());
        resolve(stdout.trim());
      });
      return;
    } catch (err: any) {
      reject(err)
    }
  });
}