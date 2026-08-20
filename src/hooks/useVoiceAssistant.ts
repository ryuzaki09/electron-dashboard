import React from 'react'

import {MediaRecorderAPI} from '../lib/mediaRecorder'
import {config} from '../config'
import {ai} from '../lib/ai'
import {findIntent} from '../config/intents'
import {openWakeWordSocket} from '../services/websocket'
import {mainStore} from '../store/mainStore'
import {useAudio} from '../context/audio'

export function useVoiceAssistant() {
  const [recorder] = React.useState(new MediaRecorderAPI())
  const {playerVolume, setVolume} = useAudio()
  const currentVolumeRef = React.useRef(playerVolume)
  const savedVolumeRef = React.useRef(0)
  currentVolumeRef.current = playerVolume

  // const [isListening, setIsListening] = React.useState(false)
  const {
    voiceAssistantIsListening: isListening,
    setVoiceAssistantIsListening: setIsListening
  } = mainStore((state) => state)

  React.useEffect(
    () => {
      if (config.openWakeWordServer) {
        openWakeWordSocket.start({
          wakeWordDetectedFn: () => {
            savedVolumeRef.current = currentVolumeRef.current
            setVolume(0.2)
            setIsListening(true)
          }
        })
      }
    },
    [setIsListening, setVolume]
  )

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
              }, 1300) // stop after 1.3 seconds of silence
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
      const audioBlob = await recorder.stop()
      // console.log('AUDIO: ', audioBlob)
      await handleSpeechReponse(audioBlob as Blob)
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
    // Process home assistant trigger
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
      const audioUrl = URL.createObjectURL(speechAudio)
      const audio = new Audio(audioUrl)
      //const audio = new Audio(speechAudio.data.audioUrl)
      audio.muted = false
      await audio.play()
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        setVolume(savedVolumeRef.current)
      }
      return
    }
    const aiResponse = await ai.chat(transcription)
    const speechAudio = await ai.textToSpeech(aiResponse)

    // play audio
    const audio = new Audio(speechAudio.data.audioUrl)
    audio.muted = false
    await audio.play()
    audio.onended = () => {
      setVolume(savedVolumeRef.current)
    }
  }

  return {
    isListening,
    stopRecording,
    setIsListening
  }
}
