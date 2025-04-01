import axios from 'axios'

export interface IDeviceState {
  entity_id: string;
  state: 'on' | 'off';
  attributes: { friendly_name: string }
  last_updated: string;
}

let signal: AbortSignal | null

export const homeAssistantApi = {
  setSignal: (newSignal: AbortSignal) => {
    signal = newSignal
  },
  closeSignal: () => signal = null,
  conversation: async (text: string) => {
    const result = await axios.post(
    `http://${process.env.HA_HOST}:8123/api/conversation/process`,
      { text, language: 'en' },
      {
        headers: {
          Authorization: `Bearer ${process.env.HA_LONG_LIVE_TOKEN}`
        }
      }
    )
    console.log('result: ', result)
  },

  getStates: async () => {
    return axios.get(
      `http://${process.env.HA_HOST}:8123/api/states`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HA_LONG_LIVE_TOKEN}`
        },
        ...(signal && {signal})
      }
    )
  },

  getLights: async (): Promise<IDeviceState[]> => {
    try {
      const result = await homeAssistantApi.getStates()
      const lights = result?.data.filter((d) => d.entity_id.startsWith('light')) || []
      console.log('result: ', lights)

      return lights
    } catch (e) {
      console.log('Unable to getLights: ', e)
      return []
    }
  }
}
