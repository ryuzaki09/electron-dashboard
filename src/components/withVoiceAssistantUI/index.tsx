import React from 'react'
import classnames from 'classnames'

import {useVoiceAssistant} from '../../hooks/useVoiceAssistant'

import styles from './index.module.css'

export function WithVoiceAssistantUI({children}: {children: React.ReactNode}) {
  // const [isActive, setIsActive] = React.useState(false)
  const {isListening} = useVoiceAssistant()

  // React.useEffect(() => {
  //   setInterval(() => {
  //     setIsActive((prevState) => !prevState)
  //   }, 5000)
  // }, [])

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
