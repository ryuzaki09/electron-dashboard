import React from 'react'
import {Modal} from '@ryusenpai/shared-components'

import {useCachedPromise} from '../../hooks/useCachedPromise'
import {transformMusicMedia} from '../../helpers/utils'
import {useAudio} from '../../context/audio'
import {plexApi, TPlaylistViewDto} from '../../api/plexApi'
import FolderIcon from '../../components/icons/folder'
import {CustomModal} from '../../components/modal/modal'

import styles from './index.module.css'

interface IMusicListProps {
  musicPromise: () => Promise<any>
}

const TRACK_FILES_KEY = 'files'

export function MusicList({musicPromise}: IMusicListProps) {
  const [musicList, setMusicList] = React.useState<any>(null)
  const [playlistModalIsOpen, setPlaylistModalIsOpen] = React.useState(false)
  const [songListModalIsOpen, setSongListModalIsOpen] = React.useState(false)
  const {playingTrack} = useAudio()

  if (!musicList) {
    const data: any[] = useCachedPromise('fetchMusic', musicPromise())
    const result = transformMusicMedia(data)
    console.log('transformed: ', result)

    if (result.root) {
      setMusicList(result.root)
    }
  }

  // console.log('musicList: ', musicList)
  // console.log('playingtrack: ', playingTrack)
  return (
    <div className={styles.musicListWrapper}>
      <div>
        <button onClick={() => setSongListModalIsOpen(true)}>Show Songs</button>
        <button onClick={() => setPlaylistModalIsOpen(true)}>
          Show Playlists
        </button>
      </div>
      <div className={styles.musicContent}>
        {playingTrack &&
          playingTrack.art && (
            <div>
              <img src={`${playingTrack.domain}${playingTrack.art}`} />
            </div>
          )}
        {playingTrack && <div>{playingTrack.name}</div>}
      </div>
      {songListModalIsOpen && (
        <div className={styles.songsModalWrapper}>
          <CustomModal
            onClose={() => setSongListModalIsOpen(false)}
            content={
              <SongsList
                musicList={musicList}
                onTrackClickCb={() => setSongListModalIsOpen(false)}
              />
            }
          />
        </div>
      )}
      {playlistModalIsOpen && (
        <div className={styles.modalWrapper}>
          <Modal
            onClose={() => setPlaylistModalIsOpen(false)}
            title="Playlists"
            content={
              <Playlists closeFn={() => setPlaylistModalIsOpen(false)} />
            }
          />
        </div>
      )}
    </div>
  )
}

function SongsList({musicList, onTrackClickCb}) {
  const [firstLevelFolder, setFirstLevelFolder] = React.useState('')
  const [secondLevelFolder, setSecondLevelFolder] = React.useState('')
  const [levelIndex, setLevelIndex] = React.useState<null | number>(null)
  const {setStreamUrl, setShuffleList, setPlayingTrack, play, stop} = useAudio()

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
    setStreamUrl(`${file.domain}${file.url}`)
    play()
      .then(() => {
        console.log('Playing')
        setPlayingTrack(file)
        onTrackClickCb()
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
    let tracks = []

    if (secondLevelFolder !== '') {
      tracks = musicList[firstLevelFolder][secondLevelFolder].files
    } else if (firstLevelFolder !== '' && secondLevelFolder === '') {
      tracks = musicList[firstLevelFolder].files
    } else {
      tracks = musicList.files
    }
    tracks.sort(() => Math.random() - 0.5)
    setShuffleList(tracks)
    onTrackClickCb()
  }

  const shouldShowRootList = firstLevelFolder === ''
  const shouldShowLevel1 = firstLevelFolder !== '' && secondLevelFolder === ''
  const shouldShowLevel2 = firstLevelFolder !== '' && secondLevelFolder !== ''

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
  return (
    <>
      <div className={styles.folderNav}>
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
              musicList.files.map((f) => (
                <li key={f.url} onClick={() => onClickPlay(f)}>
                  {f.name}
                </li>
              ))}
            {shouldShowLevel1 &&
              firstLevelFolders.length > 0 &&
              firstLevelFolders.map((f, index) => {
                const [key] = f
                return key === 'files' ? null : (
                  <li key={key} onClick={() => onClickSecondLevel(key)}>
                    <FolderIcon /> <span>{key}</span>
                  </li>
                )
              })}
            {shouldShowLevel1 &&
              musicList[firstLevelFolder].files.map((f) => (
                <li key={f.url} onClick={() => onClickPlay(f)}>
                  <span>{f.name}</span>
                </li>
              ))}
            {shouldShowLevel2 &&
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
    </>
  )
}

function Playlists({closeFn}: {closeFn: () => void}) {
  const [playlists, setPlaylists] = React.useState<TPlaylistViewDto[]>([])
  const {setShuffleList} = useAudio()

  React.useEffect(() => {
    const getData = async () => {
      const result = await plexApi.getPlaylists()
      if (result.length > 0) {
        setPlaylists(result)
      }
    }

    getData()
  }, [])

  const playPlaylist = async (item: TPlaylistViewDto) => {
    console.log('item: ', item)
    const result = await plexApi.getPlaylistItems(item.ratingKey)
    console.log('playlist Tracks: ', result)
    result.sort(() => Math.random() - 0.5)
    setShuffleList(result)
    closeFn()
  }

  return (
    <ul>
      {playlists.length > 0 &&
        playlists.map((p) => (
          <li key={p.guid}>
            <div>{p.title}</div>
            <div className={styles.playlistActions}>
              <span>Plex</span>
              <button onClick={() => playPlaylist(p)}>Play</button>
            </div>
          </li>
        ))}
    </ul>
  )
}
