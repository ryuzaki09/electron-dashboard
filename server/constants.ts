import path from 'path'

const baseDir = path.resolve(__dirname, '..')
console.log('🛠️ [DEBUG] baseDir =', baseDir)

export const mediaPath = path.join(baseDir, 'media')
export const musicPath = path.join(baseDir, 'music', 'Japanese')
console.log('🛠️ [DEBUG] mediaPath =', mediaPath)
console.log('🛠️ [DEBUG] musicPath =', musicPath)
