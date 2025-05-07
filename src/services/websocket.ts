import {config} from '../config'

const WS_URL = `ws://172.16.170.200:8000/ws`

let socket: WebSocket | null = null

const start = (socketUrl: string, receiveCb: (event: any) => void) => {
  if (socket) {
    console.log('Socket already initialized')
    return
  }

  socket = new WebSocket(socketUrl || WS_URL)
  socket.addEventListener('open', (event) => {
    console.log('Connected to AI socket')
    // ws.send('Hello Server!')
  })

  // Listen for messages
  socket.addEventListener('message', (event) => {
    console.log('Message from server ', event.data)
    receiveCb(event.data)
  })

  socket.addEventListener('close', () => {
    console.log('socket closed')
    setTimeout(() => {
      start(socketUrl, receiveCb)
    }, 5000)
  })
}

function sendMessage(message: string) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return
  socket.send(message)
}

function stopSocket() {
  if (socket) {
    socket.removeEventListener('message', () => {
      console.log('message closed')
    })
    socket.removeEventListener('open', () => {
      console.log('open event closed')
    })
    socket.removeEventListener('close', () => {
      console.log('close event closed')
    })
    socket.close()
    socket = null
    console.log('Socket closed')
  }
}

export const openWakeWordSocket = {
  start: ({wakeWordDetectedFn}: {wakeWordDetectedFn: () => void}) => {
    const receiveMsgCallback = (eventData) => {
      console.log('EVENT DATA: ', eventData)
      wakeWordDetectedFn()
    }
    start(`ws://${config.openWakeWordServer}`, receiveMsgCallback)
  },
  stop: stopSocket,
  sendMessage
}
