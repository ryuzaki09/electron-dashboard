import {create} from 'zustand'

interface IMainStore {
  weather: any
  setWeather: (data: any) => void
}

export const mainStore = create<IMainStore>((set, get) => ({
  weather: null,
  setWeather: (weatherData) => set((state) => ({weather: weatherData}))
}))
