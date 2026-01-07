import {create} from 'zustand'
import {immichApi} from '../api/immichApi'
import {config} from '../config'

import type {IImmichAlbum} from '../api/types'

interface IMainStore {
  theme: string
  setTheme: (theme: string) => void
  weather: any
  setWeather: (data: any) => void
  voiceAssistantIsListening: boolean
  setVoiceAssistantIsListening: (isListening: boolean) => void
  photoAlbums: Array<IImmichAlbum>
  selectedPhotoAlbums: Array<IImmichAlbum>
  setSelectedPhotoAlbums: (photoAlbums: Array<any>) => void
  isLoadingPhotoAlbums: boolean
  fetchPhotoAlbums: () => Promise<void>
}

export const mainStore = create<IMainStore>((set, get) => ({
  theme: 'default',
  setTheme: (theme: string) => set((state) => ({theme})),
  weather: null,
  setWeather: (weatherData) => set(() => ({weather: weatherData})),
  voiceAssistantIsListening: false,
  setVoiceAssistantIsListening: (isListening: boolean) =>
    set(() => ({voiceAssistantIsListening: isListening})),
  photoAlbums: [],
  isLoadingPhotoAlbums: false,
  fetchPhotoAlbums: async () => {
    if (!config.immichUrl || !config.immichKey) {
      return
    }

    if (get().photoAlbums.length > 0) {
      return
    }

    set({isLoadingPhotoAlbums: true})
    try {
      const albums = await immichApi.getAlbums()
      set({photoAlbums: albums})
    } catch (e) {
      console.error('Failed to fetch albums: ', e)
    } finally {
      set({isLoadingPhotoAlbums: false})
    }
  },
  selectedPhotoAlbums: [],
  setSelectedPhotoAlbums: (photoAlbums: any[]) => {
    set({selectedPhotoAlbums: photoAlbums})
  }
}))
