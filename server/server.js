import chalk from 'chalk'
import {spawn} from 'child_process'
import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import path from 'path'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import dotenv from 'dotenv'

dotenv.config({
  path: './src/config/.env'
})

import mediaRouter from './routes/media.ts'
import {mediaPath, musicPath} from './constants.ts'

import config from '../webpack.config.common.js'

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
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'dist')))
// mount a virtual static path
app.use('/media', express.static(mediaPath))
app.use('/music', express.static(path.join(process.cwd(), 'music')))
app.use(middlewareInstance)

app.use(webpackHotMiddleware(compiler))

app.use('/', mediaRouter)

app.post('/home-assistant/conversation', async (req, res) => {
  const {body} = req
  if (!body.text) {
    return res.status(400).send({message: 'Missing text'})
  }

  const result = await axios.post(
    `http://${process.env.HA_HOST}:8123/api/conversation/process`,
    {
      text: body.text,
      language: 'en'
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HA_LONG_LIVE_TOKEN}`
      }
    }
  )
  console.log('home result: ', result.data.response)

  res.send({message: 'ok'})
})

app.get('/home-assistant/states', async (_req, res) => {
  const result = await axios.get(
    `http://${process.env.HA_HOST}:8123/api/states`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HA_LONG_LIVE_TOKEN}`
      }
    }
  )

  res.send(result.data)
})

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
