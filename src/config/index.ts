export const config = {
  useLocalAi: false,
  useWakeWord: false,
  homeAssistantIP: process.env.HA_HOST,
  homeAssistantToken: process.env.HA_LONG_LIVE_TOKEN,
  localAiHost: process.env.OPENWEBUI_HOST,
  localAiKey: process.env.OPENWEBUI_KEY,
  openweatherKey: process.env.OPENWEATHER_KEY,
  openrouteApiKey: process.env.OPENROUTE_KEY,
  picovoiceKey: process.env.PICOVOICE_KEY,
  whisperHost: process.env.WHISPER_HOST
}
