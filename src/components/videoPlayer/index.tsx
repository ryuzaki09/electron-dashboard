import React from 'react'

import styles from './index.module.css'

export function VideoPlayer() {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const playVideo = () => {
    if (!videoRef.current) {
      return
    }

    videoRef.current.play()
  }

  const stopVideo = () => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.pause()
  }

  return (
    <div className={styles.videoContainer}>
      <video ref={videoRef}>
        <source src="./assets/Dragon Ball Z - 017.mkv" type="video/mp4" />
      </video>
      <div className={styles.controls}>
        <button onClick={playVideo}>Play</button>
        <button onClick={stopVideo}>Stop</button>
      </div>
    </div>
  )
}
