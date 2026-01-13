import axios from 'axios'
import {config, homeConfigPromise} from '../config'
import { transformWeatherData } from '../helpers/utils'

import type {IWeatherForecastDto} from './types'

export const weatherApi = {
  getForecast: async () => {
    const homeConfig = await homeConfigPromise
    if (!homeConfig) {
      return
    }

    const {coords} = homeConfig
    const weather = await axios.get<IWeatherForecastDto>(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${
        coords.lon
      }&exclude=hourly,minutely&units=metric&appid=${config.openweatherKey}`
    )
    const transformed = weather.data ? transformWeatherData(weather.data) : null
    console.log('transformed: ', transformed)
    return transformed
    //const result = await Promise.resolve({
    //"lat": 51.5692,
    //"lon": 0.3436,
    //"timezone": "Europe/London",
    //"timezone_offset": 0,
    //"current": {
        //"dt": 1743244483,
        //"sunrise": 1743226827,
        //"sunset": 1743272762,
        //"temp": 11.02,
        //"feels_like": 9.74,
        //"pressure": 1023,
        //"humidity": 60,
        //"dew_point": 3.56,
        //"uvi": 3.24,
        //"clouds": 13,
        //"visibility": 10000,
        //"wind_speed": 3.59,
        //"wind_deg": 287,
        //"wind_gust": 4.95,
        //"weather": [
            //{
                //"id": 801,
                //"main": "Clouds",
                //"description": "few clouds",
                //"icon": "02d"
            //}
        //]
    //},
    //"daily": [
        //{
            //"dt": 1743249600,
            //"sunrise": 1743226827,
            //"sunset": 1743272762,
            //"moonrise": 1743226620,
            //"moonset": 1743274320,
            //"moon_phase": 0,
            //"summary": "The day will start with clear sky through the late morning hours, transitioning to partly cloudy",
            //"temp": {
                //"day": 11.29,
                //"min": 2.92,
                //"max": 13.3,
                //"night": 9.95,
                //"eve": 11.65,
                //"morn": 3.36
            //},
            //"feels_like": {
                //"day": 9.96,
                //"night": 7.19,
                //"eve": 10.39,
                //"morn": 0.9
            //},
            //"pressure": 1023,
            //"humidity": 57,
            //"dew_point": 3.09,
            //"wind_speed": 6.04,
            //"wind_deg": 233,
            //"wind_gust": 13.98,
            //"weather": [
                //{
                    //"id": 801,
                    //"main": "Clouds",
                    //"description": "few clouds",
                    //"icon": "02d"
                //}
            //],
            //"clouds": 13,
            //"pop": 0,
            //"uvi": 4
        //},
        //{
            //"dt": 1743336000,
            //"sunrise": 1743313089,
            //"sunset": 1743359262,
            //"moonrise": 1743313800,
            //"moonset": 1743366360,
            //"moon_phase": 0.04,
            //"summary": "You can expect partly cloudy in the morning, with clearing in the afternoon",
            //"temp": {
                //"day": 14.11,
                //"min": 7.2,
                //"max": 14.92,
                //"night": 7.2,
                //"eve": 11.66,
                //"morn": 8.65
            //},
            //"feels_like": {
                //"day": 12.8,
                //"night": 5.32,
                //"eve": 10.53,
                //"morn": 5.92
            //},
            //"pressure": 1021,
            //"humidity": 47,
            //"dew_point": 3.06,
            //"wind_speed": 6.98,
            //"wind_deg": 311,
            //"wind_gust": 13.84,
            //"weather": [
                //{
                    //"id": 802,
                    //"main": "Clouds",
                    //"description": "scattered clouds",
                    //"icon": "03d"
                //}
            //],
            //"clouds": 49,
            //"pop": 0,
            //"uvi": 4.4
        //},
        //{
            //"dt": 1743422400,
            //"sunrise": 1743399352,
            //"sunset": 1743445762,
            //"moonrise": 1743401160,
            //"moonset": 1743458520,
            //"moon_phase": 0.08,
            //"summary": "Expect a day of partly cloudy with clear spells",
            //"temp": {
                //"day": 12.57,
                //"min": 4.46,
                //"max": 12.63,
                //"night": 6.01,
                //"eve": 8.09,
                //"morn": 4.46
            //},
            //"feels_like": {
                //"day": 11.19,
                //"night": 3.74,
                //"eve": 6.24,
                //"morn": 3.21
            //},
            //"pressure": 1029,
            //"humidity": 50,
            //"dew_point": 2.4,
            //"wind_speed": 3.43,
            //"wind_deg": 104,
            //"wind_gust": 7.42,
            //"weather": [
                //{
                    //"id": 801,
                    //"main": "Clouds",
                    //"description": "few clouds",
                    //"icon": "02d"
                //}
            //],
            //"clouds": 15,
            //"pop": 0,
            //"uvi": 4.77
        //},
        //{
            //"dt": 1743508800,
            //"sunrise": 1743485615,
            //"sunset": 1743532262,
            //"moonrise": 1743488820,
            //"moonset": 0,
            //"moon_phase": 0.12,
            //"summary": "Expect a day of partly cloudy with clear spells",
            //"temp": {
                //"day": 9.95,
                //"min": 4.76,
                //"max": 9.96,
                //"night": 7.03,
                //"eve": 8.33,
                //"morn": 4.97
            //},
            //"feels_like": {
                //"day": 6.87,
                //"night": 3.87,
                //"eve": 5.2,
                //"morn": 1.79
            //},
            //"pressure": 1025,
            //"humidity": 64,
            //"dew_point": 3.32,
            //"wind_speed": 7.03,
            //"wind_deg": 87,
            //"wind_gust": 13.87,
            //"weather": [
                //{
                    //"id": 800,
                    //"main": "Clear",
                    //"description": "clear sky",
                    //"icon": "01d"
                //}
            //],
            //"clouds": 6,
            //"pop": 0,
            //"uvi": 4.46
        //}
      //]})

    //return transformWeatherData(result)
  }
}
