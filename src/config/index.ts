export const config = {
  useLocalAi: false,
  useWakeWord: false,
  useExternalBackendApi: process.env.USE_EXTERNAL_BACKEND === 'true',
  isDevelopment: process.env.NODE_ENV === 'development',
  homeAssistantIP: process.env.HA_HOST,
  homeAssistantToken: process.env.HA_LONG_LIVE_TOKEN,
  localAiHost: process.env.OPENWEBUI_HOST,
  localAiKey: process.env.OPENWEBUI_KEY,
  externalApiUrl: process.env.BACKEND_API_URL,
  localApiUrl: process.env.LOCAL_API_URL,
  openweatherKey: process.env.OPENWEATHER_KEY,
  openrouteApiKey: process.env.OPENROUTE_KEY,
  openWakeWordServer: process.env.OPEN_WAKEWORD_IP_PORT,
  picovoiceKey: process.env.PICOVOICE_KEY,
  plexUrl: process.env.PLEX_URL,
  sttHost: process.env.STT_HOST,
  ttsHost: process.env.TTS_HOST,
  whisperHost: process.env.STT_HOST,
  immichUrl: process.env.IMMICH_URL,
  immichKey: process.env.IMMICH_KEY
}

export const musicRootFoldersToScan = [
  'japanese',
  'english',
  'chinese',
  'korean'
]

export const homeConfigPromise = (async () => {
  console.log('config DEV: ', config.isDevelopment)
  try {
    // if (config.isDevelopment) {
    //   const mod = await import('./homeConfig.json')
    //   return mod.default || mod
    // } else {
    const mod = await import('./sample.homeConfig.json')
    return mod.default || mod
    //}
  } catch (e) {
    console.log('Error importing homeConfig:', e)
    return undefined
  }
})()
