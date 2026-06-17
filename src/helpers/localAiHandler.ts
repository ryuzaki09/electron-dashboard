import {
  getWeatherForecast,
  getWeatherForecastForLocation
} from '../../server/services/functionCallers'
import {searchMusic} from '../tools/music'

interface IFunctionMap {
  [key: string]: {
    functionCall: (args: any) => Promise<any>
    responseHandler: (args: any) => string | {type: string; media?: any}
  }
}
const functionCallMap: IFunctionMap = {
  get_weather_forecast: {
    functionCall: getWeatherForecast,
    responseHandler: handleWeatherResponse
  },
  get_weather: {
    functionCall: getWeatherForecastForLocation,
    responseHandler: handleWeatherForLocationResponse
  },
  play_music: {
    functionCall: searchMusic,
    responseHandler: handlePlaybackResponse
  }
}

export const getFunctionCall = (functionName: string) => {
  return functionCallMap[functionName]
}

export function handleWeatherResponse(data: {
  parameters: {date: string}
  high_temperature: number
  low_temperature: number
}) {
  return `The weather for ${data.parameters.date} has a high temperature of ${
    data.high_temperature
  } degrees celcius and a low temperature of ${
    data.low_temperature
  } degrees celcius.`
}

function handleWeatherForLocationResponse(props: any) {
  return `The weather in ${props.parameters.location} is ${
    props.temperature
  } degrees celcius.`
}

interface IHandlePlaybackResponse {
  data: Array<{
    itemId: string
    key: string
    media: Array<{
      Part: Array<{
        file: string
        duration: number
        key: string
        size: number
      }>
    }>
    summary: string
    title: string
  }>
}
function handlePlaybackResponse(props: any) {
  console.log('playback response props: ', props)
  const typeProps = props as IHandlePlaybackResponse
  return typeProps && typeProps
    ? {
        type: 'track',
        media: typeProps.data
      }
    : ''
}
