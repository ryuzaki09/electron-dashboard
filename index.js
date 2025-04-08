import path from 'path'
import {app} from 'electron'
import installer, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer'
import menu from 'electron-context-menu'
import 'dotenv/config'
import {config} from './src/config'
import {spawn} from 'child_process'

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
  spawn('npm', ['run', 'backend'], {shell: true, stdio: 'inherit'})
  mainWindow = createAppWindow()
  //if (config.isDevelopment) {
  mainWindow.loadURL('http://localhost:3000')
  //} else {
  //mainWindow.loadFile(path.join(__dirname, '../dist/main-screen.html'))
  //}
  // mainWindow = createAppWindow('./dist/main-screen.html')
  //secondWindow = createAppWindow('./dist/second-screen.html', {x: 20, y: 20})

  //if (config.isDevelopment) {
  installer(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension: ${name}`))
    .catch((err) => console.log('An error occurred: ', err))
  //}
}

app.on('ready', createWindow)
app.commandLine.appendSwitch('disable-features', 'Autofill')

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  console.log('HEREE ACTIVATE')
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    // mainWindow = createAppWindow('./dist/main-screen.html')
    // spawn('npm', ['run', 'backend'], {shell: true, stdio: 'inherit'})
    createWindow()
  }
})
