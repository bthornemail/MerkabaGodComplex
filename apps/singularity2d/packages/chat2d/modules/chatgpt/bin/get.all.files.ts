import { readdirSync, statSync } from "fs";
import path, { join } from "path";
import { Config } from "./types.js";

  
  export default function getAllFiles(directoryPath: string, _config?: Config): string[] {
    let config: Config = _config || {
      excludes: ['node_modules', '.git', 'build', 'package-lock.json', '*.dat',"*.rdb"]
    };
    let fileNames: string[] = [];
  
    function traverseDirectory(currentPath: string) {
      const files = readdirSync(currentPath);
  
      files.forEach((file) => {
        const filePath = join(currentPath, file);
        const stat = statSync(filePath);
  
        if (stat.isDirectory()) {
          // Check if the current directory should be excluded
          if (shouldExclude(file)) {
            return; // Skip this directory
          }
  
          traverseDirectory(filePath); // Recursive call for subdirectory
        } else {
          // Check if the current file should be excluded
          if (shouldExclude(file)) {
            return; // Skip this file
          }
  
          fileNames.push(filePath); // Add file path to the array
        }
      });
    }
  
    function shouldExclude(filename: string): boolean {
      if (config.excludes) {
        for (const exclude of config.excludes) {
          if (isWildcardMatch(exclude, filename) || isFileTypeMatch(exclude, filename)) {
            return true;
          }
        }
      }
      return false;
    }
  
    function isWildcardMatch(pattern: string, filename: string): boolean {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(filename);
    }
  
    function isFileTypeMatch(filetype: string, filename: string): boolean {
      const ext = path.extname(filename).toLowerCase();
      return filetype.toLowerCase() === ext;
    }
  
    traverseDirectory(directoryPath);
  
    return fileNames;
  }