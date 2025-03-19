// import {create} from 'zustand'
// const audio = new Audio()
//
// export const musicStore = create((set, get) => ({
//   player: audio,
//   playStatus: 'stopped',
//   play: async () => {
//     const {player} = get()
//
//     if (player.src) {
//       player.play()
//
//       set({playStatus: 'playing'})
//     }
//   },
//   setStreamUrl: (url: string) => {
//     const {player} = get()
//     player.src = url
//   },
//   pause: () => {
//     const {player} = get()
//     player.pause()
//     set({playStatus: 'paused'})
//   },
//   resume: () => {
//     const {player} = get()
//     player.play()
//     set({playStatus: 'playing'})
//   },
//   stop: () => {
//     const {player} = get()
//     player.play()
//     set({playStatus: 'stopped'})
//   }
// }))
//import {applyMiddleware, createStore} from 'redux'
//import {createLogger} from 'redux-logger'

//import {allReducers} from './reducers'

//const logger = createLogger({collapsed: true})

//export const store = createStore(allReducers, applyMiddleware(logger))
