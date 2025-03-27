import React from 'react'
import {mainStore} from '../../store/mainStore'
import {weatherApi} from '../../api/weatherApi'

export function WithWeatherForecast({children}: {children: React.ReactNode}) {
  const weatherData = mainStore((state) => state.weather)

  React.useEffect(
    () => {
      async function getWeather() {
        const data = await weatherApi.getForecast()
        if (data) {
          mainStore.getState().setWeather(data)
        }
      }

      if (!weatherData) {
        getWeather()
      }
    },
    [weatherData]
  )

  return <>{children}</>
}
