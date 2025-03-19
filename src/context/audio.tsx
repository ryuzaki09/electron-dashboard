import React from 'react'

export enum PlayStates {
  playing = 'playing',
  paused = 'paused',
  stopped = 'stopped'
}

const MusicContext = React.createContext<any>(null)

export const useAudio = () => React.useContext(MusicContext)

export function MusicProvider({children}: {children: React.ReactNode}) {
  const player = React.useRef(new Audio())
  const [playState, setPlayState] = React.useState<PlayStates>(
    PlayStates.stopped
  )
  const [playingTrack, setPlayingTrack] = React.useState<any>(null)

  React.useEffect(() => {
    if (!player.current) return

    const audioPlayer = player.current
    function onEnd() {
      setPlayState(PlayStates.stopped)
    }
    audioPlayer.addEventListener('ended', onEnd)

    return () => {
      audioPlayer.removeEventListener('ended', onEnd)
    }
  }, [])

  function setStreamUrl(url: string) {
    player.current.src = url
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

  // function setOnEnd(fn: () => void) {
  //   player.current.addEventListener('ended', () => {
  //     fn()
  //     setPlayState(PlayStates.stopped)
  //   })
  // }
  return (
    <MusicContext.Provider
      value={{
        setStreamUrl,
        play,
        stop,
        pause,
        resume,
        playState,
        setPlayingTrack,
        playingTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}
