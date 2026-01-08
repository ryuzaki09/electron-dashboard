import React from 'react'
import classnames from 'classnames'
import {immichApi} from '../../api/immichApi'
import {useActivityDetection} from '../../hooks/useActivityDetection'
import {mainStore} from '../../store/mainStore'
import {shuffleArray} from '../../helpers/utils'

import type {TImmichAlbumViewDto} from '../../api/types'

import styles from './index.module.css'

// const FIVE_MINTUES = 1000 * 60 * 5
const THREE_MINUTES = 1000 * 60 * 3

export function WithPhotoLibrary({children}: {children: React.ReactNode}) {
  const [photoLib, setPhotoLib] = React.useState<TImmichAlbumViewDto['assets']>([])
  const [photoIndex, setPhotoIndex] = React.useState(0)
  const [photoLibIsActive, setPhotoLibIsActive] = React.useState(false)
  const {selectedPhotoAlbums} = mainStore((state) => state)
  // console.log('selected Photos: ', selectedPhotoAlbums)

  const {activateDetection} = useActivityDetection({
    timeout: THREE_MINUTES,
    delayFn: () => setPhotoLibIsActive(true)
  })

  // Fetch all album photos first if albums have been selected
  React.useEffect(
    () => {
      const fetchPhotos = async () => {
        try {
          if (!selectedPhotoAlbums.length) {
            return
          }

          const promises = selectedPhotoAlbums.map((p) =>
            immichApi.getAlbumInfo(p.id)
          )
          const results = await Promise.all(promises)
          const photos = results.flatMap((result) => result.assets)
          setPhotoLib(shuffleArray(photos))
        } catch (error) {
          console.error('Error fetching photos:', error)
        }
      }

      fetchPhotos()
    },
    [selectedPhotoAlbums]
  )

  // loop through photos
  React.useEffect(
    () => {
      let intervalId: NodeJS.Timeout
      if (photoLibIsActive && photoLib.length > 0) {
        intervalId = setInterval(() => {
          setPhotoIndex((prevIndex) => {
            const nextIndex = prevIndex + 1
            if (nextIndex >= photoLib.length) {
              return 0
            }
            return nextIndex
          })
        }, 10000)
      }

      return () => {
        clearInterval(intervalId)
      }
    },
    [photoLib, photoLibIsActive]
  )

  React.useEffect(
    () => {
      if (!photoLibIsActive) {
        console.log('SET START DETECT')
        activateDetection()
      }
    },
    [photoLibIsActive]
  )

  React.useEffect(
    () => {
      function turnOffPhotoLib() {
        setPhotoLibIsActive(false)
      }
      if (photoLibIsActive) {
        window.addEventListener('mousedown', turnOffPhotoLib)
        window.addEventListener('keypress', turnOffPhotoLib)
      }

      return () => {
        window.removeEventListener('mousedown', turnOffPhotoLib)
        window.removeEventListener('keypress', turnOffPhotoLib)
      }
    },
    [photoLibIsActive]
  )
  // console.log('photoLib Active: ', photoLibIsActive)

  return (
    <>
      <div
        className={classnames(styles.wrapper, {
          [styles.photoLibActive]: photoLib.length > 0 && photoLibIsActive
        })}
      >
        {photoLib.length > 0 &&
          photoLib.map((p, index) => (
            <img
              src={p.url}
              key={p.url}
              data-active-item={photoIndex === index}
            />
          ))}
      </div>
      {children}
    </>
  )
}
