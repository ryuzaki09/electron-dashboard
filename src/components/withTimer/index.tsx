import React from 'react'

import {useTimerStore} from '../../store/timerStore'

export function WithTimer({children}: {children: React.ReactNode}) {
  const timers = useTimerStore((state) => state.timers)

  return <>{children}</>
}
