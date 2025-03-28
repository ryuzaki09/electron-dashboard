import axios from 'axios'
import 'dotenv/config'
import {config} from '../../src/config'
import {coords} from '../../src/config/config'
import {timestampToUKdate} from '../../src/helpers/time'

interface IGetWeatherProps {
  longitude: number;
  latitude: number;
}

async function getWeatherForecast({date}: {date: string}) {
  const weather = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${
        coords.lon
      }&exclude=hourly,minutely&units=metric&appid=${config.openweatherKey}`
    )

  const {data} = weather
  console.log('current weather data: ', data)
  if (!data) {
    return null
  }

  const dailyData = data.daily
  const foundDailyData = dailyData.find((d) => timestampToUKdate(d.dt) === date)

  console.log('found daily data: ', foundDailyData)

  if (foundDailyData) {
    return {
      high_temperature: Math.round(foundDailyData.temp.max),
      low_temperature: Math.round(foundDailyData.temp.min),
    } 
  }

  return {}
}

async function getWeatherForecastForLocation({longitude, latitude}: IGetWeatherProps) {
  const weather = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${
        longitude
      }&exclude=hourly,minutely&units=metric&appid=${config.openweatherKey}`
    )

  const {data} = weather
  console.log('weather data: ', data)
  return data ? {
    temperature: Math.round(data.current.temp),
    humidity: `${data.current.humidity}%`
  } : {}
}

const functionMap = {
  'getWeatherForecast': getWeatherForecast,
  'getWeatherForecastForLocation': getWeatherForecastForLocation
}

export function getFunctionCall(functionName: string) {
  const fn = functionMap[functionName]

  return fn ?? false
}
