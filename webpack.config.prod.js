const path = require('path')
const webpack = require('webpack')
const {merge} = require('webpack-merge')
const common = require('./webpack.config.common.js')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
require('dotenv').config()

module.exports = merge(common, {
  mode: 'production',
  entry: {mainScreen: './src/index.tsx'},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: './'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlWebpackPlugin({
      filename: 'main-screen.html',
      template: 'main/windows/index.html',
      chunks: ['mainScreen']
    }),
    new miniCssExtractPlugin({
      filename: '[name].css' // this creates a separate css file
    }),
    new webpack.DefinePlugin({
      'process.env.HA_HOST': JSON.stringify(process.env.HA_HOST || ''),
      'process.env.HA_LONG_LIVE_TOKEN': JSON.stringify(
        process.env.HA_LONG_LIVE_TOKEN || ''
      ),
      'process.env.OPENWEATHER_KEY': JSON.stringify(
        process.env.OPENWEATHER_KEY || ''
      ),
      'process.env.LOCAL_API_URL': JSON.stringify(
        process.env.LOCAL_API_URL || ''
      ),
      'process.env.PICOVOICE_KEY': JSON.stringify(
        process.env.PICOVOICE_KEY || ''
      ),
      'process.env.OPENWEBUI_KEY': JSON.stringify(
        process.env.OPENWEBUI_KEY || ''
      ),
      'process.env.OPENWEBUI_HOST': JSON.stringify(
        process.env.OPENWEBUI_HOST || ''
      ),
      'process.env.WHISPER_HOST': JSON.stringify(
        process.env.WHISPER_HOST || ''
      ),
      'process.env.OPENAI_KEY': JSON.stringify(process.env.OPENAI_KEY || ''),
      'process.env.OPENROUTE_KEY': JSON.stringify(
        process.env.OPENROUTE_KEY || ''
      ),
      'process.env.USE_WAKEWORD': JSON.stringify(
        process.env.USE_WAKEWORD || ''
      ),
      'process.env.ENV': JSON.stringify(process.env.ENV || '')
    })
  ]
})
