import axios from 'axios'
import {config} from '../config'

const aiClient = axios.create({
  baseURL: `http://${config.localAiHost}/api`,
  headers: {
    Authorization: `Bearer ${config.localAiKey}`
  }
})

interface IChatResponse {
  choices: Array<{index: number, message: {content: string, role: string}}>
  model: string;
  created: number;
}

export const localAi = {
  speechToText: async (audio: Blob) => {
    const formData = new FormData()
    formData.append('audio', audio, 'recording.wav')

    const result = await axios.post(
      `http://${config.whisperHost}/ai/stt`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return result.data?.data || ''
  },

  converse: async (audio: Blob) => {
    const transcription = await localAi.speechToText(audio)
    console.log('config: ', config)

    const result: IChatResponse = await aiClient.post('/chat/completions', {
      model: 'llama3.2:latest',
      messages: [
        {
          role: 'user',
          content: transcription
        }
      ]
    })
    console.log('result: ', result)
    return result.choices[0].message.content
  }
}
