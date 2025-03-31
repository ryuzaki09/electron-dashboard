import chalk from 'chalk'
import {spawn} from 'child_process'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import 'dotenv/config'

import mediaRouter from './routes/media.ts'
import homeAssistantRouter from './routes/homeAssistant.ts'
import openaiRouter from './routes/openai'
import {mediaPath, musicPath} from './constants.ts'

import config from '../webpack.config.js'

const PORT = process.env.PORT || 3000
const app = express()
const compiler = webpack(config)
const middlewareInstance = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {colors: true},
  writeToDisk: true
})
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// serve static files
app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.static(path.join(__dirname, 'dist')))
// mount a virtual static path
app.use('/media', express.static(mediaPath))
app.use('/music', express.static(path.join(process.cwd(), 'music')))
app.use('/tts_responses', express.static('tts_responses/'))

app.use(middlewareInstance)

app.use(webpackHotMiddleware(compiler))

app.use('/', mediaRouter)
app.use('/home-assistant', homeAssistantRouter)
app.use('/openai', openaiRouter)

app.get('*', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'main-screen.html'))
})

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }

  middlewareInstance.waitUntilValid(() => {
    console.log(chalk.cyanBright.bold(`Listening at http://localhost:${PORT}/`))
    setTimeout(() => {
      spawn('npm', ['run', 'start-electron'], {shell: true, stdio: 'inherit'})
    }, 2000)
  })
})
