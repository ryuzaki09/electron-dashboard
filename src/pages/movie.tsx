import React from 'react'
import {VideoPlayer} from '@ryusenpai/shared-components'
import {Container} from '../components/container'
import {useCachedPromise} from '../hooks/useCachedPromise'
import {api} from '../api'

import styles from './movie.module.css'

export function Movie() {
  return (
    <Container>
      <div className={styles.appContainer}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <VideoList fetchApi={api.fetchVideos} />
        </React.Suspense>
      </div>
    </Container>
  )
}

function VideoList({fetchApi}) {
  const data: any[] = useCachedPromise('fetchVideos', fetchApi())

  return (
    <>
      {data
        ? data.map((file) => (
            <div key={file.url}>
              {file.name}
              <div>
                <VideoPlayer
                  videoSrc={`${file.domain}${file.url}`}
                  enableToggleFullScreen
                />
              </div>
            </div>
          ))
        : null}
    </>
  )
}
