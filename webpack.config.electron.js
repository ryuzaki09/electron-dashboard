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
    extensions: ['.ts', '.js', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // include .js files
        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  }
  // node: {
  //   __dirname: false,
  //   __filename: false
  // }
}
