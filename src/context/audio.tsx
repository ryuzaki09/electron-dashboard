import React from 'react'

export enum PlayStates {
  playing = 'playing',
  paused = 'paused',
  stopped = 'stopped'
}

interface IAudioFile {
  name: string
  url: string
  path: string
  basePath: string
  domain: string
}

const MusicContext = React.createContext<any>(null)

export const useAudio = () => React.useContext(MusicContext)

export function MusicProvider({children}: {children: React.ReactNode}) {
  const player = React.useRef(new Audio())
  const [playState, setPlayState] = React.useState<PlayStates>(
    PlayStates.stopped
  )
  const [playingTrack, setPlayingTrack] = React.useState<any>(null)
  const [onEndCallback, setOnEndCallback] = React.useState<(() => void) | null>(
    null
  )
  const [shufflePlayList, setShufflePlayList] = React.useState<IAudioFile[]>([])
  const [shufflePlayIndex, setShufflePlayIndex] = React.useState(0)

  React.useEffect(
    () => {
      if (!player.current) return

      const audioPlayer = player.current
      function onEnd() {
        setPlayState(PlayStates.stopped)

        if (shufflePlayList.length > 0) {
          setShufflePlayIndex((prevIndex) => prevIndex + 1)
          const file = shufflePlayList[shufflePlayIndex + 1]
          const filePath = file.path.replace(file.basePath, '')
          setStreamUrl(`${file.domain}${filePath}`)
          setPlayingTrack(file)
          play()
        }
        // if (onEndCallback) {
        //   onEndCallback()
        // }
      }
      audioPlayer.addEventListener('ended', onEnd)

      return () => {
        audioPlayer.removeEventListener('ended', onEnd)
      }
    },
    [onEndCallback, shufflePlayIndex, shufflePlayList]
  )

  function setStreamUrl(url: string) {
    player.current.src = url
  }

  function setAudioEndCallback(fn: () => void) {
    setOnEndCallback(fn)
  }

  function setShuffleList(list: any[]) {
    setShufflePlayList(list)
    // console.log('STOP')
    stop()
    const file = list[0]
    const filePath = file.path.replace(file.basePath, '')
    // console.log('STREAM url: ', filePath)
    setStreamUrl(`${file.domain}${filePath}`)
    // console.log('play')
    setPlayingTrack(file)
    play()
  }

  async function play() {
    if (!player.current.src) {
      return
    }

    await player.current.play()
    setPlayState(PlayStates.playing)
  }

  function pause() {
    player.current.pause()
    setPlayState(PlayStates.paused)
  }

  function resume() {
    player.current.play()
    setPlayState(PlayStates.playing)
  }

  function stop() {
    player.current.pause()
    player.current.src = ''
    setPlayState(PlayStates.stopped)
  }

  return (
    <MusicContext.Provider
      value={{
        setStreamUrl,
        setAudioEndCallback,
        setShuffleList,
        setPlayingTrack,
        play,
        stop,
        pause,
        resume,
        playState,
        playingTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}
