import axios from 'axios'
// import 'dotenv/config'
import {config} from '../../src/config'
import {coords} from '../../src/config/config'
import {timestampToDayOfWeek, timestampToUKdate, formatCorrectDate} from '../../src/helpers/time'

import type {IWeatherForecastDto} from '../../src/api/types'

interface IGetWeatherProps {
  longitude: number;
  latitude: number;
  location?: string
}

export async function getWeatherForecast({date}: {date: string}) {
  const weather = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${
        coords.lon
      }&exclude=hourly,minutely&units=metric&appid=${config.openweatherKey}`
    )

  const {data} = weather
  // console.log('current weather data: ', data)
  if (!data) {
    return null
  }

  const formattedDate = formatCorrectDate(date)

  const dailyData = data.daily
  const foundDailyData = dailyData.find(
    (d: IWeatherForecastDto['daily'][number]) =>
      timestampToUKdate(d.dt) === formattedDate || timestampToDayOfWeek(d.dt).toLowerCase() === formattedDate.toLowerCase()
  )

  console.log('found daily data: ', foundDailyData)

  if (foundDailyData) {
    return {
      high_temperature: Math.round(foundDailyData.temp.max),
      low_temperature: Math.round(foundDailyData.temp.min),
      summary: foundDailyData.summary
    } 
  }

  return {}
}

export async function getWeatherForecastForLocation({longitude, latitude, location}: IGetWeatherProps) {
  let coordinates = {
    lon: longitude,
    lat: latitude
  }
  if (location) {
    const {data} = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${config.openweatherKey}`)
    console.log('location result: ', data)
    // const locationCoords = await weatherApi.getCoordinatesOfLocation(location)
    coordinates = {
      lon: data[0].lon,
      lat: data[0].lat
    }
  }
  const weather = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${
        coordinates.lon
      }&exclude=hourly,minutely&units=metric&appid=${config.openweatherKey}`
    )

  const {data} = weather
  // console.log('weather data: ', data)
  return data ? {
    temperature: Math.round(data.current.temp),
    humidity: `${data.current.humidity}%`
  } : {}
}

interface IFunctionMapper {
  [key: string]: {
    functionCaller: (args: any) => Promise<any>
    retainMessages: boolean
  }
}

const functionMap: IFunctionMapper = {
  getWeatherForecast: {
    functionCaller: getWeatherForecast,
    retainMessages: false
  },
  getWeatherForecastForLocation: {
    functionCaller: getWeatherForecastForLocation,
    retainMessages: false
  }
}

export function getFunctionCall(functionName: string) {
  const fn = functionMap[functionName]

  return fn ?? false
}
