import React from 'react'

import {Container} from '../components/container'
import {useVoiceAssistant} from '../hooks/useVoiceAssistant'

export function Assistant() {
  const {isListening, stopRecording, setIsListening} = useVoiceAssistant()

  return (
    <Container>
      <div>Hello I am the assistant!</div>
      <button
        onClick={isListening ? stopRecording : () => setIsListening(true)}
      >
        {isListening ? 'Stop Listening' : 'Start to listen'}
      </button>
    </Container>
  )
}
