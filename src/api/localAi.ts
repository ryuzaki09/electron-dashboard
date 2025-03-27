import axios from 'axios'
import {config} from '../config'

const aiClient = axios.create({
  baseURL: `http://${config.localAiHost}/api`,
  headers: {
    Authorization: `Bearer ${config.localAiKey}`
  }
})

interface IChatResponse {
  choices: Array<{index: number; message: {content: string; role: string}}>
  model: string
  created: number
}

export const localAi = {
  speechToText: async (audio: Blob) => {
    const formData = new FormData()
    formData.append('file', audio, 'recording.wav')

    const result = await axios.post(
      `http://${config.whisperHost}/ai/stt`,
      // `http://localhost:3003/transcribe`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    console.log('transcribed result: ', result)

    return result.data?.data || ''
    // return result.data.transcription || ''
  },

  textToSpeech: async (text) => {
    const result = await axios.post(`http://${config.whisperHost}/ai/tts`, {
      text
    })

    console.log('TTS result: ', result)
    return result
  },

  converse: async (audio: Blob) => {
    const transcription = await localAi.speechToText(audio)

    const result = await aiClient.post('/chat/completions', {
      model: 'llama3.2:latest',
      messages: [
        {
          role: 'user',
          content: transcription
        }
      ]
    })
    console.log('result: ', result)
    return result.data.choices[0].message.content
  }
}
