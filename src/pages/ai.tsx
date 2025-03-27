import React, {useState, useEffect} from 'react'
import {Buffer} from 'buffer'
import {websocket} from '../services/websocket'
import {Container} from '../components/container'
import io from 'socket.io-client'

// const WS_URL = "ws://localhost:8000/ws"; // Change to match your server IP

// WebSocket URL (should be updated to your backend URL)
const socket = io('http://localhost:8080')

export function Assistant() {
  const [transcription, setTranscription] = useState('')
  const [response, setResponse] = useState('')

  useEffect(() => {
    // Listen for transcription results from the backend
    socket.on('transcription_result', (data) => {
      setTranscription(data.transcription)
      setResponse(data.stats)
    })

    // Listen for errors from the backend
    socket.on('error', (error) => {
      console.error('Error:', error.message)
    })

    return () => {
      socket.off('transcription_result')
      socket.off('error')
    }
  }, [])

  // React.useEffect(() => {
  //   websocket.start()
  //
  //   return () => {
  //     websocket.close()
  //   }
  // }, [])
  // const { sendMessage, lastMessage } = useWebSocket(WS_URL, {
  //   onOpen: () => console.log("Connected to server"),
  //   onClose: () => console.log("Disconnected"),
  // });

  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     const message = JSON.parse(lastMessage.data);
  //     if (message.type === "text") {
  //       setResponse(message.data);
  //     } else if (message.type === "tts") {
  //       playAudio(message.data);
  //     }
  //   }
  // }, [lastMessage]);
  //
  const sendAudio = async () => {
    const audioBlob = await recordAudio()
    const arrayBuffer = await audioBlob.arrayBuffer()
    const hexData = Buffer.from(arrayBuffer).toString('hex')
    socket.emit('audio_chunk', {data: hexData})
  }

  const recordAudio = () => {
    return new Promise((resolve) => {
      navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, {type: 'audio/wav'})
          resolve(audioBlob)
        }

        mediaRecorder.start()
        setTimeout(() => mediaRecorder.stop(), 3000)
      })
    })
  }
  //
  const playAudio = (hexString) => {
    const byteArray = new Uint8Array(Buffer.from(hexString, 'hex'))
    const blob = new Blob([byteArray], {type: 'audio/wav'})
    const audio = new Audio(URL.createObjectURL(blob))
    audio.play()
  }

  return (
    <Container>
      <h1>AI Assistant</h1>
      <button onClick={sendAudio}>Start Talking</button>
      <p>Transcription: {transcription}</p>
      <p>Response: {JSON.stringify(response)}</p>
    </Container>
  )
}
