import React from 'react'
import {Container} from '../components/container'

import {useTime} from '../hooks/useTime'
import {weatherApi} from '../api/weatherApi'

import styles from './main.module.css'

export function Main() {
  const [weatherData, setWeatherData] = React.useState<any>(null)

  React.useEffect(() => {
    async function getWeather() {
      const data = await weatherApi.getForecast()
      if (data) {
        setWeatherData(data)
      }
    }

    getWeather()
  }, [])


  return (
    <Container>
      <div className={styles.contentContainer}>
        <TimeDisplay />
        <WeatherInformation data={weatherData}/>
      </div>
    </Container>
  )
}

function TimeDisplay() {
  const {amPm, time} = useTime()
  return (
    <div>
      <span className={styles.time}>{time}</span> {amPm}
    </div>
  )
}

function WeatherInformation({data}) {
  const WeatherIcon = data?.weather?.icon

  return (
    <div className={styles.weather}>
      <div>
        {WeatherIcon && <WeatherIcon />}
        <div>
          {data?.weather?.main} {data?.temp}&deg;C
        </div>
      </div>
      <div className={styles.dailyWeather}>
        {data?.daily.length > 0 && data.daily.map((d, index) => {
          const Icon = d.weather.icon
          return index > 0 && index < 4 ? (
            <div key={d.dt.day}><Icon /><p>{d.dt.day}<br />{d.temp.min}&deg;C / {d.temp.max}&deg;C</p></div>
          ) : null
        })}
      </div>
    </div>
  )
}
