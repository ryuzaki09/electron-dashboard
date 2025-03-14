import {merge} from 'webpack-merge'
import path from 'path'
import common from './webpack.config.common'

export default merge(common, {
  entry: ['./index.js'],
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'build'),
    filename: './index.js'
  },
  node: {
    __dirname: false,
    __filename: false
  }
})
