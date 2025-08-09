import fs from 'fs';
import path from 'path';
import VectorDatabase from '../utils/vector.db.js';
import getAllFiles from './get.all.files.js';
// import { marked } from 'marked';

const vectorDb = new VectorDatabase("chat");
export default function embedFilesInDirectorySync(directoryPath: string): any {
  console.log(directoryPath)
  const data: { [key: string]: string } = {};
  // Read the files in the subdirectory
  const fileNames = getAllFiles(directoryPath);
  // Process each file
  fileNames.forEach(async (fileName) => {
    // Get the absolute path of the file
    try {
      // Read the content of the file synchronously
      const fileContent = fs.readFileSync(fileName, 'utf8');
      data[fileName] = fileContent;
      // data[fileName] = marked.parse(fileContent);
      await vectorDb.createDoc(data[fileName])
      console.log("Embedding created for :" + fileName);
    } catch (error) {
      console.error(error)
    }
  });
  return data;
}