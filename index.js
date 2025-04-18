import path from 'path'
import {app} from 'electron'
import installer, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer'
import menu from 'electron-context-menu'
import dotenv from 'dotenv'
import {config} from './src/config'
import {spawn} from 'child_process'
import shell from 'shelljs'

import {createAppWindow} from './main/electron-application.ts'

const PORT = process.env.PORT || 3000
loadEnvFile()

menu({
  prepend: (params) => [
    {
      label: 'Rainbow',
      visible: params.mediaType === 'image'
    }
  ]
})

let mainWindow

function createWindow() {
  if (config.isDevelopment) {
    spawn('npm', ['run', 'backend'], {
      shell: false,
      stdio: 'inherit'
    })
  } else {
    const nodePath = shell.which('node')
    // if app is Packaged version
    if (app.isPackaged) {
      const backendFile = path.join(process.resourcesPath, 'server', 'index.js')
      // spawn(nodePath.toString(), [backendFile], {
      spawn('/usr/bin/env', ['node', backendFile], {
        stdio: 'inherit',
        shell: false,
        cwd: path.dirname(backendFile)
      })
    } else {
      // Production
      const backendFile = path.resolve(__dirname, '../server-dist/index.js')
      spawn(nodePath.toString(), [backendFile], {
        stdio: 'inherit',
        shell: true
      })
    }
  }

  mainWindow = createAppWindow()

  if (config.isDevelopment) {
    mainWindow.loadURL(`http://localhost:${PORT}`)

    installer(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension: ${name}`))
      .catch((err) => console.log('An error occurred: ', err))
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/main-screen.html'))
  }

  // mainWindow.webContents.openDevTools({mode: 'detach'})
}

app.on('ready', createWindow)
app.commandLine.appendSwitch('disable-features', 'Autofill')
app.commandLine.appendSwitch('disable_gpu')
app.disableHardwareAcceleration()

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = null
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    // mainWindow = createAppWindow('./dist/main-screen.html')
    // spawn('npm', ['run', 'backend'], {shell: true, stdio: 'inherit'})
    createWindow()
  }
})

function loadEnvFile() {
  if (config.isDevelopment) {
    dotenv.config()
  } else {
    if (app.isPackaged) {
      dotenv.config({path: path.join(process.resourcesPath, '.env')})
    } else {
      dotenv.config({path: path.join(__dirname, '.env.production')})
    }
  }
}
