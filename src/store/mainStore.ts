import {create} from 'zustand'

interface IMainStore {
  theme: string
  setTheme: (theme: string) => void
  weather: any
  setWeather: (data: any) => void
  voiceAssistantIsListening: boolean
  setVoiceAssistantIsListening: (isListening: boolean) => void
}

export const mainStore = create<IMainStore>((set, get) => ({
  theme: 'default',
  setTheme: (theme: string) => set((state) => ({theme})),
  weather: null,
  setWeather: (weatherData) => set((state) => ({weather: weatherData})),
  voiceAssistantIsListening: false,
  setVoiceAssistantIsListening: (isListening: boolean) =>
    set((state) => ({voiceAssistantIsListening: isListening}))
}))
