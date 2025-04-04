import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import {Main} from './pages/main'
import {Movie} from './pages/movie'
import {Music} from './pages/music'
import {HomeAssistant} from './pages/home-assistant'
import {Assistant} from './pages/assistant'
import {MusicProvider} from './context/audio'
import {WithWeatherForecast} from './components/withWeatherForecast'

import './app.module.css'

export default function App() {
  return (
    <MusicProvider>
      <WithWeatherForecast>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/music" element={<Music />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/home-assistant" element={<HomeAssistant />} />
            <Route path="/assistant" element={<Assistant />} />
          </Routes>
        </Router>
      </WithWeatherForecast>
    </MusicProvider>
  )
}
