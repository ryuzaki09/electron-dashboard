import path from 'path'
import {app} from 'electron'
import installer, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer'
import menu from 'electron-context-menu'
import 'dotenv/config'
import {config} from './src/config'
import {spawn} from 'child_process'
import shell from 'shelljs'

import {createAppWindow} from './main/electron-application.ts'

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
    console.log('getting node path')
    const nodePath = shell.which('node')
    const babelRegister = path.resolve(__dirname, '../babel-register.cjs')
    const backendFile = path.resolve(__dirname, '../server/backend-server.js')
    console.log('node path: ', nodePath)
    console.log('dir: ', __dirname)
    spawn(nodePath.toString(), ['-r', babelRegister, backendFile], {
      stdio: 'inherit',
      shell: true
    })

    //const node = process.execPath.includes('electron')
    //? process.execPath.replace(/electron(\.exe)?$/, 'node')
    //: process.execPath

    //spawn(node, ['-r', babelRegister, backendFile], {
    //shell: false,
    //stdio: 'inherit'
    //})
  }

  mainWindow = createAppWindow()

  if (config.isDevelopment) {
    mainWindow.loadURL('http://localhost:3000')

    installer(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension: ${name}`))
      .catch((err) => console.log('An error occurred: ', err))
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/main-screen.html'))
  }

  mainWindow.webContents.openDevTools({mode: 'detach'})
}

app.on('ready', createWindow)
app.commandLine.appendSwitch('disable-features', 'Autofill')

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
