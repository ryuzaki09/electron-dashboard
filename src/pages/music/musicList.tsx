import React from 'react'

import {useCachedPromise} from '../../hooks/useCachedPromise'
import {transformMusicMedia} from '../../helpers/utils'
import {useAudio} from '../../context/audio'
import FolderIcon from '../../components/icons/folder'

import styles from './index.module.css'

interface IMusicListProps {
  musicPromise: () => Promise<any>
}

const TRACK_FILES_KEY = 'files'

export function MusicList({musicPromise}: IMusicListProps) {
  const [musicList, setMusicList] = React.useState<any>(null)
  const [firstLevelFolder, setFirstLevelFolder] = React.useState('')
  const [secondLevelFolder, setSecondLevelFolder] = React.useState('')
  const [levelIndex, setLevelIndex] = React.useState<null | number>(null)
  const [levelItemIndex, setLevelItemIndex] = React.useState<number | null>(
    null
  )
  const [level2Directory, setLevel2Directory] = React.useState<string | null>(
    null
  )
  const {setStreamUrl, setShuffleList, setPlayingTrack, play, stop} = useAudio()

  if (!musicList) {
    const data: any[] = useCachedPromise('fetchMusic', musicPromise())
    const result = transformMusicMedia(data)
    console.log('transformed: ', result)

    if (result.root) {
      setMusicList(result.root)
    }
  }

  const onClickFirstLevel = (folderName: string) => {
    setFirstLevelFolder(folderName)
    setLevelIndex(0)
  }
  const onClickSecondLevel = (dirname: string) => {
    setSecondLevelFolder(dirname)
    setLevelIndex(1)
  }

  const onClickPlay = (file: any) => {
    stop()
    // const filePath = file.path.replace(file.basePath, '')
    setStreamUrl(`${file.domain}${file.url}`)
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

    if (levelIndex === 0) {
      setLevelIndex(null)
      setFirstLevelFolder('')
      return
    }

    if (levelIndex === 1) {
      setLevelIndex(0)
      setSecondLevelFolder('')
      return
    }
  }

  const shufflePlay = () => {
    if (secondLevelFolder !== '') {
      const tracks = musicList[firstLevelFolder][secondLevelFolder].files
      tracks.sort(() => Math.random() - 0.5)
      setShuffleList(tracks)
      return
    }

    if (firstLevelFolder !== '' && secondLevelFolder === '') {
      const tracks = musicList[firstLevelFolder].files
      tracks.sort(() => Math.random() - 0.5)
      setShuffleList(tracks)
      return
    }

    const tracks = musicList.files
    tracks.sort(() => Math.random() - 0.5)
    setShuffleList(tracks)
  }

  const shouldShowRootList = firstLevelFolder === ''
  const shouldShowLevel1List =
    firstLevelFolder !== '' && secondLevelFolder === ''
  //const shouldShowLevel1List =
  //levelIndex === 0 && levelItemIndex !== null && level2Directory === null
  const shouldShowLevel1Files =
    firstLevelFolder !== '' && secondLevelFolder === ''
  //const shouldShowLevel1Files =
  //levelIndex === 0 && levelItemIndex !== null && level2Directory === null
  const shouldShowLevel2Files =
    // levelIndex === 0 && level2Directory !== null && levelItemIndex !== null
    firstLevelFolder !== '' && secondLevelFolder !== ''

  const firstLevelFolders = React.useMemo(
    () => {
      if (musicList && firstLevelFolder !== '') {
        const folders = Object.entries(musicList[firstLevelFolder]).filter(
          (f) => f[0] !== TRACK_FILES_KEY
        )
        return folders
      }

      return []
    },
    [musicList, firstLevelFolder]
  )

  console.log('musicList: ', musicList)
  console.log('firstLevel: ', firstLevelFolders)
  //if (musicList && firstLevelFolder !== '') {
  //console.log('musicList keys: ', Object.entries(musicList[firstLevelFolder]))
  //}
  return (
    <div className={styles.musicListWrapper}>
      <div>
        <button
          className={
            firstLevelFolder !== '' || secondLevelFolder !== ''
              ? styles.backActive
              : styles.backNotActive
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
              musicList &&
              Object.keys(musicList).map((name, index) => {
                return name === TRACK_FILES_KEY ? null : (
                  <li
                    key={`${index}_${name}`}
                    onClick={() => onClickFirstLevel(name)}
                  >
                    <FolderIcon /> {name}
                  </li>
                )
              })}
            {shouldShowRootList &&
              musicList &&
              musicList.files &&
              musicList.files.map((f, index) => (
                <li key={f.url} onClick={() => onClickPlay(f)}>
                  {f.name}
                </li>
              ))}
            {shouldShowLevel1List &&
              firstLevelFolders.length > 0 &&
              firstLevelFolders.map((f, index) => {
                const [key] = f
                return key === 'files' ? null : (
                  <li key={key} onClick={() => onClickSecondLevel(key)}>
                    <FolderIcon /> <span>{key}</span>
                  </li>
                )
              })}
            {shouldShowLevel1Files &&
              musicList[firstLevelFolder].files.map((f) => (
                <li key={f.url} onClick={() => onClickPlay(f)}>
                  <span>{f.name}</span>
                </li>
              ))}
            {shouldShowLevel2Files &&
              musicList[firstLevelFolder][secondLevelFolder].files.map(
                (f, index) => (
                  <li key={`${index}_${f.name}`} onClick={() => onClickPlay(f)}>
                    <span>{f.name}</span>
                  </li>
                )
              )}
          </>
        </ul>
      </div>
    </div>
  )
}
