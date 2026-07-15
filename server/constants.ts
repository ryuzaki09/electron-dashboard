import path from 'path'
import os from 'os'
import {config} from '../src/config'

export const baseMediaPath = path.join(os.homedir(), 'media')
export const userVideoPath = path.join(os.homedir(), 'media/video')
export const userMusicFirstFolder = 'Japanese'
export const userMusicPath = path.join(
  os.homedir(),
  'media/music'
  // userMusicFirstFolder
)
console.log('🛠️ [DEBUG] videoPath =', userVideoPath)
console.log('🛠️ [DEBUG] musicPath =', userMusicPath)
console.log('CONFIG DEV: ', config.isDevelopment)
