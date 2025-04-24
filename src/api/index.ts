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

    return data.data.length > 0 ? data.data : []
  }
}
