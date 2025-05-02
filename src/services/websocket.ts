// import WebSocket from 'ws'

// const WS_URL = `ws://172.16.170.200:8000/ws`
const WS_URL = `ws://localhost:8082`

interface IWebsocketProps {
  receiveFn: (event: MessageEvent) => void
}
const start = (receiveFn: (event: MessageEvent) => void) => {
  console.log('receiveFn: ', receiveFn)
  const ws = new WebSocket(WS_URL)
  ws.addEventListener('open', (event) => {
    if (!receiveFn) {
      ws.close()
    }
    console.log('✅ Connected to WebSocket server')
    // ws.send('Hello Server!')
  })

  // Listen for messages
  ws.addEventListener('message', receiveFn)
  ws.addEventListener('error', (event) => {
    console.error('WebSocket error: ', event)
    ws.close() // Close and retry
  })
  ws.addEventListener('close', () => {
    console.log('Websocket closed')
    setTimeout(() => {
      start(receiveFn)
    }, 5000)
  })
  return {
    sendMessage: (message: string) => ws.send(message)
  }
}

export const websocket = {
  start
}
