import fs from 'fs'
import path from 'path'

export interface IFile {
  name: string
  path: string
  type: 'folder' | 'file'
  basePath: string
  folders?: string[]
  url?: string
}

const basePath = process.cwd()

export function getFilesRecursively(originalPath: string) {
  const mediaPath = originalPath

  function startScan(dir: string, isRecursive = false) {
    let results: IFile[] = []

    try {
      fs.readdirSync(dir, {withFileTypes: true}).forEach((item) => {
        const fullPath = `${dir}/${item.name}`
        const relativePath = path.resolve(
          isRecursive ? dir : mediaPath,
          fullPath
        )

        // directory
        if (item.isDirectory()) {
          results.push({
            name: item.name,
            path: relativePath,
            type: 'folder',
            basePath
          })
          results = results.concat(startScan(fullPath, true))
          // is a file and ends with .mp3 and does not start with a dot (.)
        } else if (
          item.isFile() &&
          item.name.endsWith('.mp3') &&
          !item.name.startsWith('.')
        ) {
          results.push({
            name: item.name,
            path: relativePath,
            type: 'file',
            basePath,
            url: `/music/${item.name}`
          })
        }
      })

      return results
    } catch (e) {
      console.log('ERROR READ FILES: ', e)
      return results
    }
  }

  return startScan(originalPath)
}
