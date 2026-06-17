import {plexApi} from '../api/plexApi'

export class MusicLib {
  async searchMusic({query}: {query: string}) {
    const result = await plexApi.searchMusic(query)
    return result
  }
}
