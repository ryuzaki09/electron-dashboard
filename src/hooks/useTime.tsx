import React from 'react'

const REFRESH_INTERVAL = 1000 * 10 // 10 seconds

export function useTime() {
  const [time, setTime] = React.useState('00:00')
  const [amPm, setAmPm] = React.useState('AM')

  React.useEffect(() => {
    let interval = setInterval(() => {
      const dateTime = new Date()
      const minutes = dateTime.getMinutes()
      const hours = dateTime.getHours()
      const amPm = hours > 12 ? 'PM' : 'AM'

      setTime(`${hours}:${minutes}`)
      setAmPm(amPm)
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return {amPm, time}
}
