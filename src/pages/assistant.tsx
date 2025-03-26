import React from 'react'
import {BuiltInKeyword} from '@picovoice/porcupine-web'
import {usePorcupine} from '@picovoice/porcupine-react'
import * as tts from '@mintplex-labs/piper-tts-web'

import {MediaRecorderAPI} from '../lib/mediaRecorder'
import {Container} from '../components/container'
import {config} from '../config'
import {ai} from '../lib/ai'

const porcupineModel = {
  publicPath: '/porcupine_params.pv'
}

export function Assistant() {
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

  const checkIsListening = () =>
    (isListening && !config.useWakeWord) ||
    (porcupineIsListening && config.useWakeWord)

  React.useEffect(() => {
    const playAudio = async () => {
      console.log(await tts.stored())
      // await tts.download('en_US-hfc_female-medium', (progress) => {
      //   console.log(
      //     `Downloading ${progress.url} - ${Math.round(
      //       (progress.loaded * 100) / progress.total
      //     )}%`
      //   )
      // })
      const wav = await tts.predict({
        text: 'Text to speech in the browser is amazing!',
        voiceId: 'en_US-hfc_female-medium'
      })

      const audio = new Audio()
      audio.src = URL.createObjectURL(wav)
      audio.play()
    }

    playAudio()
    // as seen in /example with Web Worker
  }, [])

  React.useEffect(
    () => {
      if (isLoaded) return
      const initialize = async () => {
        console.log('initialize')
        await init(config.picovoiceKey, [BuiltInKeyword.Alexa], porcupineModel)
        start()
      }
      if (config.useWakeWord) {
        initialize()
      }
    },
    [isLoaded, init, start]
  )

  console.log('porcupineIsListening: ', porcupineIsListening)
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
                const audioBlob = await recorder.stop()
                await handleSpeechReponse(audioBlob as Blob)
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

      if (checkIsListening()) {
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
    }
    stopAll()
  }

  async function handleSpeechReponse(audioBlob: Blob) {
    setIsListening(false)
    const aiAudioResponse = await ai.converse(audioBlob)
    // const aiAudioResponse = await openAiAPI.converse(audioBlob)
    // console.log('tts result: ', aiAudioResponse)
    // const audio = new Audio(aiAudioResponse.data.audioUrl)
    // audio.muted = false
    // await audio.play()
  }

  return (
    <Container>
      <div>Hello I am the assistant!</div>
      <button
        onClick={
          checkIsListening() ? stopRecording : () => setIsListening(true)
        }
      >
        {checkIsListening() ? 'Stop Listening' : 'Start to listen'}
      </button>
    </Container>
  )
}
