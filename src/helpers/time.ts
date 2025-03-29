import {format} from 'date-fns'

export const today = format(new Date(), 'dd/MM/yyyy')

export const dateAndDay = format(new Date(), 'iiii dd/MM/yyyy')

export const getCurrentTime = () => {
  const date = new Date()

  return `${date.getHours()}:${date.getMinutes()}`
}

export const timestampToUKdate = (timestamp: number) => {
  return format(new Date(timestamp * 1000), 'dd/MM/yyyy')
}

export const timestampToDayOfWeek = (timestamp: number) => {
  return format(new Date(timestamp * 1000), 'iiii')
}
