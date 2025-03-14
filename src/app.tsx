import React from 'react'

import {HomeContent} from './components/home-content'
import {Header} from './components/header'
import {VideoPlayer} from '@ryusenpai/shared-components'
// import {VideoPlayer} from './components/videoPlayer'

import styles from './app.module.css'

export default function App() {
  return (
    <div className={styles.appContainer}>
      <Header />
      <HomeContent />
      <VideoPlayer videoSrc={'/assets/ep06.mp4'} />
      <div />
    </div>
  )
}
