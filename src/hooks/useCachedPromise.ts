import React from 'react'

let promiseCache: Promise<any> | null = null

export const useCachedPromise = (fn: Promise<any>) => {
  if (!promiseCache) {
    promiseCache = fn
  }

  return React.use(promiseCache)
}
