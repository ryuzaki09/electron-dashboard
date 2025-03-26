export const config = {
  homeAssistantIP: process.env.HA_HOST,
  homeAssistantToken: process.env.HA_LONG_LIVE_TOKEN,
  openweatherKey: process.env.OPENWEATHER_KEY,
  useWakeWord: false,
  picovoiceKey: process.env.PICOVOICE_KEY,
  useLocalAi: true,
  localAiHost: process.env.OPENWEBUI_HOST,
  localAiKey: process.env.OPENWEBUI_KEY,
  whisperHost: process.env.WHISPER_HOST
}
