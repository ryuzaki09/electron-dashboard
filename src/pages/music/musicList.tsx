import React from 'react'
import {Icon} from '@ryusenpai/shared-components'

import {useCachedPromise} from '../../hooks/useCachedPromise'
import {useMediaPlayer, PlayStates} from '../../helpers/audioPlayer'
import {transformMusicMedia} from '../../helpers/utils'

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
  const [playingTrack, setPlayingTrack] = React.useState<any>(null)
  const {
    setStreamUrl,
    setOnEnd,
    playState,
    play,
    resume,
    pause,
    stop
  } = useMediaPlayer()

  React.useEffect(() => {
    setOnEnd(() => {
      setPlayingTrack(null)
    })
  }, [])

  if (!musicList.length) {
    const data: any[] = useCachedPromise(musicPromise())
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

  console.log('files: ', musicList[0])
  return (
    <div className={styles.musicListWrapper}>
      <MediaControls
        playingTrack={playingTrack}
        playState={playState}
        resumeFn={onClickResume}
        pauseFn={onClickPause}
      />
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

function MediaControls({playingTrack, playState, resumeFn, pauseFn}) {
  return (
    <div className={styles.mediaControls}>
      <div>{playingTrack && `Playing: ${playingTrack.name}`}</div>
      <div className={styles.controls}>
        <span
          className={
            !playingTrack || playState === PlayStates.paused
              ? ''
              : styles.active
          }
          onClick={
            !playingTrack || playState === PlayStates.paused
              ? () => {}
              : pauseFn
          }
        >
          <Icon name="pause" />
        </span>
        <span
          onClick={
            !playingTrack || playState === PlayStates.playing
              ? () => {}
              : resumeFn
          }
          className={
            !playingTrack || playState === PlayStates.playing
              ? ''
              : styles.active
          }
        >
          <Icon name="play" />
        </span>
      </div>
    </div>
  )
}
