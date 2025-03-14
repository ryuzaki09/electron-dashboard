const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
// import path from 'path'
// import webpack from 'webpack'
// import htmlWebpackPlugin from 'html-webpack-plugin'
// import {fileURLToPath} from 'url'

const PORT = process.env.PORT || 3000

//const filename = fileURLToPath(import.meta.url)
//const dirname = path.dirname(filename)

module.exports = {
  mode: 'development',
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
    // publicPath: `http://localhost:${PORT}`,
    publicPath: '/'
    // libraryTarget: 'commonjs2'
  },
  // target: 'electron-renderer',
  target: 'web',
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
    })
    // SECOND SCREEN
    //new htmlWebpackPlugin({
    //filename: 'second-screen.html',
    //template: 'main/windows/second-screen.html',
    //chunks: ['secondScreen']
    //})
  ],
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
        use: [
          miniCssExtractPlugin.loader,
          'css-loader'
        ],
        include: [
          path.resolve(__dirname, 'node_modules/@ryusenpai/shared-components'), // 👈 Ensure this is included!
          path.resolve(__dirname, 'node_modules/ui-library') // 👈 Ensure this is included!
        ]
      },
      {
        test: /\.scss$/,
        use: [miniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'node_modules/@ryusenpai/shared-components'), // 👈 Ensure this is included!
          path.resolve(__dirname, 'node_modules/ui-library') // 👈 Ensure this is included!
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
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  }
}
