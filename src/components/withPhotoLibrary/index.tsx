import React from 'react'
import classnames from 'classnames'
import {immichApi} from '../../api/immichApi'
import {useActivityDetection} from '../../hooks/useActivityDetection'
import {mainStore} from '../../store/mainStore'

import styles from './index.module.css'

const albumsToShow = ['Spain Majorca 2024']
// const FIVE_MINTUES = 1000 * 60 * 5
const FIVE_MINTUES = 1000 * 60 * 2

export function WithPhotoLibrary({children}: {children: React.ReactNode}) {
  const [photoLib, setPhotoLib] = React.useState<any[]>([])
  const [photoIndex, setPhotoIndex] = React.useState(0)
  const [photoLibIsActive, setPhotoLibIsActive] = React.useState(false)
  const {selectedPhotoAlbums} = mainStore((state) => state)
  console.log('selected Photos: ', selectedPhotoAlbums)

  const {activateDetection} = useActivityDetection({
    timeout: 30 * 1000,
    delayFn: () => setPhotoLibIsActive(true)
  })

  React.useEffect(
    () => {
      const fetchPhotos = async () => {
        try {
          console.log('fetch photos: ', selectedPhotoAlbums.length)
          // const albums = await immichApi.getAlbums()
          if (!selectedPhotoAlbums.length) {
            return
          }

          // const selectedAlbum = albums.find((a) =>
          //   albumsToShow.includes(a.albumName)
          // )

          const promises = selectedPhotoAlbums.map((p) =>
            immichApi.getAlbumInfo(p.id)
          )
          console.log('fetch promises: ', promises)
          const results = await Promise.all(promises)
          console.log('all results: ', results)
          //console.log('selectedAlbum: ', selectedAlbum)
          // if (selectedAlbum) {
          // const albumWithAssets = await immichApi.getAlbumInfo(selectedAlbum.id)
          // console.log('album assets: ', albumWithAssets)
          // if (albumWithAssets) {
          //   setPhotoLib(albumWithAssets.assets)
          // }
          // }
        } catch (error) {
          console.error('Error fetching photos:', error)
        }
      }

      setInterval(() => {
        // Persist fetch at set interval only IF there is no photos
        if (!photoLib.length) {
          // set delay to wait on backend service
          setTimeout(() => {
            fetchPhotos()
          }, 2000)
        }
      }, FIVE_MINTUES)
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
