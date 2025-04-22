import React from 'react'

interface IActivityProps {
  timeout: number
  onDetectionFn: () => void
}

export function useActivityDetection({timeout, onDetectionFn}: IActivityProps) {
  const [startDetection, setStartDetection] = React.useState(false)
  const [activityDetected, setActivityDetected] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

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
          console.log('Calling detect function')
          onDetectionFn()
        }, timeout)
      }

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
    [startDetection, timeout, onDetectionFn]
  )

  return {
    setStartDetection
  }
}
