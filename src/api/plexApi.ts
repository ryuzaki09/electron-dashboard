import axios from 'axios'

export interface IMediaItem {
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

export const plexApi = {
  getPlaylists: async () => {
    const result = await axios.get('http://172.16.170.101:3000/plex/playlists')
    console.log('plex result: ', result)
    return result.data ? transformPlexPlaylists(result.data) : []
  }
}

const excludePlaylists = [
  'all music',
  'fresh',
  'recently added',
  'recently played'
]

function transformPlexPlaylists(data: IMediaItem[]) {
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
