//import version from 'electron/package.json' assert { type: 'json' }
const {version} = require('electron/package')

//export default function(api) {
module.exports = (api) => {
  api.cache(true)

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          targets: {
            electron: version
          }
        }
      ],
      '@babel/preset-react'
    ]
  }
}
