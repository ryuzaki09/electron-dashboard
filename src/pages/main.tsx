import React from 'react'
import {format} from 'date-fns'

import {Container} from '../components/container'
import {useTime} from '../hooks/useTime'
import {mainStore} from '../store/mainStore'

import styles from './main.module.css'

export function Main() {
  return (
    <Container>
      <div className={styles.contentContainer}>
        <TimeDisplay />
        <WeatherInformation />
      </div>
    </Container>
  )
}

function TimeDisplay() {
  const date = new Date()
  const {amPm, time} = useTime()
  return (
    <div className={styles.dateTimeWrapper}>
      <div>
        <time className={styles.time}>{time}</time> {amPm}
      </div>
      <div>{format(date, "eeee', 'do LLL")}</div>
    </div>
  )
}

function WeatherInformation() {
  const weatherData = mainStore((state) => state.weather)

  if (!weatherData) {
    return <div>Loading...</div>
  }

  const {weather, temp, daily} = weatherData
  const WeatherIcon = weather ? weather.icon : null

  return (
    <div className={styles.weather}>
      <div>
        {WeatherIcon && <WeatherIcon />}
        <div>
          {weather?.main} {temp}&deg;C
        </div>
      </div>
      <div className={styles.dailyWeather}>
        {daily.length > 0 && daily.map((d, index: number) => {
          const Icon = d.weather.icon
          return index > 0 && index < 4 ? (
            <div key={d.dt.day}>
              <Icon />
              <p>
                {d.dt.day}<br />
                {d.temp.min}&deg;C / {d.temp.max}&deg;C
              </p>
            </div>
          ) : null
        })}
      </div>
    </div>
  )
}
