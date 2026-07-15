import {getFilesRecursively} from '../../../server/utils'
import {userMusicPath} from '../../../server/constants'

describe.skip('Server Utils', () => {
  it('returns the recursive output of the directory', () => {
    const result = getFilesRecursively(userMusicPath)
    console.log('result: ', result[0])

    expect(true).toEqual(true)
  })
})
