import express from 'express'
import fs from 'fs'
import {mediaPath, musicPath} from '../constants'
import {IFile, getFilesRecursively} from '../utils'

const router = express.Router()

let musicMediaCache: IFile[] | null = null
let lastCacheTime = 0
const CACHE_DURATION = 1000 * 60 * 120 // 120minutes

router.get('/videos', (_req: express.Request, res) => {
  console.log('FETCHING VIDEOS')
  fs.readdir(mediaPath, (err, files) => {
    if (err) {
      return res.status(500).json({error: 'Unable to read files'})
    }
    const mediaFiles = files
      .map((file) => ({
        name: file,
        url: `/media/${file}`,
        domain: process.env.BACKEND_HOST
      }))
      .filter((f) => !f.name.startsWith('.'))

    res.json(mediaFiles)
  })
})

router.get('/musicMedia', (_req: express.Request, res) => {
  try {
    console.log('FETCHING FILES')
    const now = Date.now()
    if (
      !musicMediaCache ||
      now - lastCacheTime > CACHE_DURATION ||
      !musicMediaCache.length
    ) {
      musicMediaCache = getFilesRecursively(musicPath)
      lastCacheTime = now
    }

    res.json(musicMediaCache)
  } catch (e) {
    res.status(500).json({error: 'Unable to read music files'})
  }
})

export default router
