import axios from 'axios'
import {config} from '../config'

export interface IPlaylistItem {
  addedAt: number
  duration: number
  guid: string
  icon: string
  key: string
  playlistType: string
  ratingKey: string
  summary: string
  title: string
  type: string
}

export type TPlaylistViewDto = Omit<IPlaylistItem, 'addedAt' | 'duration'>

export interface IMediaItem {
  Image: Array<{alt: string; type: 'coverPoster'; url: string}>
  Media: Array<{
    Part: Array<{
      container: string
      duration: number
      file: string
      id: number
      key: string
      size: number
    }>
  }>
  originalTitle: string
  key: string
  ratingKey: string
  title: string
  summary: string
  type: 'track'
}

const client = axios.create({
  baseURL: config.externalApiUrl
})

export const plexApi = {
  getPlaylists: async () => {
    const result = await client.get('/plex/playlists')
    console.log('plex result: ', result)
    return result.data ? transformPlexPlaylists(result.data) : []
  },

  getPlaylistItems: async (ratingKey: IPlaylistItem['ratingKey']) => {
    const {data} = await client.get(
      `/plex/playlist/${ratingKey}`
    )

    return data ? transformPlaylistTracks(data) : []
  }
}

const excludePlaylists = [
  'all music',
  'fresh',
  'recently added',
  'recently played'
]

function transformPlexPlaylists(data: IPlaylistItem[]) {
  return data
    .filter((d) => !excludePlaylists.includes(d.title.toLowerCase()))
    .map((d) => ({
      guid: d.guid,
      icon: d.icon,
      key: d.key,
      playlistType: d.playlistType,
      ratingKey: d.ratingKey,
      summary: d.summary,
      title: d.title,
      type: d.type
    }))
}

export interface ITrackViewDto {
  name: string
  domain: string
  type: 'file'
  url: string
}

function transformPlaylistTracks(data: IMediaItem[]): ITrackViewDto[] {
  return data.map((d) => ({
    name: d.title,
    domain: config.plexUrl || '',
    type: 'file',
    url: d.Media[0].Part[0].key
  }))
}
