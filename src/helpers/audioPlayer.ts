import React from 'react'

interface IMediaComponentProps {
  audioTracks: Array<{streamUrl: string}>
  onFinishFn: () => Promise<void>
  playingIndex: number
  onNextFn: () => Promise<void>
  onPreviousFn: () => void
  isPlaying: boolean
  playingTrack: any | null
  onPlayCallback: () => void
  onPauseCallback: () => void
}

export enum PlayStates {
  playing = 'playing',
  paused = 'paused',
  stopped = 'stopped'
}

export function useMediaPlayer() {
  const player = React.useRef(new Audio())
  const [playState, setPlayState] = React.useState<PlayStates>(
    PlayStates.stopped
  )

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

  function isPlaying() {
    return !player.current.paused
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

  function setOnEnd(fn: () => void) {
    player.current.addEventListener('ended', () => {
      fn()
      setPlayState(PlayStates.stopped)
    })
  }

  return {
    play,
    isPlaying,
    pause,
    playState,
    resume,
    setStreamUrl,
    stop,
    setOnEnd
  }
}
