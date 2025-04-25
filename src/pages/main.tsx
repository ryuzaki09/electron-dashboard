import React from 'react'
import {format} from 'date-fns'
import classnames from 'classnames'

import {Container} from '../components/container'
import {useTime} from '../hooks/useTime'
import {mainStore} from '../store/mainStore'

import styles from './main.module.css'
import { WithPhotoLibrary } from '../components/withPhotoLibrary'

export function Main() {
  return (
    <WithPhotoLibrary>
      <Container>
        <div className={styles.contentContainer}>
          <TimeDisplay />
          <WeatherInformation />
        </div>
      </Container>
    </WithPhotoLibrary>
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
  const [forecastIsOpen, setForecastIsOpen] = React.useState(false)
  const weatherData = mainStore((state) => state.weather)
  const weatherWrapperRef = React.useRef<HTMLDivElement>(null)

  if (!weatherData) {
    return <div>Loading...</div>
  }

  const {weather, daily} = weatherData
  const WeatherIcon = weather ? weather.icon : null
  const [todayWeather] = daily

  return (
    <>
      <div
        className={styles.weather}
        ref={weatherWrapperRef}
        onClick={() => setForecastIsOpen(true)}
      >
        <div>
          {WeatherIcon && <WeatherIcon />}
          <div>
            {weather.main} {todayWeather.temp.max}
            &deg;C
          </div>
        </div>
        <div className={styles.dailyWeather}>
          {daily.length > 0 &&
            daily.map((d, index: number) => {
              const Icon = d.weather.icon
              return index > 0 && index < 4 ? (
                <div key={d.dt.day}>
                  <Icon />
                  <p>
                    {d.dt.day}
                    <br />
                    {d.temp.min}
                    &deg;C / {d.temp.max}
                    &deg;C
                  </p>
                </div>
              ) : null
            })}
        </div>
      </div>
      <div
        className={classnames(styles.forecastModal, {
          [styles.modalActive]: forecastIsOpen
        })}
      >
        <div>
          <span
            onClick={() => {
              setForecastIsOpen(false)
            }}
          >
            ✕
          </span>
        </div>
        <div className={styles.forecastModalContent}>
          {daily.length > 0 &&
            daily.map((d) => {
              const Icon = d.weather.icon
              return (
                <div key={`forecast_${d.dt.day}`}>
                  <Icon />
                  {d.dt.day}
                  <br />
                  {d.temp.min}
                  &deg;C / {d.temp.max}
                  &deg;C
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}
