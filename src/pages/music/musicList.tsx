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
  console.log('musicList: ', musicList)

  const onClickFirstLevel = (levelItemIndex: number) => {
    setLevelIndex(1)
    setLevelItemIndex(levelItemIndex)
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
    setLevelIndex((prevIndex) => prevIndex - 1)
    if (levelIndex - 1 === 0) {
      setLevelItemIndex(null)
    }
  }

  const shufflePlay = () => {
    // console.log('levelIndex: ', levelIndex)
    // console.log('music: ', musicList)
    const musicItem = musicList[levelIndex - 1]
    const files = (musicItem && musicItem[1] && musicItem[1].files) || []
    // console.log('FILES: ', files)
    const shuffled = files.sort(() => Math.random() - 0.5)
    // console.log('Shuffled: ', shuffle(files))
    setShuffleList(files)
  }

  return (
    <div className={styles.musicListWrapper}>
      <div>
        <button
          className={levelIndex > 0 ? styles.backActive : styles.backNotActive}
          onClick={goUpLevel}
        >
          Back
        </button>
        <button onClick={shufflePlay}>Shuffle Play</button>
      </div>
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

function shuffle(array: any[]){
//   set the index to the arrays length
  let i = array.length, j, temp;
//   create a loop that subtracts everytime it iterates through
  while (--i > 0) {
//  create a random number and store it in a variable
  j = Math.floor(Math.random () * (i+1));
// create a temporary position from the item of the random number    
  temp = array[j];
// swap the temp with the position of the last item in the array    
  array[j] = array[i];
// swap the last item with the position of the random number 
  array[i] = temp;
  }

  return array
}
