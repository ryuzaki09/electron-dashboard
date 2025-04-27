import axios from 'axios'
import {config} from '../config'

const client = axios.create({
  baseURL: config.useExternalBackendApi
    ? config.externalApiUrl
    : config.localApiUrl
})

export const api = {
  fetchMusic: async () => {
    const {data} = await client.get(`/musicMedia`)

    return data
  },

  fetchVideos: async () => {
    const {data} = await client.get(`/videos`)
    // const {data} = await axios.get(`http://localhost:8081/videos`)

    console.log('video data: ', data)
    return data.length > 0 ? data : []
  }
}
