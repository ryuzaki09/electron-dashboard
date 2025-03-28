import {format} from 'date-fns'

export const today = format(new Date(), 'dd/MM/yyyy')

export const getCurrentTime = () => {
  const date = new Date()

  return `${date.getHours()}:${date.getMinutes()}`
}
