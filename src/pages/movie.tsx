import React from 'react'
import {VideoPlayer} from '@ryusenpai/shared-components'
import {Container} from '../components/container'

import styles from './movie.module.css'

export function Movie() {
  React.useEffect(() => {
    const getFiles = async () => {
      fetch('http://localhost:3000/files')
        .then((res) => res.json())
        .then((data) => console.log('data: ', data))
        .catch((err) => console.log('errpr fetch: ', err))
    }

    getFiles()
  }, [])

  return (
    <Container>
      <div className={styles.appContainer}>
        <VideoPlayer videoSrc={'/assets/ep06.mp4'} />
        <div />
      </div>
    </Container>
  )
}
