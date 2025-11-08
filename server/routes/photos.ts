import express from 'express'
import axios from 'axios'

const router = express.Router()

const client = axios.create({
  baseURL: `${process.env.IMMICH_URL}/api`,
  headers: {
    'x-api-key': process.env.IMMICH_KEY
  }
})

router.get('/albums', async (_req: express.Request, res) => {
  const {data} = await client.get('/albums')
  return data ? transformAlbums(data) : []
})

function transformAlbums(data: any[]) {
  return data.map((album) => ({
    ...album,
    thumbnailUrl: `${process.env.IMMICH_URL}/api/asset/thumbnail/${
      album.albumThumbnailAssetId
    }`
  }))
}
