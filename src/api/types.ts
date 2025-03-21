interface IWeatherDto {
  dt: number
  sunrise: number
  sunset: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
}

export interface IWeatherForecastDto {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: IWeatherDto
  daily: Array<
    Omit<IWeatherDto, 'temp' | 'feels_like' | 'visibility'> & {
      moonrise: number
      moonset: number
      moon_phase: number
      summary: string
      temp: {
        day: number
        min: number
        max: number
        night: number
        eve: number
        morn: number
      }
      feels_like: {
        day: number
        night: number
        eve: number
        morn: number
      }
      pop: number
    }
  >
}
