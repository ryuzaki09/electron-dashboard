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

import styles from './index.module.css'

export function Header() {
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false)
  const {isListening, setIsListening} = useVoiceAssistant()
  const [navIsOpen, setNavIsOpen] = React.useState(false)
  const {setStartDetection} = useActivityDetection({
    timeout: 5000,
    onDetectionFn: () => setNavIsOpen(false)
  })
  const [showSettings, setShowSettings] = React.useState(false)
  console.log('isListening: ', isListening)

  const onChangeTheme = (theme: {text: string; value: string}) => {
    mainStore.getState().setTheme(theme.value)
  }

  React.useEffect(
    () => {
      let timeoutId: NodeJS.Timeout
      if (navIsOpen) {
        console.log('start detection')
        setStartDetection(true)

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

  const handleOnClickSettingsMenu = () => {
    if (showSettings) {
      setSettingsModalOpen(true)
      return
    }

    setNavIsOpen((prevState) => !prevState)
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
          onClose={() => setSettingsModalOpen(false)}
          title="Settings"
          content={
            <div className={styles.modalContent}>
              <p>Theme</p>
              <ModernDropdown
                options={themeOptions}
                onChangeFn={onChangeTheme as any}
              />
            </div>
          }
        />
      )}
    </>
  )
}
