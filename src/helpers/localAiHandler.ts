import {
  getWeatherForecast,
  getWeatherForecastForLocation
} from '../../server/services/functionCallers'

interface IFunctionMap {
  [key: string]: {
    functionCall: (args: any) => Promise<any>
    responseHandler: (args: any) => string
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
