import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './app'
import {config} from './config'

// @ts-ignore
if (module.hot) {
  if (config.isDevelopment) {
    // @ts-ignore
    module.hot.accept()
  }
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(<App />)
