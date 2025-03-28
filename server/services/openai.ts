import {OpenAI} from 'openai'
import {Uploadable} from 'openai/uploads'
import {ChatCompletionMessageParam} from 'openai/resources'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({
  path: './src/config/.env'
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
})

const systemPrompt: ChatCompletionMessageParam = {
  role: 'developer',
  content:
    'You are a helpful assistant that have the knowledge of the universe. You will respond in the tone of Jim Carrey.'
}

export const openAiAPI = {
  speechToText: async (audio: Uploadable) => {
    console.log('calling whisper')
    const response = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1'
    })

    console.log('got response: ', response.text)
    return response.text
  },

  createChat: async (transcription: string) => {
    console.log('calling chat: ', transcription)
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        systemPrompt,
        {
          role: 'user',
          content: transcription
        }
      ]
    })
    console.log('got response from chat')

    return response.choices[0].message.content
  },

  textToSpeech: async (text: string) => {
    console.log('text to speech')
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text
    })
    const tts_path = `tts_responses/${Date.now()}.mp3`
    const buffer = Buffer.from(await response.arrayBuffer())
    await fs.promises.writeFile(tts_path, buffer)

    return {
      response: text,
      audioUrl: `http://${process.env.BACKEND_HOST}/${tts_path}`
    }
  }
}
