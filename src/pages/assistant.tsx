import React from 'react'

import {Container} from '../components/container'
import {useVoiceAssistant} from '../hooks/useVoiceAssistant'

export function Assistant() {
  const {checkIsListening, stopRecording, setIsListening} = useVoiceAssistant()

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
