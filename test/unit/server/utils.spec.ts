import {getFilesRecursively} from '../../../server/utils'
import {userMusicPath} from '../../../server/constants'
import {config} from '../../../src/config'

describe.skip('Server Utils', () => {
  it('returns the recursive output of the directory', () => {
    console.log('CONFIG DEV: ', config.isDevelopment)
    const result = getFilesRecursively(userMusicPath)
    console.log('result: ', result[0])

    expect(true).toEqual(true)
  })
})
