// import WebSocket from 'ws'

const WS_URL = `ws://172.16.170.200:8000/ws`

const start = (socketUrl: string) => {
  const ws = new WebSocket(socketUrl || WS_URL)
  ws.addEventListener('open', (event) => {
    console.log('Connected to AI socket')
    // ws.send('Hello Server!')
  })

  // Listen for messages
  ws.addEventListener('message', (event) => {
    console.log('Message from server ', event.data)
  })

  ws.addEventListener('close', (event) => {
    console.log('socket closed')
  })

  function sendMessage(message: string) {
    ws.send(message)
  }

  return {
    start,
    sendMessage,
    close
  }
}

export const openWakeWordSocket = {
  start: () => {
    start('ws://localhost:9091')
  }
}
