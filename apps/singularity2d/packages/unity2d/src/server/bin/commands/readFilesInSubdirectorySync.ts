import fs from 'fs';
import path from 'path';
import getAllFiles from './get.all.files.js';
export default function readFilesInSubdirectorySync(directoryPath: string): string {
  // Get the absolute path of the subdirectory
  const subdirectoryPath = path.resolve(directoryPath);

  // Read the files in the subdirectory
  const fileNames = fs.readdirSync(subdirectoryPath);
  let fileNamesString = '';
  // Process each file
  fileNames.forEach((fileName) => {
    // Get the absolute path of the file
    const filePath = path.join(subdirectoryPath, fileName);

    // Read the content of the file synchronously
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Process the file content as needed
    // console.log(`Content of ${fileName}:`);
    // console.log(fileContent);
    // console.log('------------------------');
    fileNamesString += `
Content of ${fileName}:
${fileContent}
------------------------`;
  });
  return fileNamesString;
}
