import {config} from '../config'

export const apiConstants = {
  localSTT: config.sttHost,
  localTTS: config.ttsHost
}

export const aiEndpoints = {
  sttEndpoint: config.sttHost
    ? `${config.sttHost}/transcribe`
    : `${config.localApiUrl}/openai/stt`,
  ttsEndpoint: config.ttsHost
    ? `${config.ttsHost}/v1/audio/speech`
    : `${config.localAiHost}/openai/tts`
}
