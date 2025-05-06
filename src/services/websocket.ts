import {config} from '../config'

const WS_URL = `ws://172.16.170.200:8000/ws`

const start = (socketUrl: string, receiveCb: (event: any) => void) => {
  const ws = new WebSocket(socketUrl || WS_URL)
  ws.addEventListener('open', (event) => {
    console.log('Connected to AI socket')
    // ws.send('Hello Server!')
  })

  // Listen for messages
  ws.addEventListener('message', (event) => {
    console.log('Message from server ', event.data)
    receiveCb(event.data)
  })

  ws.addEventListener('close', () => {
    console.log('socket closed')
    setTimeout(() => {
      start(socketUrl, receiveCb)
    }, 5000)
  })

  function sendMessage(message: string) {
    ws.send(message)
  }

  return {
    start,
    sendMessage
  }
}

export const openWakeWordSocket = {
  start: ({wakeWordDetectedFn}: {wakeWordDetectedFn: () => void}) => {
    const receiveMsgCallback = (eventData) => {
      console.log('EVENT DATA: ', eventData)
      wakeWordDetectedFn()
    }
    start(`ws://${config.openWakeWordServer}`, receiveMsgCallback)
  }
}
