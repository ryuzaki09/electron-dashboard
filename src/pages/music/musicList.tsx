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
  const [levelIndex, setLevelIndex] = React.useState<null | number>(null)
  const [levelItemIndex, setLevelItemIndex] = React.useState<number | null>(
    null
  )
  const [level2Directory, setLevel2Directory] = React.useState<string | null>(
    null
  )
  const {setStreamUrl, setShuffleList, setPlayingTrack, play, stop} = useAudio()

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
    setLevelIndex(0)
    setLevelItemIndex(levelItemIndex)
  }
  const onClickSecondLevel = (dirname: string) => {
    setLevel2Directory(dirname)
    setLevelItemIndex(1)
  }

  const onClickPlay = (file: any) => {
    stop()
    const filePath = file.path.replace(file.basePath, '')
    setStreamUrl(`${file.domain}${filePath}`)
    play()
      .then(() => {
        console.log('Playing')
        setPlayingTrack(file)
      })
      .catch((e) => {
        console.log('Cannot play: ', e)
      })
  }

  const goUpLevel = () => {
    if (levelIndex === null) return

    if (
      levelIndex === 0 &&
      levelItemIndex !== null &&
      level2Directory === null
    ) {
      setLevelIndex(null)
      return
    }

    setLevel2Directory(null)
    setLevelItemIndex(0)
  }

  const shufflePlay = () => {
    if (level2Directory === null) {
      const musicItem = musicList[(levelIndex || 1) - 1]
      const files = (musicItem && musicItem[1] && musicItem[1].files) || []
      // shuffle the list
      files.sort(() => Math.random() - 0.5)
      setShuffleList(files)
    } else {
      const musicItem = musicList[(levelIndex || 1) - 1]
      const files =
        (musicItem && musicItem[1] && musicItem[1][level2Directory].files) || []
      // shuffle the list
      files.sort(() => Math.random() - 0.5)
      setShuffleList(files)
    }
  }

  const shouldShowRootList = levelIndex !== 0 && !levelItemIndex
  const shouldShowLevel1List =
    levelIndex === 0 && levelItemIndex !== null && level2Directory === null
  const shouldShowLevel1Files =
    levelIndex === 0 && levelItemIndex !== null && level2Directory === null
  const shouldShowLevel2Files =
    levelIndex === 0 && level2Directory !== null && levelItemIndex !== null

  return (
    <div className={styles.musicListWrapper}>
      <div>
        <button
          className={
            levelIndex !== null ? styles.backActive : styles.backNotActive
          }
          onClick={goUpLevel}
        >
          Back
        </button>
        <button onClick={shufflePlay}>Shuffle Play</button>
      </div>
      <div className={styles.listWrapper}>
        <ul className={styles.fileList}>
          <>
            {shouldShowRootList &&
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
            {shouldShowLevel1List &&
              Object.entries(musicList[levelIndex][1]).map((f, index) => {
                const [key] = f
                return key === 'files' ? null : (
                  <li key={key} onClick={() => onClickSecondLevel(key)}>
                    <span>{key}</span>
                  </li>
                )
              })}
            {shouldShowLevel1Files &&
              musicList[levelIndex][1].files.map((f) => (
                <li key={f.name} onClick={() => onClickPlay(f)}>
                  <span>{f.name}</span>
                </li>
              ))}
            {shouldShowLevel2Files &&
              musicList[levelIndex][1][level2Directory].files.map((f) => (
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
