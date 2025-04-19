import React from 'react'
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

import styles from './index.module.css'

export function Header() {
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false)
  const {isListening, setIsListening} = useVoiceAssistant()
  console.log('isListening: ', isListening)

  const restartApp = () => {
    window.electronAPI.restartApp()
  }

  const onChangeTheme = (theme: {text: string; value: string}) => {
    mainStore.getState().setTheme(theme.value)
  }

  return (
    <>
      <header>
        <nav className={styles.navWrapper}>
          <div>
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
          <div
            className={styles.settingsWrapper}
            onClick={() => setSettingsModalOpen(true)}
          >
            <Icon name="settings" />
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
