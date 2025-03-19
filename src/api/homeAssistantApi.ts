import axios from 'axios'

export interface IDeviceState {
  entity_id: string;
  state: 'on' | 'off';
  attributes: { friendly_name: string }
  last_updated: string;
}

export const homeAssistantApi = {
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
    const result = await homeAssistantApi.getStates()
    const lights = result?.data.filter((d) => d.entity_id.startsWith('light') || d.entity_id.startsWith('switch')) || []
    console.log('result: ', lights)

    return lights
  }
}
