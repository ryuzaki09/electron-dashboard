import express from 'express'
import axios from 'axios'

const router = express.Router()

router.post('/conversation', async (req, res) => {
  const {body} = req
  if (!body.text) {
    return res.status(400).send({message: 'Missing text'})
  }

  const result = await axios.post(
    `http://${process.env.HA_HOST}:8123/api/conversation/process`,
    {
      text: body.text,
      language: 'en'
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HA_LONG_LIVE_TOKEN}`
      }
    }
  )
  // console.log('home result: ', result.data.response)

  res.send({message: 'ok'})
})

router.get('/states', async (_req: express.Request, res) => {
  const result = await axios.get(
    `http://${process.env.HA_HOST}:8123/api/states`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HA_LONG_LIVE_TOKEN}`
      }
    }
  )

  res.send(result.data)
})
export default router
