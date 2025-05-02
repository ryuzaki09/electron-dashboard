import express from 'express'
import fs from 'fs'
import {userVideoPath, userMusicPath} from '../constants'
import {IFile, getFilesRecursively} from '../utils'

const router = express.Router()

let musicMediaCache: IFile[] | null = null
let lastCacheTime = 0
const CACHE_DURATION = 1000 * 60 * 120 // 120minutes

router.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const allowedFileExtensions = ['.mkv', '.mp4', '.avi']

router.get('/videos', (_req: express.Request, res) => {
  console.log('FETCHING VIDEOS')
  fs.readdir(userVideoPath, (err, files) => {
    if (err) {
      return res.status(500).json({error: 'Unable to read files'})
    }
    const mediaFiles = files
      .map((file) => ({
        name: file,
        url: `/video/${file}`,
        domain: process.env.LOCAL_API_URL
      }))
      // ignore files that starts with a dot .
      .filter((f) => {
        const ext = f.name.toLowerCase().slice(-4)
        return !f.name.startsWith('.') && allowedFileExtensions.includes(ext)
      })
    console.log('MEDIA files: ', mediaFiles)

    res.json(mediaFiles)
  })
})

router.get('/music', (_req: express.Request, res) => {
  try {
    console.log('FETCHING FILES')
    const now = Date.now()
    if (
      !musicMediaCache ||
      now - lastCacheTime > CACHE_DURATION ||
      !musicMediaCache.length
    ) {
      musicMediaCache = getFilesRecursively(userMusicPath)
      lastCacheTime = now
    }

    res.json(musicMediaCache)
  } catch (e) {
    res.status(500).json({error: 'Unable to read music files'})
  }
})

export default router
