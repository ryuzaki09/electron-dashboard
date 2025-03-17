import React from 'react'
import {api} from '../../api'
import {Container} from '../../components/container'
import {MusicList} from './musicList'

export function Music() {
  return (
    <Container>
      <React.Suspense fallback={<p>Loading....</p>}>
        <MusicList musicPromise={api.fetchMusic} />
      </React.Suspense>
    </Container>
  )
}

interface ITransformedMedia {
  name: string
  url: string
  type: 'file' | 'folder'
}
