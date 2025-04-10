import path from 'path'
import os from 'os'

export const baseMediaPath = path.join(os.homedir(), 'media')
export const userVideoPath = path.join(os.homedir(), 'media/video')
export const userMusicFirstFolder = 'Japanese'
export const userMusicPath = path.join(
  os.homedir(),
  'media/music',
  userMusicFirstFolder
)
console.log('🛠️ [DEBUG] videoPath =', userVideoPath)
console.log('🛠️ [DEBUG] musicPath =', userMusicPath)
