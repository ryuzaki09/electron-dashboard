import {config} from '../config'
import {localAi} from '../api/localai'
import {openAiAPI} from '../api/openai'

export const ai = config.useLocalAi ? localAi : openAiAPI
