import React from 'react'
import {Link} from 'react-router-dom'

import HomeIcon from '../icons/home'
import MusicIcon from '../icons/music'
import MovieIcon from '../icons/movie'
import HomeAssistantIcon from '../icons/homeAssistant'

import styles from './index.module.css'

export function Header() {
  return (
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
  )
}
