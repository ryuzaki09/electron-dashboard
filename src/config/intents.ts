import {useTimerStore} from '../store/timerStore'
import {mainStore} from '../store/mainStore'
import {
  timestampToUKdate,
  timestampToFriendlyDateString,
  timestampToDayOfWeek,
  formatCorrectDate
} from '../helpers/time'
import {homeAssistantApi} from '../api/homeAssistantApi'

interface IIntent {
  [key: string]: {
    sentences: string[]
    triggerFn: (transcription: string, sentence: string) => string | void
    responseFromTrigger: boolean
    tts: string
  }
}
const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]

export const intents: IIntent = {
  getWeather: {
    sentences: [
      'what is the weather on {slot}',
      'how is the weather on {slot}',
      'how is the weather {slot}',
      "what's the weather like on {slot}",
      "what's the weather like {slot}",
      "what's the weather {slot}",
      "what's the weather on {slot}"
    ],
    triggerFn: (transcription: string, sentence: string) => {
      const date = getSlotArgument(transcription, sentence)
      const weather = mainStore.getState().weather
      const formattedDate = formatCorrectDate(date.trim())
      const foundDay = daysOfWeek.find((d) => date.includes(d))

      const dailyData = weather.daily
      const foundDailyData = dailyData.find((d) => {
        return (
          timestampToUKdate(d.dt.timestamp) === formattedDate ||
          timestampToDayOfWeek(d.dt.timestamp).toLowerCase() ===
            formattedDate.toLowerCase() ||
          timestampToDayOfWeek(d.dt.timestamp).toLowerCase() === foundDay
        )
      })

      console.log('found daily data: ', foundDailyData)
      let responseDate = {date: ''}
      if (foundDailyData && daysOfWeek.includes(formattedDate.toLowerCase())) {
        responseDate = {
          date: timestampToFriendlyDateString(foundDailyData.dt.timestamp)
        }
      }

      console.log('response date: ', responseDate)

      if (foundDailyData) {
        return `${
          responseDate.date ? `The weather on ${responseDate.date}` : ``
        } has a high temperature of ${Math.round(
          foundDailyData.temp.max
        )} degrees celsius and a low of ${Math.round(
          foundDailyData.temp.min
        )} degrees celsius. ${
          formattedDate === 'today' ? foundDailyData.summary : ''
        }`
      }

      return 'There is no weather data.'
    },
    responseFromTrigger: true,
    tts: ''
  },
  onTimers: {
    sentences: ['set timer for {slot}', 'start timer for {slot}'],
    triggerFn: () => {
      useTimerStore.getState().createTimer('1', 10000)
      useTimerStore.getState().startTimer('1')
      console.log('triggered FN')
    },
    responseFromTrigger: false,
    tts: 'Timer started'
  },
  stopTimers: {
    sentences: [
      'stop timer',
      'cancel timer',
      'stop timer for {slot}',
      'cancel timer for {slot}'
    ],
    triggerFn: () => {},
    responseFromTrigger: false,
    tts: 'Timer has been stopped'
  },
  toggleHA: {
    sentences: ['turn on {slot}', 'turn off {slot}'],
    triggerFn: (transcription: string) => {
      // const device = getSlotArgument(transcription, sentence)
      homeAssistantApi
        .conversation(transcription)
        .then((res) => console.log('Action triggered'))
    },
    responseFromTrigger: false,
    tts: 'Completed'
  }
}

function getSlotArgument(transcription: string, sentence: string) {
  const filteredSentence = sentence.replace('{slot}', '').trim()
  return transcription
    .toLowerCase()
    .replace(filteredSentence, '')
    .replace('?', '')
}

export function findIntent(speechText: string) {
  let sentenceWords: string[] = []
  console.log('Finding intent for: ', speechText)
  const allIntents = Object.keys(intents)
  let foundSentence = ''
  // allIntents.forEach((intent) => {
  const foundIntent = allIntents.find((intent) => {
    const sentence = intents[intent].sentences.find((sentence: string) => {
      sentenceWords = sentence
        .replace(`{slot}`, '')
        .trim()
        .split(' ')
      // console.log('Sentence words: ', sentenceWords)

      const match =
        speechText &&
        sentenceWords.every((word) => speechText.toLowerCase().includes(word))
      return match
    })
    // console.log('Sentence: ', sentence)

    if (sentence) {
      foundSentence = sentence
    }

    return sentence
  })

  if (!foundIntent) {
    console.log('No intent found')
    return false
  }

  return {
    intent: intents[foundIntent],
    sentence: foundSentence
  }
}
