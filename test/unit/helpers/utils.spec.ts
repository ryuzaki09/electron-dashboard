import {getWeatherIcon, transformWeatherData} from '../../../src/helpers/utils'
import CloudIcon from '../../../src/components/icons/weather/cloudy'
import ClearSkyIcon from '../../../src/components/icons/weather/clear-sky'
import ThunderIcon from '../../../src/components/icons/weather/thunderstorm'
import RainIcon from '../../../src/components/icons/weather/rain'
import SnowIcon from '../../../src/components/icons/weather/snow'
import FewCloudsIcon from '../../../src/components/icons/weather/few-clouds'
import MistIcon from '../../../src/components/icons/weather/mist'

describe('getWeatherIcon', () => {
  it('returns the correct icon for known weather codes', () => {
    expect(getWeatherIcon('01d')).toBe(ClearSkyIcon)
    expect(getWeatherIcon('02d')).toBe(FewCloudsIcon)
    expect(getWeatherIcon('03d')).toBe(CloudIcon)
    expect(getWeatherIcon('04d')).toBe(CloudIcon)
    expect(getWeatherIcon('09d')).toBe(RainIcon)
    expect(getWeatherIcon('10d')).toBe(RainIcon)
    expect(getWeatherIcon('11d')).toBe(ThunderIcon)
    expect(getWeatherIcon('13d')).toBe(SnowIcon)
  })

  it('returns ClearSkyIcon as fallback for unknown code', () => {
    expect(getWeatherIcon('unknown')).toBe(ClearSkyIcon)
  })
})

describe('transformWeatherData', () => {
  const mockData = {
    current: {
      dt: 1640966400, // corresponds to 2021-12-31
      temp: 14.3,
      weather: [{icon: '01d', description: 'clear sky', main: 'Clear'}]
    },
    daily: [
      {
        dt: 1641052800, // 2022-01-01
        temp: {min: 5.1, max: 15.7},
        weather: [{icon: '03d', description: 'clouds', main: 'Clouds'}]
      }
    ]
  }

  it('transforms weather data correctly', () => {
    const result = transformWeatherData(mockData as any)

    expect(result.temp).toBe(14)
    expect(result.dt).toMatch(/\w{3} \d{1,2}(st|nd|rd|th) \w{3}/) // formatted date
    expect(result.weather.icon).toBe(ClearSkyIcon)

    expect(result.daily).toHaveLength(1)
    expect(result.daily[0].temp.min).toBe(5)
    expect(result.daily[0].temp.max).toBe(16)
    expect(result.daily[0].weather.icon).toBe(CloudIcon)
    expect(result.daily[0].dt).toEqual({
      day: expect.any(String),
      month: expect.any(String),
      timestamp: expect.any(Number)
    })
  })
})
