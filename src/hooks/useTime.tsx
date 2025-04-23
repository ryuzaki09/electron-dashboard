import React from 'react'

const REFRESH_INTERVAL = 1000 * 3 // 10 seconds

export function useTime() {
  const [time, setTime] = React.useState(getTimeString().time)
  const [amPm, setAmPm] = React.useState(getTimeString().amPm)

  React.useEffect(() => {
    let interval = setInterval(() => {
      const {time: newTime, amPm: newAmPm} = getTimeString()

      setTime(newTime)
      setAmPm(newAmPm)
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return {amPm, time}
}

export function getTimeString() {
  const dateTime = new Date()
  const minutes = dateTime.getMinutes()
  const hours = dateTime.getHours()
  const amPm = hours > 12 ? 'PM' : 'AM'

  return {
    time: `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
    amPm
  }
}
