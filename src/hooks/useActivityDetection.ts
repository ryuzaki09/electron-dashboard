import React from 'react'

interface IActivityProps {
  timeout: number
  delayFn: () => void
}

export function useActivityDetection({timeout, delayFn}: IActivityProps) {
  const [startDetection, setStartDetection] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const delayFnRef = React.useRef(delayFn)

  React.useEffect(
    () => {
      delayFnRef.current = delayFn
    },
    [delayFn]
  )

  React.useEffect(
    () => {
      const events = [
        'mousemove',
        'mousedown',
        'keypress',
        'touchstart',
        'scroll'
      ]

      function resetTimer() {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
          // console.log('Calling delayed function')
          delayFnRef.current()
          setStartDetection(false)
          timerRef.current = null
          resetTimer()
        }, timeout)
      }
      // console.log('startDetection: ', startDetection)
      // console.log('timer: ', timerRef.current)

      if (startDetection) {
        console.log('STARTED')
        events.forEach((event) => {
          window.addEventListener(event, resetTimer)
        })

        resetTimer()
      }

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        events.forEach((event) => {
          window.removeEventListener(event, resetTimer)
        })
      }
    },
    [startDetection, timeout]
  )

  const activateDetection = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setStartDetection(true)
  }, [])

  return {
    activateDetection
  }
}
