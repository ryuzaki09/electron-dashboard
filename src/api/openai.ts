import axios from 'axios'

export const openAiAPI = {
  converse: async (audio: Blob) => {
    const formData = new FormData()
    formData.append('audio', audio, 'recording.wav')
    console.log('calling whisper')
    const response = await axios.post(
      `http://${process.env.BACKEND_HOST}/openai/converse`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    console.log('got response: ', response.data)
    return response.data
  },

  textToSpeech: async (text: string) => {
    console.log('text to speech')
    const response = await axios.post(
      `http://${process.env.BACKEND_HOST}/openai/tts`,
      {
        text
      }
    )

    return response
  }
}
