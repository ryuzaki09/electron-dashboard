import React from 'react'
import classnames from 'classnames'
import {immichApi} from '../../api/immichApi'
import {useActivityDetection} from '../../hooks/useActivityDetection'

import styles from './index.module.css'

export function WithPhotoLibrary({children}: {children: React.ReactNode}) {
  const [photoLib, setPhotoLib] = React.useState<any[]>([])
  const [photoIndex, setPhotoIndex] = React.useState(0)
  const [photoLibIsActive, setPhotoLibIsActive] = React.useState(false)

  const {activateDetection} = useActivityDetection({
    timeout: 30 * 1000,
    delayFn: () => setPhotoLibIsActive(true)
  })

  React.useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const albums = await immichApi.getAlbums()
        if (albums && albums.length > 0) {
          const albumWithAssets = await immichApi.getAlbumInfo(albums[0].id)
          if (albumWithAssets) {
            setPhotoLib(albumWithAssets.assets)
          }
        }
      } catch (error) {
        console.error('Error fetching photos:', error)
      }
    }

    fetchPhotos()
  }, [])

  React.useEffect(
    () => {
      let intervalId: NodeJS.Timeout | null = null
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
        window.addEventListener('mousedown', turnOffPhotoLib)
      }

      return () => {
        window.removeEventListener('mousedown', turnOffPhotoLib)
        window.removeEventListener('keypress', turnOffPhotoLib)
        window.removeEventListener('mousedown', turnOffPhotoLib)
      }
    },
    [photoLibIsActive]
  )

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
