import {OpenAI} from 'openai'
import {Uploadable} from 'openai/uploads'
import {ChatCompletionMessageParam} from 'openai/resources'
import fs from 'fs'
import 'dotenv/config'
import {functions} from '../helpers/openai'
import {getFunctionCall} from './functionCallers'
import {dateAndDay} from '../../src/helpers/time'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
})

const systemPrompt: ChatCompletionMessageParam = {
  role: 'developer',
  content: `You are a helpful assistant that have the knowledge of the universe. You will answer in a concise and simplified manner.
  Today's date is ${dateAndDay}.`
}

const MAX_HISTORY = 10
let chatHistory: ChatCompletionMessageParam[] = []

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
    chatHistory.push({
      role: 'user',
      content: transcription
    })

    if (chatHistory.length > MAX_HISTORY) {
      chatHistory.shift()
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [systemPrompt, ...chatHistory],
      tools: functions
    })

    const {message} = response.choices[0]

    if (message.tool_calls) {
      return handleCustomFunction({
        message
      })
    }
    console.log('got response from chat: ', message)

    return response.choices[0].message.content
  },

  textToSpeech: async (text: string) => {
    console.log('requesting openai text to speech: ', text)
    try {
      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: filterTextInput(text)
      })
      const tts_path = `tts_responses/${Date.now()}.mp3`
      const buffer = Buffer.from(await response.arrayBuffer())
      await fs.promises.writeFile(tts_path, buffer)

      return {
        response: text,
        audioUrl: `${process.env.BACKEND_HOST}/${tts_path}`
      }
    } catch (e) {
      console.log('Unable to request tts: ', e)
      return {
        response: text,
        audioUrl: ''
      }
    }
  }
}

async function handleCustomFunction({message}) {
  const toolCall = message.tool_calls[0]
  const customFunction = getFunctionCall(toolCall.function.name)

  if (customFunction) {
    console.log('Calling custom function: ', toolCall.function.name)
    const args = JSON.parse(toolCall.function.arguments)
    console.log('args: ', args)
    const result = await customFunction.functionCaller(args)
    // console.log('Function result: ', JSON.stringify(result))
    chatHistory.push(message)

    chatHistory.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(result)
    })
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [systemPrompt, ...chatHistory],
      tools: functions
    })

    chatHistory = []

    return response
  }
}

function filterTextInput(text: string) {
  return text.replaceAll('°C', ' degree celsius')
}
