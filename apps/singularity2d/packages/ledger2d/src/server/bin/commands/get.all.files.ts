import fs, { readFileSync } from 'fs';
import path, { join } from 'path';

const excludedPatterns = ['node_modules', '.git', '.obsidian', 'node_modules/', 'data/stores']
let id = 0
let totalItems = 0
function shouldExclude(filePath: string): boolean {
  for (const pattern of excludedPatterns) {
    if (filePath.includes(pattern)) {
      return true;
    }
  }
  return false;
}

export default function getAllFilesInDirectory(directory: string): any[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.map((entry) => {
    const fullPath = path.join(directory, entry.name);
    // Check against excluded patterns
    if (shouldExclude(fullPath)) {
      return;
    }
    if (entry.isDirectory()) {
      return getAllFilesInDirectory(fullPath);
      console.log("on directory" + path.resolve(entry.path) + " about to process", entry.name)
    } else if (entry.isFile()) {
      // console.log("path.resolve",path.resolve(entry.path))
      // console.log("path.basename",path.basename(entry.path))
      // console.log("path.normalize",path.normalize(entry.path))
      // console.log("path.parse",path.parse(entry.path))
      // console.log("path.dirname",path.dirname(entry.path))
      // console.log("path.extname",path.extname(entry.path))
      // console.log("entry",entry.name)
      const fileExtension = path.extname(entry.name);
      if (!fullPath) throw Error('No Fill Path')
      switch (fileExtension) {
        case ".md":
        case ".txt":
          return fullPath
          break;
        default:
          return
          break;
      }
      // return fullPath
    }
    // if (!fullPath) return
    // console.log({ fullPath })
    // try {
    //   return { fullPath,file:readFileSync(fullPath, 'utf-8')}
    // } catch (error) {
    //   console.log(error)
    // }
    // return fullPath
  }).filter((any: any) => any).flat().sort()
}