import express from 'express'
import axios from 'axios'
import {IImmichAlbum, IImmichAsset} from '../../src/api/types'
import {config} from '../../src/config'

const router = express.Router()

const client = axios.create({
  baseURL: `${process.env.IMMICH_URL}/api`,
  headers: {
    'x-api-key': process.env.IMMICH_KEY
  }
})

router.get('/albums', async (_req: express.Request, res) => {
  const {data} = await client.get('/albums')
  return data ? res.send(transformAlbums(data)) : res.send([])
})

router.get('/album-info/:id', async (req: express.Request, res) => {
  const albumId = req.params.id
  const {data} = await client.get<IImmichAlbum>(`/albums/${albumId}`)
  //console.log('info data: ', data)
  return data ? res.send(transformAlbum(data)) : res.send(null)
})

function transformAlbums(data: any[]) {
  return data.map((album) => ({
    ...album,
    thumbnailUrl: `${process.env.IMMICH_URL}/api/asset/thumbnail/${
      album.albumThumbnailAssetId
    }`
  }))
}

const transformAlbum = (data: IImmichAlbum) => {
  const imagesOnly = {
    ...data,
    assets: data.assets.filter((a) => a.type === 'IMAGE')
  }
  return {
    ...imagesOnly,
    assets: imagesOnly.assets.map((asset: IImmichAsset) => ({
      ...asset,
      thumbnailUrl: `${config.immichUrl}/api/assets/${
        asset.id
      }/thumbnail?apiKey=${config.immichKey}`,
      url: `${config.immichUrl}/api/assets/${asset.id}/original?apiKey=${
        config.immichKey
      }`
    }))
  }
}

export default router
