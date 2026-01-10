import React from 'react'
import classnames from 'classnames'
import {Link} from 'react-router-dom'
import {Icon, ModernDropdown} from '@ryusenpai/shared-components'

import HomeIcon from '../icons/home'
import MusicIcon from '../icons/music'
import MovieIcon from '../icons/movie'
import HomeAssistantIcon from '../icons/homeAssistant'
import {useVoiceAssistant} from '../../hooks/useVoiceAssistant'
import {config} from '../../config'
import {themeOptions} from '../../config/constants'
import {CustomModal} from '../modal/modal'
import {MediaControls} from './mediaControls'
import {mainStore} from '../../store/mainStore'
import {useActivityDetection} from '../../hooks/useActivityDetection'
import {TImmichAlbumViewDto} from '../../api/types'

import styles from './index.module.css'

export function Header() {
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false)
  const {isListening, setIsListening} = useVoiceAssistant()
  const [navIsOpen, setNavIsOpen] = React.useState(false)
  const [selectedAlbums, setSelectedAlbums] = React.useState<
    TImmichAlbumViewDto[]
  >([])
  const {activateDetection} = useActivityDetection({
    timeout: 5000,
    delayFn: () => setNavIsOpen(false)
  })
  const [showSettings, setShowSettings] = React.useState(false)
  const {
    photoAlbums,
    selectedPhotoAlbums,
    setSelectedPhotoAlbums,
    fetchPhotoAlbums,
    setTheme
  } = mainStore((state) => state)
  console.log('isListening: ', isListening)

  const onChangeTheme = (theme: {text: string; value: string}) => {
    setTheme(theme.value)
  }

  React.useEffect(
    () => {
      let timeoutId: NodeJS.Timeout
      if (navIsOpen) {
        console.log('start detection')
        activateDetection()

        setShowSettings(true)

        timeoutId = setTimeout(() => {
          setShowSettings(false)
        }, 5000)
      }

      return () => {
        clearTimeout(timeoutId)
      }
    },
    [navIsOpen]
  )

  React.useEffect(
    () => {
      setSelectedAlbums(selectedPhotoAlbums)
    },
    [selectedPhotoAlbums]
  )

  const handleOnClickSettingsMenu = () => {
    if (showSettings) {
      setSettingsModalOpen(true)
      return
    }

    setNavIsOpen((prevState) => !prevState)
  }

  const handleOnSelectAlbum = (
    album: TImmichAlbumViewDto,
    isChecked: boolean
  ) => {
    if (isChecked) {
      return setSelectedAlbums((prevState) => prevState.concat(album))
    }

    return setSelectedAlbums((prevState) =>
      prevState.filter((p) => p !== album)
    )
  }

  const onCloseModal = () => {
    // console.log('set albums: ', selectedAlbums)
    setSelectedPhotoAlbums(selectedAlbums)
    setSettingsModalOpen(false)
    fetchPhotoAlbums()
  }

  return (
    <>
      <header className={styles.header}>
        <nav
          className={classnames(styles.navWrapper, {
            [styles.navIsOpen]: navIsOpen
          })}
        >
          <div
            className={styles.settingsWrapper}
            onClick={handleOnClickSettingsMenu}
          >
            <Icon
              name={
                showSettings || settingsModalOpen ? 'settings' : 'hamburgerMenu'
              }
            />
          </div>
          <div className={classnames(styles.navItems)}>
            <Link to="/">
              <HomeIcon />
            </Link>
            <Link to="/music">
              <MusicIcon />
            </Link>
            <Link to="/movie">
              <MovieIcon />
            </Link>
            <Link to="/home-assistant">
              <HomeAssistantIcon />
            </Link>
            {config.isDevelopment && (
              <button
                onClick={isListening ? () => {} : () => setIsListening(true)}
              >
                {isListening ? 'Listening..' : 'Press to talk'}
              </button>
            )}
          </div>
        </nav>
      </header>
      <MediaControls />
      {settingsModalOpen && (
        <CustomModal
          onClose={onCloseModal}
          title="Settings"
          content={
            <>
              <div className={styles.modalContent}>
                <p>Theme</p>
                <ModernDropdown
                  options={themeOptions}
                  onChangeFn={onChangeTheme as any}
                />
              </div>
              <div className={styles.modalContent}>
                <PhotoAlbums
                  albums={photoAlbums}
                  selectedAlbums={selectedAlbums}
                  onSelectFn={handleOnSelectAlbum}
                />
              </div>
            </>
          }
        />
      )}
    </>
  )
}

interface IPhotoAlbumsProps {
  albums: TImmichAlbumViewDto[]
  selectedAlbums: TImmichAlbumViewDto[]
  onSelectFn: (album: TImmichAlbumViewDto, isChecked: boolean) => void
}

function PhotoAlbums({albums, selectedAlbums, onSelectFn}: IPhotoAlbumsProps) {
  return (
    <>
      <p>Select Photo Album(s)</p>

      <div className={styles.modalContentPhotoAlbums}>
        {albums.length > 0 &&
          albums.map((a) => {
            const found = selectedAlbums.find(
              (s) => s.albumName === a.albumName
            )
            return (
              <div
                key={a.albumName}
                className={styles.albumRow}
                onClick={() => onSelectFn(a, !found)}
              >
                <div>{a.albumName}</div>
                {found && (
                  <div>
                    <div className={styles.check} />
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </>
  )
}
