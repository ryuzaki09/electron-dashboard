import {format, add} from 'date-fns'

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

export const timestampToFriendlyDateString = (timestamp: number) => {
  return format(new Date(timestamp * 1000), 'iiii do MMMM')
}

export const formatCorrectDate = (date: string) => {
  if (date === 'today') {
    return today
  }

  if (date === 'tomorrow') {
    return format(add(new Date(), {days: 1}), 'dd/MM/yyyy')
  }

  return date
}
