import chalk from 'chalk'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import fs from 'fs'
import 'dotenv/config'

import mediaRouter from './routes/media'
import homeAssistantRouter from './routes/homeAssistant'
import openaiRouter from './routes/openai'
import photosRouter from './routes/photos'
import {userVideoPath, userMusicPath} from './constants'

const PORT = process.env.BACKEND_PORT || 8081
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// serve static files
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'dist')))
// mount a virtual static path
if (fs.existsSync(userVideoPath)) {
  app.use('/video', express.static(userVideoPath))
} else {
  console.log('⚠️ Video folder not found at: ', userVideoPath)
}

if (fs.existsSync(userMusicPath)) {
  app.use('/music', express.static(userMusicPath))
} else {
  console.log('⚠️ Music folder not found at: ', userMusicPath)
}
// app.use('/tts_responses', express.static('tts_responses/'))
app.use(
  '/tts_responses',
  express.static(path.join(__dirname, '../tts_responses/'))
)

// Global CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use('/media', mediaRouter)
app.use('/home-assistant', homeAssistantRouter)
app.use('/openai', openaiRouter)
app.use('/photos', photosRouter)

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }
  console.log(
    chalk.redBright.bold(`Backend Listening at http://localhost:${PORT}/`)
  )
})
