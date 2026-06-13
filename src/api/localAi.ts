import axios from 'axios'

import {config} from '../config'
import {getFunctionCall} from '../helpers/localAiHandler'
import {systemPrompt} from './systemPrompt'

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
    //console.log('AUDIO: ', audio)
    const audioBase64 = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
        const base64 =
          reader && typeof reader.result === 'string'
            ? reader.result.split(',')[1]
            : null
        resolve(base64)
      }
      reader.readAsDataURL(audio)
    })
    //console.log('base64: ', audioBase64)
    //const formData = new FormData()
    //formData.append('audio', audio, 'recording.wav')

    const {data} = await axios.post(
      `http://${config.sttHost}/transcribe`,
      //`http://localhost:3003/transcribe`,
      {audio: audioBase64},
      {
        headers: {
          //'Content-Type': 'multipart/form-data'
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('transcribed result: ', data)

    return data ? data.text : ''
    // return result.data.transcription || ''
  },

  textToSpeech: async (text: string) => {
    //const result = await axios.post(`http://${config.whisperHost}/ai/tts`, {
    const result = await axios.post(
      `http://${config.ttsHost}/speak`,
      {text},
      {
        responseType: 'blob',
        headers: {
          //'Content-Type': 'multipart/form-data'
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('TTS result: ', result)
    return result.data
  },

  chat: async (transcription: string) => {
    const result = await aiClient.post('/chat/completions', {
      model: 'qwen2.5:latest',
      messages: [
        systemPrompt,
        {
          role: 'user',
          content: transcription
        }
      ]
    })
    const {data} = result
    const {content} = data.choices[0].message

    if (!content) {
      return 'Sorry, something went wrong'
    }

    const parsed = JSON.parse(content)

    if (parsed.action && parsed.parameters) {
      const customFunction = getFunctionCall(parsed.action)

      if (customFunction) {
        console.log('parsed: ', parsed)
        const result = await customFunction.functionCall(parsed.parameters)
        console.log('Custom Function result: ', result)
        const transcriptionResponse = customFunction.responseHandler({
          ...parsed,
          ...result
        })

        console.log('transcription response: ', transcriptionResponse)
      }
    }
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
      ]
    })

    console.log('result: ', result)
    return result.data.choices[0].message.content
  }
}
