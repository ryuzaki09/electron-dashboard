import axios from 'axios'

import {config} from '../config'
import {today, getCurrentTime} from '../helpers/time'
import {functions} from '../../server/helpers/openai'

const aiClient = axios.create({
  baseURL: `http://${config.localAiHost}/api`,
  headers: {
    Authorization: `Bearer ${config.localAiKey}`
  }
})

const systemPrompt = {
  role: 'developer',
  content: [
    `You are a helpful assistant that have all the knowledge in the world. You will answer questions concisely and simplified. Today's date is ${today}. 
The current time is ${getCurrentTime()}`
  ]
}

interface IChatResponse {
  choices: Array<{index: number; message: {content: string; role: string}}>
  model: string
  created: number
}

export const localAi = {
  speechToText: async (audio: Blob) => {
    const formData = new FormData()
    formData.append('audio', audio, 'recording.wav')

    const {data} = await axios.post(
      // `http://${config.whisperHost}/ai/stt`,
      `http://localhost:3003/transcribe`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    console.log('transcribed result: ', data)

    return data ? data.data : ''
    // return result.data.transcription || ''
  },

  textToSpeech: async (text: string) => {
    const result = await axios.post(`http://${config.whisperHost}/ai/tts`, {
      text
    })

    console.log('TTS result: ', result)
    return result
  },

  getAiResponse: async (transcription: string) => {
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
  },

  converse: async (audio: Blob) => {
    const transcription = await localAi.speechToText(audio)

    const result = await aiClient.post('/chat/completions', {
      model: 'llama3.2:latest',
      messages: [
        systemPrompt,
        {
          role: 'user',
          content: transcription
        }
      ],
      tools: functions
    })
    console.log('result: ', result)
    return result.data.choices[0].message.content
  }
}
