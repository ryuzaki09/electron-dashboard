const path = require('path')

module.exports = {
  mode: 'production',
  target: 'electron-main',
  entry: './index.js',
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      }
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  }
}
