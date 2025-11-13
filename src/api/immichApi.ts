import axios from 'axios'
import {config} from '../config'
import {IImmichAlbum} from './types'

const client = axios.create({
  baseURL: `${config.localApiUrl}/photos`
})

export const immichApi = {
  getAlbums: async () => {
    const {data} = await client.get('/albums')
    console.log('photo data: ', data)
    return data || []
    // const {data} = await client.get<IImmichAlbum[]>('/albums')
  },

  getAlbumInfo: async (albumId: string) => {
    const {data} = await client.get<IImmichAlbum>(`/album-info/${albumId}`)

    return data || null
  }
}
