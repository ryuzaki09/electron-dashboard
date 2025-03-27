// import WebSocket from 'ws'

const WS_URL = `ws://172.16.170.200:8000/ws`

const ws = new WebSocket(WS_URL)

const start = () => {
  ws.addEventListener('open', (event) => {
    console.log('Connected to AI socket')
    // ws.send('Hello Server!')
  })

  // Listen for messages
  ws.addEventListener('message', (event) => {
    console.log('Message from server ', event.data)
  })
}

const sendMessage = (message: string) => {
  ws.send(message)
}

const close = () => {
  ws.close()
}

export const websocket = {
  start,
  sendMessage,
  close
}
