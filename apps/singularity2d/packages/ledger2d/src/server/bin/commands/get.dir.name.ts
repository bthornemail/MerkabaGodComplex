/* eslint-disable @typescript-eslint/naming-convention */
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { join } from 'node:path'

export default function getDirName (importMetaUrl: string, filepath: string): string {
  const __filename = fileURLToPath(importMetaUrl)
  const __dirname = dirname(__filename)
  return join(__dirname, filepath)
}
