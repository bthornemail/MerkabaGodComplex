import fs from 'fs';
import path from 'path';
import getAllFiles from './get.all.files';
export default function readFilesInDirectorySync(directoryPath: string): any {
  // Get the absolute path of the subdirectory
  const subdirectoryPath = path.resolve(directoryPath);

  // Read the files in the subdirectory
  const fileNames = getAllFiles(directoryPath);
  console.log(fileNames)
  let files: { [key: string]: string } = {};
  // Process each file
  fileNames.forEach((fileName) => {
    // Get the absolute path of the file
    // const filePath = path.join(subdirectoryPath, fileName);

    // Read the content of the file synchronously
    const fileContent = fs.readFileSync(fileName, 'utf8');

    // Process the file content as needed
    // console.log(`Content of ${fileName}:`);
    // console.log(fileContent);
    // console.log('------------------------');
    files[fileName] = fileContent;
  });
  return files;
}

// (() => {
//   console.log(readFilesInDirectorySync("/home/bthorne/github/chat"))
// })();