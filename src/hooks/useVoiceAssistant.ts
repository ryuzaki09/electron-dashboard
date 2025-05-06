import React from 'react'

import {MediaRecorderAPI} from '../lib/mediaRecorder'
import {config} from '../config'
import {ai} from '../lib/ai'
import {findIntent} from '../config/intents'
import {openWakeWordSocket} from '../services/websocket'

export function useVoiceAssistant() {
  const [recorder] = React.useState(new MediaRecorderAPI())
  const [isListening, setIsListening] = React.useState(false)

  React.useEffect(
    () => {
      openWakeWordSocket.start({wakeWordDetectedFn: () => setIsListening(true)})
      // if (keywordDetection !== null) {
      //   setIsListening(true)
      // }
    },
    // [keywordDetection]
    []
  )

  // console.log('porcupineIsListening: ', porcupineIsListening)
  React.useEffect(
    () => {
      async function startRecord() {
        await recorder.start()

        const stream = recorder.stream
        if (!stream) return

        const {dataArray, bufferLength, analyser} = createAudioData(stream)

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

  function createAudioData(stream: MediaStream) {
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    source.connect(analyser)
    analyser.fftSize = 512 // adjust for better noise sensitivity

    const bufferLength = analyser.frequencyBinCount

    return {
      dataArray: new Uint8Array(bufferLength),
      bufferLength,
      analyser
    }
  }

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
    // send audio to AI to transcribe and get answer back from AI
    const transcription = await ai.speechToText(audioBlob)
    console.log('TRANSCRIPTION: ', transcription)
    // const aiResponse = await ai.chat(transcription)
    const foundIntent = findIntent(transcription)
    if (foundIntent) {
      console.log('foundIntent: ', foundIntent)

      const triggerResult = foundIntent.intent.triggerFn(
        transcription,
        foundIntent.sentence
      )

      const speechAudio = await ai.textToSpeech(
        foundIntent.intent.responseFromTrigger
          ? (triggerResult as string)
          : foundIntent.intent.tts
      )

      // play audio
      const audio = new Audio(speechAudio.data.audioUrl)
      audio.muted = false
      await audio.play()
      return
    }
    const aiResponse = await ai.chat(transcription)
    const speechAudio = await ai.textToSpeech(aiResponse)

    // play audio
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
