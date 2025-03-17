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
export function useMediaPlayer() {
  const player = React.useRef(new Audio())

  function setStreamUrl(url: string) {
    player.current.src = url
  }

  async function play() {
    console.log('Player: ', player)
    if (!player.current.src) {
      return
    }

    await player.current.play()
  }

  function isPlaying() {
    return !player.current.paused
  }

  function pause() {
    player.current.pause()
    console.log('player: ', player)
  }

  function resume() {
    player.current.play()
  }

  function stop() {
    player.current.pause()
    player.current.src = ''
  }

  function setOnEnd(fn: () => void) {
    player.current.addEventListener('ended', fn)
  }

  return {
    play,
    isPlaying,
    pause,
    resume,
    setStreamUrl,
    stop,
    setOnEnd
  }
}

// export class MediaPlayer {
//   player: null | HTMLMediaElement = null
//
//   constructor() {
//     this.player = new Audio()
//   }
//
//   setStreamUrl(url: string) {
//     if (!this.player) {
//       return
//     }
//     this.player.src = url
//   }
//
//   async play() {
//     if (!this.player || !this.player.src) {
//       return
//     }
//
//     await this.player.play()
//   }
//
//   isPlaying() {
//     return !this.player?.paused
//   }
//
//   pause() {
//     if (!this.player) return
//
//     this.player.pause()
//   }
//
//   resume() {
//     this.player?.play()
//   }
//
//   stop() {
//     if (!this.player) {
//       return
//     }
//
//     this.player.pause()
//     this.player.src = ''
//   }
//
//   setOnEnd(fn: () => void) {
//     if (!this.player) return
//
//     this.player.addEventListener('ended', fn)
//   }
// }
