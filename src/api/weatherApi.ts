import axios from 'axios'
import {coords} from '../config/config'
import {config} from '../config'
import { transformWeatherData } from '../helpers/utils'

import type {IWeatherForecastDto} from './types'

export const weatherApi = {
  getForecast: async () => {
    const weather = await axios.get<IWeatherForecastDto>(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${
        coords.lon
      }&exclude=hourly,minutely&units=metric&appid=${config.openweatherKey}`
    )
    const transformed = weather.data ? transformWeatherData(weather.data) : null
    console.log('transformed: ', transformed)
    return transformed
    const result = await Promise.resolve({
      lat: 51.5692,
      lon: 0.3436,
      timezone: 'Europe/London',
      timezone_offset: 0,
      current: {
        dt: 1742478717,
        sunrise: 1742450470,
        sunset: 1742494257,
        temp: 18.92,
        feels_like: 18.25,
        pressure: 1019,
        humidity: 53,
        dew_point: 9.14,
        uvi: 2.08,
        clouds: 7,
        visibility: 10000,
        wind_speed: 0.45,
        wind_deg: 64,
        wind_gust: 2.68,
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }
        ]
      },
      daily: [
        {
          dt: 1742472000,
          sunrise: 1742450470,
          sunset: 1742494257,
          moonrise: 1742430600,
          moonset: 1742456640,
          moon_phase: 0.69,
          summary: 'Expect a day of partly cloudy with clear spells',
          temp: {
            day: 18.01,
            min: 7.57,
            max: 18.92,
            night: 10.06,
            eve: 14.15,
            morn: 7.57
          },
          feels_like: {
            day: 17.3,
            night: 9.29,
            eve: 13.42,
            morn: 7.57
          },
          pressure: 1019,
          humidity: 55,
          dew_point: 8.84,
          wind_speed: 3.54,
          wind_deg: 136,
          wind_gust: 8.25,
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'clear sky',
              icon: '01d'
            }
          ],
          clouds: 9,
          pop: 0,
          uvi: 3.1
        },
        {
          dt: 1742558400,
          sunrise: 1742536732,
          sunset: 1742580758,
          moonrise: 1742521320,
          moonset: 1742545020,
          moon_phase: 0.72,
          summary:
            'You can expect partly cloudy in the morning, with rain in the afternoon',
          temp: {
            day: 12.72,
            min: 8.22,
            max: 15.38,
            night: 12.09,
            eve: 12.55,
            morn: 8.22
          },
          feels_like: {
            day: 11.93,
            night: 11.86,
            eve: 11.95,
            morn: 5.71
          },
          pressure: 1008,
          humidity: 72,
          dew_point: 7.8,
          wind_speed: 7.17,
          wind_deg: 158,
          wind_gust: 14.51,
          weather: [
            {
              id: 501,
              main: 'Rain',
              description: 'moderate rain',
              icon: '10d'
            }
          ],
          clouds: 100,
          pop: 1,
          rain: 2.34,
          uvi: 2.54
        },
        {
          dt: 1742644800,
          sunrise: 1742622994,
          sunset: 1742667259,
          moonrise: 1742611440,
          moonset: 1742634360,
          moon_phase: 0.75,
          summary: 'Expect a day of partly cloudy with rain',
          temp: {
            day: 15,
            min: 8.93,
            max: 15.31,
            night: 8.93,
            eve: 11.64,
            morn: 10.33
          },
          feels_like: {
            day: 14.25,
            night: 8.01,
            eve: 11.05,
            morn: 9.9
          },
          pressure: 1002,
          humidity: 65,
          dew_point: 8.34,
          wind_speed: 7,
          wind_deg: 151,
          wind_gust: 15.91,
          weather: [
            {
              id: 501,
              main: 'Rain',
              description: 'moderate rain',
              icon: '10d'
            }
          ],
          clouds: 100,
          pop: 1,
          rain: 3.21,
          uvi: 0.9
        },
        {
          dt: 1742731200,
          sunrise: 1742709255,
          sunset: 1742753760,
          moonrise: 1742700840,
          moonset: 1742724600,
          moon_phase: 0.78,
          summary: 'Expect a day of partly cloudy with rain',
          temp: {
            day: 12.22,
            min: 8.09,
            max: 13.93,
            night: 9.72,
            eve: 10.18,
            morn: 8.62
          },
          feels_like: {
            day: 11.61,
            night: 9.22,
            eve: 9.45,
            morn: 6.85
          },
          pressure: 1005,
          humidity: 81,
          dew_point: 9.12,
          wind_speed: 4.31,
          wind_deg: 93,
          wind_gust: 8.36,
          weather: [
            {
              id: 500,
              main: 'Rain',
              description: 'light rain',
              icon: '10d'
            }
          ],
          clouds: 99,
          pop: 0.81,
          rain: 0.44,
          uvi: 1.68
        },
        {
          dt: 1742817600,
          sunrise: 1742795517,
          sunset: 1742840260,
          moonrise: 1742789400,
          moonset: 1742815680,
          moon_phase: 0.82,
          summary: 'Expect a day of partly cloudy with rain',
          temp: {
            day: 11.77,
            min: 5.11,
            max: 11.77,
            night: 5.11,
            eve: 9.12,
            morn: 7.75
          },
          feels_like: {
            day: 10.83,
            night: 2.77,
            eve: 6.58,
            morn: 5.8
          },
          pressure: 1014,
          humidity: 70,
          dew_point: 6.41,
          wind_speed: 4.78,
          wind_deg: 10,
          wind_gust: 8.28,
          weather: [
            {
              id: 500,
              main: 'Rain',
              description: 'light rain',
              icon: '10d'
            }
          ],
          clouds: 96,
          pop: 0.31,
          rain: 0.57,
          uvi: 3.74
        }
      ]
    })

    return transformWeatherData(result)
  }
}
