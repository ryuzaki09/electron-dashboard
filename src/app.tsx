import React from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import {Main} from './pages/main'
import {Movie} from './pages/movie'
import {Music} from './pages/music'
import {HomeAssistant} from './pages/home-assistant'
import {Assistant} from './pages/assistant'
import {MusicProvider} from './context/audio'
import {WithWeatherForecast} from './components/withWeatherForecast'
import {WithReturnHome} from './components/withReturnHome'
import {mainStore} from './store/mainStore'
import {useTimerStore} from './store/timerStore'

import styles from './app.module.css'

const themesMap = {
  default: styles.defaultTheme,
  skyGreen: styles.skyGreenTheme,
  naruto: styles.narutoTheme
}

export default function App() {
  const theme = mainStore((state) => state.theme)
  const {timers} = useTimerStore((state) => state)

  const themeColor = themesMap[theme]

  return (
    <MusicProvider>
      <WithWeatherForecast>
        <main className={themeColor}>
          <Router>
            <WithReturnHome>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/music" element={<Music />} />
                <Route path="/movie" element={<Movie />} />
                <Route path="/home-assistant" element={<HomeAssistant />} />
                <Route path="/assistant" element={<Assistant />} />
              </Routes>
            </WithReturnHome>
          </Router>
        </main>
      </WithWeatherForecast>
    </MusicProvider>
  )
}
