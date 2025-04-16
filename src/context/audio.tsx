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
  const [shufflePlayList, setShufflePlayList] = React.useState<IAudioFile[]>([])
  const [shufflePlayIndex, setShufflePlayIndex] = React.useState(0)
  const [playerVolume, setPlayerVolume] = React.useState(0.5)

  React.useEffect(
    () => {
      if (!player.current) return

      const audioPlayer = player.current

      function onEnd() {
        setPlayState(PlayStates.stopped)

        if (shufflePlayList.length > 0) {
          if (shufflePlayIndex < shufflePlayList.length - 1) {
            // console.log('ended: ', shufflePlayList)
            setShufflePlayIndex((prevIndex) => prevIndex + 1)
            const file = shufflePlayList[shufflePlayIndex + 1]
            // console.log('ended next file: ', file)
            setStreamUrl(`${file.domain}${file.url}`)
            setPlayingTrack(file)
            play()
          } else {
            setShufflePlayList([])
            setShufflePlayIndex(0)
            setPlayingTrack(null)
            stop()
          }
        }
      }
      audioPlayer.addEventListener('ended', onEnd)

      return () => {
        audioPlayer.removeEventListener('ended', onEnd)
      }
    },
    [shufflePlayIndex, shufflePlayList]
  )

  function setStreamUrl(url: string) {
    player.current.src = encodeUrl(url)
  }

  function setShuffleList(list: any[]) {
    setShufflePlayList(list)
    stop()
    const file = list[0]
    setStreamUrl(`${file.domain}${file.url}`)
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

  function previous() {
    if (shufflePlayList.length > 0 && shufflePlayIndex > 0) {
      stop()
      setShufflePlayIndex((prevIndex) => prevIndex - 1)

      const file = shufflePlayList[shufflePlayIndex - 1]
      setStreamUrl(`${file.domain}${file.url}`)
      setPlayingTrack(file)
      play()
    }
  }

  function next() {
    if (
      shufflePlayList.length > 0 &&
      shufflePlayIndex < shufflePlayList.length - 1
    ) {
      stop()
      setShufflePlayIndex((prevIndex) => prevIndex + 1)

      const file = shufflePlayList[shufflePlayIndex + 1]
      setStreamUrl(`${file.domain}${file.url}`)
      setPlayingTrack(file)
      play()
    }
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

  function increaseVolume() {
    if (playerVolume < 1) {
      const newVolume = playerVolume + 0.1
      player.current.volume = newVolume
      setPlayerVolume(newVolume)
    }
  }

  function decreaseVolume() {
    if (playerVolume > 0) {
      const newVolume = playerVolume - 0.1
      player.current.volume = newVolume
      setPlayerVolume(newVolume)
    }
  }

  function setVolume(volume: number) {
    player.current.volume = volume
    setPlayerVolume(volume)
  }

  const isFirstTrack = shufflePlayList.length > 0 && !shufflePlayIndex
  const isLastTrack =
    shufflePlayList.length > 0 &&
    shufflePlayIndex === shufflePlayList.length - 1

  return (
    <MusicContext.Provider
      value={{
        setStreamUrl,
        setShuffleList,
        setPlayingTrack,
        play,
        pause,
        stop,
        resume,
        previous,
        next,
        increaseVolume,
        decreaseVolume,
        setVolume,
        playerVolume,
        playState,
        playingTrack,
        isFirstTrack,
        isLastTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

function encodeUrl(url: string) {
  return encodeURI(url).replace(/#/g, '%23')
}
