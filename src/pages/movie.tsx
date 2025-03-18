import React from 'react'
import {VideoPlayer} from '@ryusenpai/shared-components'
import {Container} from '../components/container'
import {useCachedPromise} from '../hooks/useCachedPromise'

import styles from './movie.module.css'

export function Movie() {
  const [doFetch, setDoFetch] = React.useState(true)
  const [mediaFiles, setMediaFiles] = React.useState<
    {name: string; url: string}[]
  >([])
  const fetchVideos = async () => {
    return fetch('http://localhost:3000/videos').then((data) => data.json())
  }

  return (
    <Container>
      <div className={styles.appContainer}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <VideoList fetchApi={fetchVideos} />
        </React.Suspense>
      </div>
    </Container>
  )
}

function VideoList({fetchApi}) {
  const data: any[] = useCachedPromise(fetchApi())

  return (
    <>
      {data
        ? data.map((file) => (
            <div key={file.url}>
              {file.name}
              <div>
                <VideoPlayer
                  videoSrc={`http://localhost:3000${file.url}`}
                  enableToggleFullScreen
                />
              </div>
            </div>
          ))
        : null}
    </>
  )
}
