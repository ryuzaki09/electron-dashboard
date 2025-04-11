import React from 'react'
import classnames from 'classnames'
import {Link, useLocation} from 'react-router-dom'
import {Icon} from '@ryusenpai/shared-components'

import HomeIcon from '../icons/home'
import MusicIcon from '../icons/music'
import MovieIcon from '../icons/movie'
import HomeAssistantIcon from '../icons/homeAssistant'
import {useAudio, PlayStates} from '../../context/audio'
import {useVoiceAssistant} from '../../hooks/useVoiceAssistant'
import {config} from '../../config'

import styles from './index.module.css'

export function Header() {
  const {isListening, setIsListening} = useVoiceAssistant()
  console.log('isListening: ', isListening)

  return (
    <>
      <header>
        <nav className={styles.navWrapper}>
          <Link to="/">
            <HomeIcon />
          </Link>
          <Link to="/music">
            <MusicIcon />
          </Link>
          <Link to="/movie">
            <MovieIcon />
          </Link>
          <Link to="/home-assistant">
            <HomeAssistantIcon />
          </Link>
          {config.isDevelopment && (
            <button
              onClick={isListening ? () => {} : () => setIsListening(true)}
            >
              {isListening ? 'Listening..' : 'Press to talk'}
            </button>
          )}
        </nav>
      </header>
      <MediaControls />
    </>
  )
}

function MediaControls() {
  const {
    playingTrack,
    playState,
    resume,
    pause,
    previous,
    next,
    setVolume,
    increaseVolume,
    decreaseVolume,
    playerVolume,
    isLastTrack,
    isFirstTrack
  } = useAudio()
  const {pathname} = useLocation()

  function onVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {value} = e.target

    setVolume(+value / 10)
  }

  const isMusicPage = pathname === '/music'
  const shouldShowControls = isMusicPage || (!isMusicPage && playingTrack)

  return (
    <div
      className={classnames(styles.mediaControls, {
        [styles.mediaControlsActive]: shouldShowControls
      })}
    >
      <span
        className={classnames(styles.volume, styles.active)}
        onClick={decreaseVolume}
      >
        <Icon name="volumeLow" />
      </span>
      <input
        type="range"
        id="volume"
        name="volume"
        min="0"
        max="10"
        value={playerVolume * 10}
        onChange={onVolumeChange}
      />
      <span
        className={classnames(styles.volume, styles.active)}
        onClick={increaseVolume}
      >
        <Icon name="volumeHigh" />
      </span>
      <div>
        <div>{playingTrack && `Playing: ${playingTrack.name}`}</div>
      </div>
      <div className={styles.controls}>
        <span
          onClick={previous}
          className={!isFirstTrack && playingTrack ? styles.active : ''}
        >
          <Icon name="previous" />
        </span>
        <span
          className={
            !playingTrack ||
            playState === PlayStates.paused ||
            playState === PlayStates.stopped
              ? ''
              : styles.active
          }
          onClick={
            !playingTrack || playState === PlayStates.paused ? () => {} : pause
          }
        >
          <Icon name="pause" />
        </span>
        <span
          onClick={
            !playingTrack || playState === PlayStates.playing
              ? () => {}
              : resume
          }
          className={
            !playingTrack || playState === PlayStates.playing
              ? ''
              : styles.active
          }
        >
          <Icon name="play" />
        </span>
        <span
          onClick={next}
          className={isLastTrack || !playingTrack ? '' : styles.active}
        >
          <Icon name="next" />
        </span>
      </div>
    </div>
  )
}
