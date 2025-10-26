const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
require('dotenv').config()

const PORT = process.env.PORT || 3000

module.exports = {
  entry: {
    mainScreen: [
      `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
      './src/index.tsx'
    ]
    //secondScreen: [
    //`webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
    //'./src/second-screen/index.tsx'
    //]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  // target: 'electron-renderer',
  target: 'web',

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
      },
      {
        test: /\.css$/,
        use: [
          miniCssExtractPlugin.loader,
          {loader: 'css-loader', options: {modules: true}}
        ],
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, 'css-loader'],
        include: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, '@ryusenpai/shared-components'), // 👈 Ensure this is included!
          path.resolve(__dirname, 'node_modules/@ryusenpai/shared-components') // 👈 Ensure this is included!
        ]
      },
      {
        test: /\.scss$/,
        use: [miniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'node_modules/@ryusenpai/shared-components') // 👈 Ensure this is included!
        ]
      },
      {
        test: /\.(jpg|png|jpeg|svg)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/images',
            esModule: false
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)$/,
        type: 'asset/resource', // Replaces file-loader
        generator: {
          filename: 'assets/fonts/[name][ext]' // Saves files to dist/assets/fonts/
        }
      }
    ]
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
      'process.env.BACKEND_API_URL': JSON.stringify(
        process.env.BACKEND_API_URL || ''
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
      'process.env.OPEN_WAKEWORD_IP_PORT': JSON.stringify(
        process.env.OPEN_WAKEWORD_IP_PORT || ''
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
      'process.env.PLEX_URL': JSON.stringify(process.env.PLEX_URL || ''),
      'process.env.ENV': JSON.stringify(process.env.ENV || ''),
      'process.env.N8N_WEBCHAT': JSON.stringify(process.env.N8N_WEBCHAT || ''),
      'process.env.USE_EXTERNAL_BACKEND': JSON.stringify(
        process.env.USE_EXTERNAL_BACKEND || ''
      )
    })
    // SECOND SCREEN
    //new htmlWebpackPlugin({
    //filename: 'second-screen.html',
    //template: 'main/windows/second-screen.html',
    //chunks: ['secondScreen']
    //})
  ]
}
