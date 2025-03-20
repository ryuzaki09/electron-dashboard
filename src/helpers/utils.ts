import CloudIcon from '../components/icons/weather/cloudy'
import ClearSkyIcon from '../components/icons/weather/clear-sky'
import ThunderIcon from '../components/icons/weather/thunderstorm'
import RainIcon from '../components/icons/weather/rain'
import SnowIcon from '../components/icons/weather/snow'
import FewCloudsIcon from '../components/icons/weather/few-clouds'
import MistIcon from '../components/icons/weather/mist'

const virtualPath = '/music'
const FOLDER_LEVEL_SCAN = 2

interface IMediaFile {
  name: string
  path: string
  type: 'file' | 'folder'
  basePath: string
}

export function transformMusicMedia(data: IMediaFile[]) {
  let mediaItems: any = []
  const items = data

  // get folders only
  // const folders = items.filter((item) => item.type === 'folder')
  const files = items.filter((item) => item.type === 'file')

  mediaItems = files.reduce((acc, file) => {
    // path parts example - ['chinese', 'Andy Lau']
    const pathParts = file.path
      .replace(`${file.basePath}${virtualPath}/`, '')
      .split('/')

    if (pathParts.length === FOLDER_LEVEL_SCAN) {
      if (acc[pathParts[0]] && acc[pathParts[0]].files) {
        acc[pathParts[0]].files.push(file)
      } else {
        acc[pathParts[0]] = {
          files: [file]
        }
      }
    }

    if (pathParts.length > FOLDER_LEVEL_SCAN) {
      if (acc[pathParts[0]] && acc[pathParts[0]][pathParts[1]]) {
        acc[pathParts[0]][pathParts[1]].files.push(file)
      } else {
        acc[pathParts[0]][pathParts[1]] = {
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
