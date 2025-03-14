import chalk from 'chalk'
import {spawn} from 'child_process'
import express from 'express'
import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import config from './webpack.config.common.js'

const PORT = process.env.PORT || 3000
const app = express()
const compiler = webpack(config)
const middlewareInstance = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {colors: true},
  writeToDisk: true
})

const mediaPath = path.join(__dirname, 'media')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(mediaPath))
app.use(middlewareInstance)

app.use(webpackHotMiddleware(compiler))

app.use('*', function(req, res, next) {
  const filename = path.join(compiler.outputPath, req.path)
  console.log('filename: ', filename)
  compiler.outputFileSystem.stat(filename, (err, stats) => {
    console.log('fileNAME: ', filename)
    if (err || !stats.isFile()) {
      return next()
    }

    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
  })
  // res.sendFile(path.join(__dirname, 'main/windows/index.html'))
  // res.sendFile(path.join(compiler.outputPath, 'main-screen.html'))
})

app.get('/files', (req, res) => {
  fs.readdir(mediaPath, (err, files) => {
    if (err) {
      return res.status(500).json({error: 'Unable to read fiels'})
    }
    const mediaFiles = files.map((file) => ({
      name: file,
      url: `/media/${file}`
    }))

    res.json(mediaFiles)
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'main-screen.html'))
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
