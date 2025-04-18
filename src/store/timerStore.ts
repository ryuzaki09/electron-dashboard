import {create} from 'zustand'

interface Timer {
  id: string
  duration: number // in milliseconds
  remainingTime: number
  isRunning: boolean
  intervalId?: NodeJS.Timeout
}

interface TimerStore {
  timers: Record<string, Timer>
  createTimer: (id: string, duration: number) => void
  startTimer: (id: string) => void
  pauseTimer: (id: string) => void
  resetTimer: (id: string) => void
  deleteTimer: (id: string) => void
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  timers: {},

  createTimer: (id: string, duration) =>
    set((state) => ({
      timers: {
        ...state.timers,
        [id]: {id, duration, remainingTime: duration, isRunning: false}
      }
    })),

  startTimer: (id: string) => {
    const {timers} = get()
    if (!timers[id] || timers[id].isRunning) return

    const intervalId = setInterval(() => {
      set((state) => {
        const timer = state.timers[id]
        if (!timer) return {}

        const newRemainingTime = Math.max(timer.remainingTime - 1000, 0)
        if (newRemainingTime === 0) clearInterval(timer.intervalId!)

        return {
          timers: {
            ...state.timers,
            [id]: {
              ...timer,
              remainingTime: newRemainingTime,
              isRunning: newRemainingTime > 0
            }
          }
        }
      })
    }, 1000)

    set((state) => ({
      timers: {
        ...state.timers,
        [id]: {...state.timers[id], isRunning: true, intervalId}
      }
    }))
  },

  pauseTimer: (id: string) =>
    set((state) => {
      const timer = state.timers[id]
      if (!timer || !timer.isRunning) return state

      clearInterval(timer.intervalId!)
      return {
        timers: {
          ...state.timers,
          [id]: {...timer, isRunning: false, intervalId: undefined}
        }
      }
    }),

  resetTimer: (id) =>
    set((state) => {
      const timer = state.timers[id]
      if (!timer) return state

      clearInterval(timer.intervalId!)
      return {
        timers: {
          ...state.timers,
          [id]: {
            ...timer,
            remainingTime: timer.duration,
            isRunning: false,
            intervalId: undefined
          }
        }
      }
    }),

  deleteTimer: (id: string) =>
    set((state) => {
      const timer = state.timers[id]
      if (timer) clearInterval(timer.intervalId!)

      const newTimers = {...state.timers}
      delete newTimers[id]

      return {timers: newTimers}
    })
}))
