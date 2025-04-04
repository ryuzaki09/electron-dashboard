import axios from 'axios'

export interface IDeviceState {
  entity_id: string;
  state: 'on' | 'off';
  attributes: { friendly_name: string }
  last_updated: string;
}

// Can't call HA directly because of CORS, therefore it calls the backend server which handles the request
let signal: AbortSignal | null

export const homeAssistantApi = {
  setSignal: (newSignal: AbortSignal) => {
    signal = newSignal
  },
  closeSignal: () => signal = null,
  conversation: async (text: string) => {
    const result = await axios.post('/home-assistant/conversation', {
      text
    })
    console.log('result: ', result)
  },

  getStates: async () => {
    return axios.get('/home-assistant/states')
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
