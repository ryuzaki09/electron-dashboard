import React from 'react'

import HomeIcon from '../icons/home'
import MusicIcon from '../icons/music'
import MovieIcon from '../icons/movie'
import HomeAssistantIcon from '../icons/homeAssistant'

import styles from './index.module.css'

export function Header() {
  return (
    <header>
      <nav className={styles.navWrapper}>
        <a href="/">
          <HomeIcon />
        </a>
        <a href="/music">
          <MusicIcon />
        </a>
        <a href="/movie">
          <MovieIcon />
        </a>
        <a href="/home-assistant">
          <HomeAssistantIcon />
        </a>
      </nav>
    </header>
  )
}
