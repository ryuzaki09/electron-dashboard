import {config} from '../config'
import {localAi} from '../api/localAi'
import {openAiAPI} from '../api/openai'

export const ai = config.useLocalAi ? localAi : openAiAPI
