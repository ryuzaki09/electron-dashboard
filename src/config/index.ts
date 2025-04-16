export const config = {
  useLocalAi: false,
  useWakeWord: false,
  isDevelopment: process.env.NODE_ENV === 'development',
  homeAssistantIP: process.env.HA_HOST,
  homeAssistantToken: process.env.HA_LONG_LIVE_TOKEN,
  localAiHost: process.env.OPENWEBUI_HOST,
  localAiKey: process.env.OPENWEBUI_KEY,
  localApiUrl: process.env.BACKEND_API_URL,
  openweatherKey: process.env.OPENWEATHER_KEY,
  openrouteApiKey: process.env.OPENROUTE_KEY,
  picovoiceKey: process.env.PICOVOICE_KEY,
  plexUrl: process.env.PLEX_URL,
  whisperHost: process.env.WHISPER_HOST
}

export const musicRootFoldersToScan = [
  'japanese',
  'english',
  'chinese',
  'korean'
]
