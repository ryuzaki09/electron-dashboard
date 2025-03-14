import {app} from 'electron'
import installer, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer'
import menu from 'electron-context-menu'

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
//let secondWindow

function createWindow() {
  mainWindow = createAppWindow()
  mainWindow.loadURL('http://localhost:3000')
  // mainWindow = createAppWindow('./dist/main-screen.html')
  //secondWindow = createAppWindow('./dist/second-screen.html', {x: 20, y: 20})

  installer(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension: ${name}`))
    .catch((err) => console.log('An error occurred: ', err))
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
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    // mainWindow = createAppWindow('./dist/main-screen.html')
    createWindow()
  }
  //if (secondWindow === null) {
  //secondWindow = createAppWindow('./dist/second-screen.html', {x: 20, y: 20})
  //}
})
