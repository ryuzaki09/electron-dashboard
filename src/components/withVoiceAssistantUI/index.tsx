import React from 'react'
import classnames from 'classnames'

import {mainStore} from '../../store/mainStore'

import styles from './index.module.css'

export function WithVoiceAssistantUI({children}: {children: React.ReactNode}) {
  const {voiceAssistantIsListening: isListening} = mainStore()

  React.useEffect(
    () => {
      if (isListening) {
        const audio = new Audio('/assets/sounds/awake.wav')
        audio.play()
      }
    },
    [isListening]
  )

  console.log('voice listening: ', isListening)
  return (
    <>
      {children}
      <div className={styles.assistantWrapper}>
        <div
          className={classnames(styles.assistantUI, {
            [styles.assistantActive]: isListening
          })}
        />
      </div>
    </>
  )
}
