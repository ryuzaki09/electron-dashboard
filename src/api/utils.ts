import {config} from '../config'

export function buildTTSBody(text: string) {
  if (config.ttsHost) {
    return {
      model: 'kokoro',
      input: text,
      voice: 'af_alloy',
      response_format: 'mp3',
      download_format: 'mp3',
      return_download_link: true
    }
  }

  return {text}
}

export function handleTtsResponse(data: any, isAudio = false) {
  if (isAudio) {
    const blob = new Blob([data], {type: 'audio/mp3'})
    const audioURL = URL.createObjectURL(blob)
    return audioURL
  }

  return data
}
