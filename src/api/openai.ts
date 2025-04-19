import axios from 'axios'

export const openAiAPI = {
  speechToText: async (audio: Blob) => {
    const formData = new FormData()
    formData.append('audio', audio, 'recording.wav')

    const {data} = await axios.post(
      `${process.env.LOCAL_API_URL}/openai/stt`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    console.log('transcribed result: ', data)

    return data ? data : ''
    // return result.data.transcription || ''
  },
  converse: async (audio: Blob) => {
    const formData = new FormData()
    formData.append('audio', audio, 'recording.wav')
    console.log('calling whisper')
    const response = await axios.post(
      `${process.env.LOCAL_API_URL}/openai/converse`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    console.log('got response: ', response.data)
    return response.data.choices[0].message.content
  },

  textToSpeech: async (text: string) => {
    console.log('text to speech')
    const response = await axios.post(
      `${process.env.LOCAL_API_URL}/openai/tts`,
      {
        text
      }
    )

    return response
  },

  chat: async (transcription: string) => {
    const response = await axios.post(
      `${process.env.LOCAL_API_URL}/openai/chat`,
      {
        text: transcription
      }
    )
    console.log('Frontend chat response: ', response)

    return response.data.choices
      ? response.data.choices[0].message.content
      : response.data
  }
}
