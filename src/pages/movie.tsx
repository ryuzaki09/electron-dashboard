import React from 'react'
import {VideoPlayer} from '@ryusenpai/shared-components'
import {Container} from '../components/container'

import styles from './movie.module.css'

export function Movie() {
  const [mediaFiles, setMediaFiles] = React.useState<
    {name: string; url: string}[]
  >([])

  React.useEffect(() => {
    const getFiles = async () => {
      fetch('http://localhost:3000/files')
        .then((res) => res.json())
        .then((data) => {
          console.log('data: ', data)
          setMediaFiles(data)
        })
        .catch((err) => console.log('errpr fetch: ', err))
    }

    getFiles()
  }, [])

  return (
    <Container>
      <div className={styles.appContainer}>
        {mediaFiles.map((file) => (
          <div key={file.url}>
            {file.name}
            <VideoPlayer videoSrc={`http://localhost:3000${file.url}`} />
          </div>
        ))}
      </div>
    </Container>
  )
}
