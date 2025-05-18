import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {config} from '../../config'

const IDLE_TIMEOUT = 60000 // 1minute
const excludePaths = ['/', '/movie']

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

      if (!excludePaths.includes(location.pathname) && !config.isDevelopment) {
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
