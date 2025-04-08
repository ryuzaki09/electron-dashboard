import chalk from 'chalk'
import webpack from 'webpack'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import {spawn} from 'child_process'
import 'dotenv/config'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from '../webpack.config.js'

const PORT = process.env.PORT || 3000
const app = express()
const compiler = webpack(webpackConfig)
const middlewareInstance = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {colors: true},
  writeToDisk: true
})
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// serve static files
app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.static(path.join(__dirname, 'dist')))

app.use(middlewareInstance)
app.use(webpackHotMiddleware(compiler))

app.get('*', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'main-screen.html'))
})

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }
  middlewareInstance.waitUntilValid(() => {
    console.log(
      chalk.cyanBright.bold(`Frontend Listening at http://localhost:${PORT}/`)
    )
    setTimeout(() => {
      spawn('npm', ['run', 'start-electron'], {shell: true, stdio: 'inherit'})
    }, 2000)
  })
})
