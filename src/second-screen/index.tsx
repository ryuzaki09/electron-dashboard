import React from 'react'
import {createRoot} from 'react-dom/client'

function App() {
  return <div>Hello from the second screen</div>
}

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept()
}

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />, )
