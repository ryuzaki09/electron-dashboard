import axios from 'axios'
import {config} from '../config'

const client = axios.create({
  baseURL: config.useExternalBackendApi
    ? config.externalApiUrl
    : config.localApiUrl
})

export const api = {
  fetchMusic: async () => {
    const {data} = await client.get(`/media/music`)

    return data
  },

  fetchVideos: async () => {
    const {data} = await client.get(`/media/videos`)
    // const {data} = await axios.get(`http://localhost:8081/media/videos`)

    console.log('video data: ', data)
    return data.length > 0 ? data : []
  }
}
