import express from 'express'
import fs from 'fs'
import multer from 'multer'
import {openAiAPI} from '../services/openai'

const router = express.Router()

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({storage})

router.post('/stt', upload.single('audio'), async (req, res) => {
  const file = req.file
  console.log('checking FILE')
  if (!file) {
    return res.status(400).send({
      message: 'audio file is required'
    })
  }
  const audioPath = fs.createReadStream(file.path)
  console.log('call stt')
  const result = await openAiAPI.speechToText(audioPath)
  fs.unlinkSync(file.path)

  res.send({data: result})
})

router.post('/tts', async (req, res) => {
  const {text} = req.body

  if (!text) {
    return res.status(400).send({
      message: 'text is required'
    })
  }

  const audio = await openAiAPI.textToSpeech(text)
  res.json(audio)
})

router.post('/converse', upload.single('audio'), async (req, res) => {
  const file = req.file
  console.log('checking FILE')
  if (!file) {
    return res.status(400).send({
      message: 'audio file is required'
    })
  }
  const audioPath = fs.createReadStream(file.path)
  console.log('call stt')
  const transcription = await openAiAPI.speechToText(audioPath)
  fs.unlinkSync(file.path)

  const result = await openAiAPI.createChat(transcription)

  res.send(result)
})

export default router
