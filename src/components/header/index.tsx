import React from 'react'
import classnames from 'classnames'
import {Link} from 'react-router-dom'
import {Icon} from '@ryusenpai/shared-components'

import HomeIcon from '../icons/home'
import MusicIcon from '../icons/music'
import MovieIcon from '../icons/movie'
import HomeAssistantIcon from '../icons/homeAssistant'
import {useAudio, PlayStates} from '../../context/audio'

import styles from './index.module.css'

export function Header() {
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
        </nav>
      </header>
      <MediaControls />
    </>
  )
}

function MediaControls() {
  const {playingTrack, playState, resume, pause, previous, next} = useAudio()

  return (
    <div
      className={classnames(styles.mediaControls, {
        [styles.mediaControlsActive]: playingTrack
      })}
    >
      <div>
        <div>{playingTrack && `Playing: ${playingTrack.name}`}</div>
      </div>
      <div className={styles.controls}>
        <span onClick={previous}>
          <Icon name="previous" />
        </span>
        <span
          className={
            !playingTrack || playState === PlayStates.paused
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
        <span onClick={next}>
          <Icon name="next" />
        </span>
      </div>
    </div>
  )
}
