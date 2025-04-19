import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

const IDLE_TIMEOUT = 60000 // 1minute

export function WithReturnHome({children}: {children: React.ReactNode}) {
  const location = useLocation()
  const navigate = useNavigate()
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
          navigate('/')
        }, IDLE_TIMEOUT)
      }

      if (location.pathname !== '/') {
        events.forEach((event) => {
          window.addEventListener(event, resetTimer)
        })
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
    [location]
  )

  return <>{children}</>
}
