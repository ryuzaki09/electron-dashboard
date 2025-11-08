import axios from 'axios'
import {config} from '../config'
import {IImmichAlbum, IImmichAsset} from './types'

const client = axios.create({
  baseURL: `${config.immichUrl}/api`,
  headers: {
    'x-api-key': config.immichKey
  }
})

export const immichApi = {
  getAlbums: async () => {
    const {data} = await client.get<IImmichAlbum[]>('/albums')
    return data ? transformAlbums(data) : []
  },

  getAlbumInfo: async (albumId: string) => {
    const {data} = await client.get<IImmichAlbum>(`/albums/${albumId}`)
    return data ? transformAlbum(data) : null
  }
}

const transformAlbums = (data: IImmichAlbum[]) => {
  return data.map((album) => ({
    ...album,
    thumbnailUrl: `${config.immichUrl}/api/asset/thumbnail/${
      album.albumThumbnailAssetId
    }`
  }))
}

const transformAlbum = (data: IImmichAlbum) => {
  return {
    ...data,
    assets: data.assets.map((asset: IImmichAsset) => ({
      ...asset,
      thumbnailUrl: `${config.immichUrl}/api/asset/thumbnail/${asset.id}`,
      url: `${config.immichUrl}/api/asset/file/${asset.id}`
    }))
  }
}

