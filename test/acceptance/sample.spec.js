import assert from 'assert'
import {Application} from 'spectron'
import electronPath from 'electron'
import path from 'path'

const app = new Application({
  path: electronPath,
  args: [path.resolve(__dirname, '../..')]
})

before(async () => {
  await app.start()
})

after(async () => {
  await app.stop()
})

describe('Sample test', () => {
  it('opens the app successfully', () => {
    assert.strict.equal(true, true)
  })
})
