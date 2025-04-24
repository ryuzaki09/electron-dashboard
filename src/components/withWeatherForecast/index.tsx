import React from 'react'
import {mainStore} from '../../store/mainStore'
import {weatherApi} from '../../api/weatherApi'
import {today} from '../../helpers/time'

const ONE_HOUR = 1000 * 60 * 60

export function WithWeatherForecast({children}: {children: React.ReactNode}) {
  const [todayDate, setTodayDate] = React.useState(today)
  const weatherData = mainStore((state) => state.weather)

  React.useEffect(
    () => {
      const getTodayDate = () => today

      let timeoutId: NodeJS.Timeout
      async function getWeather() {
        const data = await weatherApi.getForecast()
        if (data) {
          mainStore.getState().setWeather(data)
        }
      }

      if (!weatherData) {
        getWeather()
      }

      timeoutId = setInterval(() => {
        console.log('checking today')
        if (todayDate !== getTodayDate()) {
          setTodayDate(today)
          getWeather()
        }
      }, ONE_HOUR)

      return () => {
        clearInterval(timeoutId)
      }
    },
    [todayDate, weatherData]
  )

  return <>{children}</>
}
