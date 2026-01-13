import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import {userMusicPath, userMusicFirstFolder} from './constants'
import {musicRootFoldersToScan} from '../src/config'

export interface IFile {
  name: string
  path: string
  type: 'folder' | 'file'
  firstFolder: string
  basePath: string
  folders?: string[]
  url?: string
  domain?: string
  filePath?: string
}

// const basePath = path.join(__dirname, '../')
const basePath = userMusicPath.replace(userMusicFirstFolder, '')

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
        if (
          !isRecursive &&
          item.isDirectory() &&
          musicRootFoldersToScan.includes(item.name.toLowerCase())
        ) {
          results.push({
            name: item.name,
            firstFolder: userMusicFirstFolder,
            path: relativePath,
            type: 'folder',
            basePath
          })
          results = results.concat(startScan(fullPath, true))
        } else if (isRecursive && item.isDirectory()) {
          results.push({
            name: item.name,
            firstFolder: userMusicFirstFolder,
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
          const fileFullPath = path.join(dir, item.name)
          // filePath without the root music part and the file name
          // i.e. from the root of the 'music' folder to the file /music/NewFolder/
          const filePath = fileFullPath
            .replace(basePath, '')
            .replace(`/${item.name}`, '')
          // .replace(userMusicFirstFolder, '')
          results.push({
            name: item.name,
            path: relativePath,
            type: 'file',
            firstFolder: userMusicFirstFolder,
            basePath,
            url: `/music${filePath}/${item.name}`,
            domain: process.env.LOCAL_API_URL,
            filePath
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

const intentFile = path.join(__dirname, '../src/config/intents.yml')

const doc = fs.existsSync(intentFile) ? yaml.load(fs.readFileSync(intentFile, 'utf8')) : null

export function checkIntent(speechText: string) {
  let sentenceWords: string[] = []
  console.log('Finding intent for: ', speechText)
  const intent =
    doc &&
    doc.intents.find((intent) => {
      const sentence = intent.sentences.find((sentence) => {
        sentenceWords = sentence.replace('{slot}', '').split(' ')
        console.log('Sentence words: ', sentenceWords)

        const match = sentenceWords.every((word) => speechText.includes(word))
        return match
      })
      console.log('Sentence: ', sentence)

      if (sentence) {
        return intent
      }

      return false
    })

  if (!intent) {
    console.log('No intent found')
    return false
  }

  console.log('Found intent: ', intent)

  const slotWords = speechText
    .split(' ')
    .filter((word) => !sentenceWords.includes(word))
    .join(' ')

  // console.log('LIGHTS: ', this.lights)
  console.log('Remaining words: ', slotWords)

  return {
    intent,
    slotWords
  }
}
