import React from 'react'
import {MemoryRouter, Routes, Route} from 'react-router'
import {render, screen, waitFor, within} from '@testing-library/react'
import {Main} from '../../../src/pages/main'
import {MusicProvider} from '../../../src/context/audio'
import {getTimeString} from '../../../src/hooks/useTime'
import SnowIcon from '../../../src/components/icons/weather/snow'
import * as header from '../../../src/components/header'

const mockState = {
  weather: {
    weather: {
      main: 'Rain',
      icon: SnowIcon
    },
    daily: [
      {
        dt: {day: 'Monday'},
        temp: {min: 10, max: 25},
        weather: {icon: SnowIcon}
      },
      {
        dt: {day: 'Tuesday'},
        temp: {min: 12, max: 28},
        weather: {icon: SnowIcon}
      },
      {
        dt: {day: 'Wednesday'},
        temp: {min: 15, max: 30},
        weather: {icon: SnowIcon}
      }
    ]
  },
  temp: 20,
  fetchPhotoAlbums: jest.fn().mockResolvedValue(null),
  photoAlbums: [],
  isLoadingPhotoAlbums: false,
  selectedPhotoAlbums: [],
  voiceAssistantIsListening: false,
  setVoiceAssistantIsListening: jest.fn()
}

jest.mock('../../../src/store/mainStore', () => ({
  mainStore: (selector) => {
    return selector(mockState)
  }
}))

describe('Main Component', () => {
  beforeEach(() => {
    jest.spyOn(header, 'Header').mockImplementation(() => <div />)
  })

  function renderComponent() {
    render(
      <MusicProvider>
        <MemoryRouter
          initialEntries={['/']}
          future={{v7_relativeSplatPath: true, v7_startTransition: true}}
        >
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </MemoryRouter>
      </MusicProvider>
    )
  }

  it('displays the current time and AM/PM', async () => {
    const {time, amPm} = getTimeString()
    renderComponent()
    await waitFor(() => screen.getByText(time))
    const timeElement = screen.getByText(time)
    expect(timeElement).toBeInTheDocument()
    expect(screen.getByText(amPm)).toBeInTheDocument()
  })

  it('displays the weather information', async () => {
    renderComponent()
    await waitFor(() => {
      screen.getByText(/Rain/i)
    })
    expect(screen.getByText(/Rain 25°C/i)).toBeInTheDocument()
    const dailyWeather = screen.getByTestId('daily-weather')
    expect(within(dailyWeather).getByText(/Tuesday/i)).toBeInTheDocument()
    expect(within(dailyWeather).getByText(/12°C \/ 28°C/i)).toBeInTheDocument()
    expect(within(dailyWeather).getByText(/Wednesday/i)).toBeInTheDocument()
    expect(within(dailyWeather).getByText(/15°C \/ 30°C/i)).toBeInTheDocument()
  })
})
