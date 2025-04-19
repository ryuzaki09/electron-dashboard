import {BrowserWindow} from 'electron'
import {config} from '../src/config'
import path from 'path'

export function createAppWindow(urlPath, windowOpts = {}) {
  const defaultOpts = {
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      //preload: path.join(__dirname, '../preload.js')
    }
  }

  const prodOptions = config.isDevelopment
    ? {}
    : {
        kiosk: true,
        autoHideMenuBar: true
      }

  let win: BrowserWindow | null = new BrowserWindow({
    ...defaultOpts,
    ...windowOpts
  })

  if (!config.isDevelopment) {
    win.setFullScreen(true)
  }

  // win.loadFile(path)
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  return win
}
