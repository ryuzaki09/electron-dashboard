import React from 'react'

let promiseCache: {name: string; fn: Promise<any>} | null = null

export const useCachedPromise = (name: string, fn: Promise<any>) => {
  if (!promiseCache || promiseCache.name !== name) {
    promiseCache = {name, fn}
  }

  return React.use(promiseCache.fn)
}
