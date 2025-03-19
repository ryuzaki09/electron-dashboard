import React from 'react'

import {useCachedPromise} from '../../hooks/useCachedPromise'
import {transformMusicMedia} from '../../helpers/utils'
import {useAudio} from '../../context/audio'

import styles from './index.module.css'

interface IMusicListProps {
  musicPromise: () => Promise<any>
}

export function MusicList({musicPromise}: IMusicListProps) {
  const [musicList, setMusicList] = React.useState<any[]>([])
  const [levelIndex, setLevelIndex] = React.useState(0)
  const [levelItemIndex, setLevelItemIndex] = React.useState<number | null>(
    null
  )
  const {setStreamUrl, setPlayingTrack, play, resume, pause, stop} = useAudio()

  if (!musicList.length) {
    const data: any[] = useCachedPromise('fetchMusic', musicPromise())
    const result = transformMusicMedia(data)
    const fileEntries = Object.entries(result)

    if (fileEntries.length > 0 && !musicList.length) {
      setMusicList(fileEntries)
    }
    // console.log('fileEntries: ', fileEntries)
  }
  // console.log('musicList: ', musicList)

  const onClickFirstLevel = (levelItemIndex: number) => {
    setLevelIndex(1)
    setLevelItemIndex(levelItemIndex)
  }

  const onClickPlay = (file: any) => {
    stop()
    const filePath = file.path.replace(file.basePath, '')
    setStreamUrl(`http://localhost:3000${filePath}`)
    play()
      .then(() => {
        console.log('Playing')
        setPlayingTrack(file)
      })
      .catch((e) => {
        console.log('Cannot play: ', e)
      })
  }

  const onClickPause = () => {
    pause()
  }

  const onClickResume = () => {
    resume()
  }

  const goUpLevel = () => {
    setLevelIndex((prevIndex) => prevIndex - 1)
    if (levelIndex - 1 === 0) {
      setLevelItemIndex(null)
    }
  }

  return (
    <div className={styles.musicListWrapper}>
      <button
        className={levelIndex > 0 ? styles.backActive : styles.backNotActive}
        onClick={goUpLevel}
      >
        Back
      </button>
      <div className={styles.listWrapper}>
        <ul className={styles.fileList}>
          <>
            {levelIndex === 0 &&
              !levelItemIndex &&
              musicList.map((item, index) => {
                const [name] = item
                return (
                  <li
                    key={`${index}_${name}`}
                    onClick={() => onClickFirstLevel(index)}
                  >
                    {name}
                  </li>
                )
              })}
            {levelIndex === 1 &&
              levelItemIndex !== null &&
              musicList[levelItemIndex][1].files.map((f) => (
                <li key={f.name} onClick={() => onClickPlay(f)}>
                  <span>{f.name}</span>
                </li>
              ))}
          </>
        </ul>
      </div>
    </div>
  )
}
