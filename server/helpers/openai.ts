import {ChatCompletionTool} from 'openai/resources'

export const functions: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getWeatherForecast',
      description: 'Retrieves the weather temperature for a particular day',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description:
              'The date, for example: "today", "tomorrow", "Monday", Tuesday", etc to be in the format of dd/mm/yyyy'
          }
        },
        required: ['date'],
        additionalProperties: false
      },
      strict: true
    }
  },
  {
    type: 'function',
    function: {
      name: 'getWeatherForecastForLocation',
      description:
        'Retrieves the weather temperature for the provided coordinates in celsius',
      parameters: {
        type: 'object',
        properties: {
          latitude: {type: 'number'},
          longitude: {type: 'number'}
        },
        required: ['latitude', 'longitude'],
        additionalProperties: false
      },
      strict: true
    }
  }
]
