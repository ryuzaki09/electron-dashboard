import chalk from 'chalk'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import 'dotenv/config'

import mediaRouter from './routes/media'
import homeAssistantRouter from './routes/homeAssistant'
import openaiRouter from './routes/openai'
import {mediaPath, musicPath} from './constants'

const PORT = process.env.PORT || 8081
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// serve static files
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'dist')))
// mount a virtual static path
app.use('/media', express.static(mediaPath))
app.use('/music', express.static(path.join(__dirname, 'music')))
// app.use('/tts_responses', express.static('tts_responses/'))
app.use(
  '/tts_responses',
  express.static(path.join(__dirname, 'tts_responses/'))
)

app.use('/', mediaRouter)
app.use('/home-assistant', homeAssistantRouter)
app.use('/openai', openaiRouter)

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }
  console.log(
    chalk.redBright.bold(`Backend Listening at http://localhost:${PORT}/`)
  )
})
