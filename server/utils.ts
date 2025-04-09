import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export interface IFile {
  name: string
  path: string
  type: 'folder' | 'file'
  basePath: string
  folders?: string[]
  url?: string
  domain?: string
}

const basePath = path.join(__dirname, '../')

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
            url: `/music/${item.name}`,
            domain: process.env.BACKEND_HOST
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

// console.log('FILE: ', intentFile)
const doc = yaml.load(fs.readFileSync(intentFile, 'utf8'))

export function checkIntent(speechText: string) {
  let sentenceWords: string[] = []
  console.log('Finding intent for: ', speechText)
  const intent = doc.intents.find((intent) => {
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
