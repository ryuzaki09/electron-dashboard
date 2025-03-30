import React from 'react'
import {BuiltInKeyword} from '@picovoice/porcupine-web'
import {usePorcupine} from '@picovoice/porcupine-react'

import {MediaRecorderAPI} from '../lib/mediaRecorder'
import {config} from '../config'
import {ai} from '../lib/ai'

const porcupineModel = {
  publicPath: '/porcupine_params_02.pv',
  customWritePath: 'porcupine_params_02.pv',
  forceWrite: true
  // base64: '/base64_output'
}

export function useVoiceAssistant() {
  const [recorder] = React.useState(new MediaRecorderAPI())
  const [isListening, setIsListening] = React.useState(false)
  const {
    keywordDetection,
    isLoaded,
    isListening: porcupineIsListening,
    error,
    init,
    start,
    stop,
    release
  } = usePorcupine()

  React.useEffect(
    () => {
      if (keywordDetection !== null) {
        setIsListening(true)
      }
    },
    [keywordDetection]
  )

  React.useEffect(
    () => {
      if (isLoaded) return
      const initialize = async () => {
        console.log('initialize')
        await init(
          config.picovoiceKey as string,
          [BuiltInKeyword.OkayGoogle],
          porcupineModel
        )
        console.log('START')
        // start()
      }
      if (config.useWakeWord) {
        initialize()
      }
    },
    [isLoaded, init, start]
  )

  // console.log('porcupineIsListening: ', porcupineIsListening)
  React.useEffect(
    () => {
      async function startRecord() {
        await recorder.start()

        const stream = recorder.stream
        if (!stream) return

        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        source.connect(analyser)
        analyser.fftSize = 512 // adjust for better noise sensitivity

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        let silenceTimer: NodeJS.Timeout | null = null

        let runCheckSilence: boolean = isListening

        function checkForSilence() {
          console.log('checking')
          if (!runCheckSilence) return

          analyser.getByteFrequencyData(dataArray)
          const avgVolume =
            dataArray.reduce((acc, val) => acc + val, 0) / bufferLength

          //adjust threshold
          if (avgVolume < 10) {
            if (!silenceTimer) {
              silenceTimer = setTimeout(async () => {
                console.log("It's silent")
                runCheckSilence = false
                // const audioBlob = await recorder.stop()
                // await handleSpeechReponse(audioBlob as Blob)
                stopRecording()
              }, 1500) // stop after 1.5 seconds of silence
            }
          } else {
            if (silenceTimer) {
              clearTimeout(silenceTimer)
              silenceTimer = null
            }
          }

          requestAnimationFrame(checkForSilence)
        }

        checkForSilence()
      }

      if (isListening) {
        startRecord()
      }
    },
    [isListening, recorder]
  )

  function stopRecording() {
    const stopAll = async () => {
      // stop()
      const audioBlob = await recorder.stop()
      // console.log('AUDIO: ', audioBlob)
      await handleSpeechReponse(audioBlob as Blob)
      if (config.useWakeWord) {
        stop()
      }
    }
    stopAll()
  }

  async function handleSpeechReponse(audioBlob: Blob) {
    setIsListening(false)
    const aiAudioResponse = await ai.converse(audioBlob)
    console.log('AI response: ', aiAudioResponse)
    const speechAudio = await ai.textToSpeech(aiAudioResponse)
    // const aiAudioResponse = await openAiAPI.converse(audioBlob)
    // console.log('tts result: ', aiAudioResponse)
    const audio = new Audio(speechAudio.data.audioUrl)
    audio.muted = false
    await audio.play()
  }

  return {
    isListening,
    stopRecording,
    setIsListening
  }
}
