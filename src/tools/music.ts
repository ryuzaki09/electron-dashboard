import {MusicLib} from '../lib/musicLib'
// musicTool

const musicLib = new MusicLib

export async function searchMusic(query: string) {
  return musicLib.searchMusic(query) 
}
