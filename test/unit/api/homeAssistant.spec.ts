import axios from 'axios'
import {homeAssistantApi, IDeviceState} from '../../../src/api/homeAssistantApi'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('homeAssistantApi', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('setSignal & closeSignal', () => {
    it('should set and clear the abort signal', () => {
      const controller = new AbortController()
      homeAssistantApi.setSignal(controller.signal)
      homeAssistantApi.closeSignal()
      // Can't directly test signal here as it's private, but this ensures no errors
    })
  })

  describe('conversation', () => {
    it('should call axios.post with correct URL and payload', async () => {
      const postSpy = mockedAxios.post.mockResolvedValue({data: 'ok'})

      process.env.LOCAL_API_URL = 'http://localhost:3000'

      await homeAssistantApi.conversation('Turn on the lights')

      expect(postSpy).toHaveBeenCalledWith(
        'http://localhost:3000/home-assistant/conversation',
        {text: 'Turn on the lights'}
      )
    })
  })

  describe('getStates', () => {
    it('should call axios.get with correct URL', async () => {
      mockedAxios.get.mockResolvedValue({data: []})
      process.env.LOCAL_API_URL = 'http://localhost:3000'

      const result = await homeAssistantApi.getStates()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/home-assistant/states'
      )
      expect(result.data).toEqual([])
    })
  })

  describe('getLights', () => {
    const mockDevices: IDeviceState[] = [
      {
        entity_id: 'light.kitchen',
        state: 'on',
        attributes: {friendly_name: 'Kitchen Light'},
        last_updated: '2025-04-22T12:00:00Z'
      },
      {
        entity_id: 'sensor.temperature',
        state: 'off',
        attributes: {friendly_name: 'Temp Sensor'},
        last_updated: '2025-04-22T12:00:00Z'
      }
    ]

    it('should return only light devices', async () => {
      mockedAxios.get.mockResolvedValue({data: mockDevices})
      process.env.LOCAL_API_URL = 'http://localhost:3000'

      const lights = await homeAssistantApi.getLights()

      expect(lights).toHaveLength(1)
      expect(lights[0].entity_id).toBe('light.kitchen')
    })

    it('should return empty array if request fails', async () => {
      jest.spyOn(console, 'log').mockReturnValue()
      mockedAxios.get.mockRejectedValue(new Error('Network error'))
      process.env.LOCAL_API_URL = 'http://localhost:3000'

      const lights = await homeAssistantApi.getLights()

      expect(lights).toEqual([])
    })
  })
})
