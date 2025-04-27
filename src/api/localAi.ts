import axios from 'axios'

import {config} from '../config'
import {getToday, getCurrentTime} from '../helpers/time'
import {getFunctionCall} from '../helpers/localAiHandler'

const aiClient = axios.create({
  baseURL: `http://${config.localAiHost}/api`,
  headers: {
    Authorization: `Bearer ${config.localAiKey}`
  }
})

const systemPrompt = {
  role: 'assistant',
  content: `
You MUST respond in structured JSON format when an action is required.
- If an action needs to be taken or when weather information is asked, respond with JSON:
  {
    "action": "<action_name>",
    "parameters": { "key": "value" }
  }
- If user asks about the weather for a location then return then you MUST respond with this:
  {
    "action": "get_weather",
    "paramaters": {
      "location": <coordinates>
    }
  }
- If user asks about the weather for a particular date, i.e. "today", "tomorrow", "Monday", "Tuesday", etc. then respond with this:
  {
    "action": "get_weather_forecast",
    "parameters": {
      "date": <date>
    }
  }
- If no action is required, respond normally.
Today's date is ${getToday()}.
The current time is ${getCurrentTime()}. 
`
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
