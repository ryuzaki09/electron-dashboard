import React from 'react'
import {Container} from '../components/container'

import {useTime} from '../hooks/useTime'
import {weatherApi} from '../api/weatherApi'

import styles from './main.module.css'

export function Main() {
  const [weatherData, setWeatherData] = React.useState<any>(null)
  const {amPm, time} = useTime()

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
        <div>
          <span className={styles.time}>{time}</span> {amPm}
        </div>
        <WeatherInformation data={weatherData}/>
      </div>
    </Container>
  )
}

function WeatherInformation({data}) {
  console.log('weather: ', data)
  const WeatherIcon = data?.weather?.icon
  return (
    <div className={styles.weather}>
      <div>
      {WeatherIcon && <WeatherIcon />}
      {data?.weather?.main}
      </div>
      <div className={styles.dailyWeather}>
        {data?.daily.length > 0 && data.daily.map((d, index) => {
          const Icon = d.weather.icon
          return index > 0 && index < 4 ? (
            <div key={d.dt}><Icon /></div>
          ) : null
        })}
      </div>
    </div>
  )
}
