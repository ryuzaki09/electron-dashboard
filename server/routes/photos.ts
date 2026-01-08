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

router.get('/photo/:id', async (req: express.Request, res) => {
  const assetId = req.params.id
  const {type} = req.query
  const url =
    type === 'thumbnail'
      ? `/assets/${assetId}/thumbnail`
      : `/assets/${assetId}/original`
  try {
    const response = await client.get(url, {
      responseType: 'stream'
    })

    res.setHeader(
      'Content-Type',
      response.headers['content-type'] || 'image/jpeg'
    )
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length'])
    }

    response.data.pipe(res)
  } catch (err) {
    res.status(404).send('Image not found')
  }
})

const excludeAlbums = ['camera', 'untitled']

function transformAlbums(data: IImmichAlbum[]) {
  return data
    .filter((d) => !excludeAlbums.includes(d.albumName.toLowerCase()))
    .map((album) => ({
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
      thumbnailUrl: `${config.localApiUrl}/photos/photo/${
        asset.id
      }?type=thumbnail`,
      url: `${config.localApiUrl}/photos/photo/${asset.id}?type=original`
    }))
  }
}

export default router
