import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import {Main} from './pages/main'
import {Movie} from './pages/movie'

import './app.module.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        {/* <Route path="/music" element={<Movie />} /> */}
        <Route path="/movie" element={<Movie />} />
      </Routes>
    </Router>
  )
}
