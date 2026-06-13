import {plexApi} from '../api/plexApi'

export class MusicLib {
  async searchMusic(query: string) {
    const result = plexApi.searchMusic(query)
    //const plexUrl = process.env.PLEX_URL
    //const plexToken = process.env.PLEX_TOKEN

    //const response = await axios.get(
      //`${plexUrl}/search`,
      //{
        //params: {
          //query,
          //'X-Plex-Token': plexToken
        //}
      //}
    //)

    //return response.data
  }
}
