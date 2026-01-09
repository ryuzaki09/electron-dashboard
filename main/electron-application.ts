import {BrowserWindow} from 'electron'
//const {config} = require('../src/config')
import {config} from '../src/config/index.ts'

const fiveInchDisplay = {
  width: 1024,
  height: 600
}

const hd720Display = {
  width: 1280,
  height: 720
}

const hd1080Display = {
  width: 1920,
  height: 1080
}

export function createAppWindow(urlPath, windowOpts = {}) {
  const defaultOpts = {
    ...fiveInchDisplay,
    webPreferences: {
      nodeIntegration: true
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
