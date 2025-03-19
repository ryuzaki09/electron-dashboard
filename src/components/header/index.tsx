import React from 'react'
import {Link} from 'react-router-dom'
import {Icon} from '@ryusenpai/shared-components'

import HomeIcon from '../icons/home'
import MusicIcon from '../icons/music'
import MovieIcon from '../icons/movie'
import HomeAssistantIcon from '../icons/homeAssistant'
import {useAudio, PlayStates} from '../../context/audio'

import styles from './index.module.css'

export function Header() {
  const {playingTrack, playState, resume, pause} = useAudio()

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
      {playingTrack && (
        <MediaControls
          playingTrack={playingTrack}
          playState={playState}
          resumeFn={resume}
          pauseFn={pause}
        />
      )}
    </>
  )
}

function MediaControls({playingTrack, playState, resumeFn, pauseFn}) {
  return (
    <div className={styles.mediaControls}>
      <div>{playingTrack && `Playing: ${playingTrack.name}`}</div>
      <div className={styles.controls}>
        <span
          className={
            !playingTrack || playState === PlayStates.paused
              ? ''
              : styles.active
          }
          onClick={
            !playingTrack || playState === PlayStates.paused
              ? () => {}
              : pauseFn
          }
        >
          <Icon name="pause" />
        </span>
        <span
          onClick={
            !playingTrack || playState === PlayStates.playing
              ? () => {}
              : resumeFn
          }
          className={
            !playingTrack || playState === PlayStates.playing
              ? ''
              : styles.active
          }
        >
          <Icon name="play" />
        </span>
      </div>
    </div>
  )
}
