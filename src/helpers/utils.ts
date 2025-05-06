import {format} from 'date-fns'
import CloudIcon from '../components/icons/weather/cloudy'
import ClearSkyIcon from '../components/icons/weather/clear-sky'
import ThunderIcon from '../components/icons/weather/thunderstorm'
import RainIcon from '../components/icons/weather/rain'
import SnowIcon from '../components/icons/weather/snow'
import FewCloudsIcon from '../components/icons/weather/few-clouds'
import MistIcon from '../components/icons/weather/mist'

import type {IWeatherForecastDto} from '../api/types'

const ROOT_FOLDER_LEVEL = 2

interface IMediaFile {
  name: string
  path: string
  type: 'file' | 'folder'
  basePath: string
}

interface ITransformedMedia {
  root: {
    [key: string]: {
      [key: string]: {
        files: IMediaFile[]
      } & { files: IMediaFile[] }
    } & { files: IMediaFile[]}
  }
}


export function transformMusicMedia(data: IMediaFile[]): ITransformedMedia {
  let mediaItems: any = []
  const items = data

  // get folders only
  // const folders = items.filter((item) => item.type === 'folder')
  const files = items.filter((item) => item.type === 'file')

  mediaItems = files.reduce((acc, file) => {
    // path parts example - ['', 'Andy Lau - I love you.mp3']
    // path parts can represent how deep the folder level is
    const pathParts = file.path
      // .replace(`${file.basePath}${virtualPath}/`, '')
      .replace(`${file.basePath}`, '')
      .split('/')

    const rootFolder = pathParts[0] === ''
      ? 'root'
      : pathParts[0]

    const firstLevelFolder = pathParts[1]
    const secondLevelFolder = pathParts[2]

    // if path parts = 2 as example above, that means the tracks is under the root folder
    if (pathParts.length === ROOT_FOLDER_LEVEL) {
      if (acc[rootFolder] && acc[rootFolder].files) {
        acc[rootFolder].files.push(file)
      } else {
        acc[rootFolder] = {
          files: [file]
        }
      }
    }

    // if path parts length = 3 ['', 'english', 'Billie Jean.mp3'], pathParts[1] is the first level folder
    if (pathParts.length === ROOT_FOLDER_LEVEL + 1) {
      if (acc[rootFolder] && acc[rootFolder][firstLevelFolder] && acc[rootFolder][firstLevelFolder].files) {
        acc[rootFolder][firstLevelFolder].files.push(file)
      } else {
        acc[rootFolder][firstLevelFolder] = {
          files: [file]
        }
      }
    }

    // if path parts is greater than 3 then there is another folder under the first level folder.
    // catches all tracks and adds it under second level folder.
    if (pathParts.length > ROOT_FOLDER_LEVEL + 1) {
      if (
        acc[rootFolder] &&
        acc[rootFolder][firstLevelFolder] &&
        acc[rootFolder][firstLevelFolder][secondLevelFolder] &&
        acc[rootFolder][firstLevelFolder][secondLevelFolder].files 
      ) {
        acc[rootFolder][firstLevelFolder][secondLevelFolder].files.push(file)
      } else if (
        acc[rootFolder] &&
        acc[rootFolder][firstLevelFolder] &&
        !acc[rootFolder][firstLevelFolder][secondLevelFolder]
      ) {
        acc[rootFolder][firstLevelFolder] = {
          ...acc[rootFolder][firstLevelFolder],
          [secondLevelFolder]: {
            files: [file]
          }
        }

      } else if (
        acc[rootFolder] &&
        !acc[rootFolder][firstLevelFolder]
      ) {

        acc[rootFolder] = {
          ...acc[rootFolder],
          [firstLevelFolder]: {
            [secondLevelFolder]: {
              files: [file]
            }
          }
        }

      } else {
        acc[rootFolder][firstLevelFolder][secondLevelFolder] = {
          files: [file]
        }
      }
    }

    return acc
  }, {})

  return mediaItems
}

const weatherMap = {
  '01d': ClearSkyIcon,
  '02d': FewCloudsIcon,
  '03d': CloudIcon,
  '04d': CloudIcon,
  '09d': RainIcon,
  '10d': RainIcon,
  '11d': ThunderIcon,
  '13d': SnowIcon
}
export function getWeatherIcon(iconName: string) {
  const WeatherIcon = weatherMap[iconName]

  return WeatherIcon ?? ClearSkyIcon
}

export function transformWeatherData(data: IWeatherForecastDto) {
  const {current, daily} = data

  return {
    ...current,
    dt: format(new Date(current.dt * 1000), 'iii do LLL'),
    weather: {
      ...current.weather[0],
      icon: getWeatherIcon(current.weather[0].icon)
    },
    temp: Math.round(current.temp),
    daily: daily.map((d) => ({
      ...d,
      dt: {
        day: format(new Date(d.dt * 1000), 'iii do'),
        month: format(new Date(d.dt * 1000), 'LLL'),
        timestamp: d.dt
      },
      weather: {
        ...d.weather[0],
        icon: getWeatherIcon(d.weather[0].icon)
      },
      temp: {
        ...d.temp,
        min: Math.round(d.temp.min),
        max: Math.round(d.temp.max)
      }
    }))
  }
}
