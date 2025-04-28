import React from 'react'

import {useTimerStore} from '../../store/timerStore'

export function WithTimer({children}: {children: React.ReactNode}) {
  const timers = useTimerStore((state) => state.timers)
  console.log('timers: ', timers)

  React.useEffect(() => {
    useTimerStore.getState().createTimer('default', 5000)
    useTimerStore.getState().startTimer('default')
  }, [])

  React.useEffect(
    () => {
      if (timers) {
        for (const timer of Object.values(timers)) {
          if (timer.isRunning) {
            console.log(
              `Timer ${timer.id} is running with ${
                timer.remainingTime
              }ms remaining`
            )
          } else {
            const audio = new Audio('/assets/sounds/timer_finished.wav')

            let intervalId: NodeJS.Timeout
            const repeatTimes = 3
            let count = 0
            intervalId = setInterval(() => {
              if (count < repeatTimes) {
                audio.play()
              }
              count++

              if (count > repeatTimes) {
                clearInterval(intervalId)
              }
            }, 1500)
            useTimerStore.getState().deleteTimer(timer.id)
          }
        }
      }
    },
    [timers]
  )

  return <>{children}</>
}
