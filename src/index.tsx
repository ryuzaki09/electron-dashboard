import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './app'

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept()
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(<App />)
