import React from 'react'
import {format} from 'date-fns'
import {MemoryRouter, Routes, Route} from 'react-router'
import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import {Main} from '../../../src/pages/main'
import {MusicProvider} from '../../../src/context/audio'
import {getTimeString} from '../../../src/hooks/useTime'
import SnowIcon from '../../../src/components/icons/weather/snow'

const weatherData = {
  weather: {
    main: 'Rain',
    icon: SnowIcon
  },
  temp: 20,
  daily: [
    {dt: {day: 'Monday'}, temp: {min: 10, max: 25}, weather: {icon: SnowIcon}},
    {dt: {day: 'Tuesday'}, temp: {min: 12, max: 28}, weather: {icon: SnowIcon}},
    {
      dt: {day: 'Wednesday'},
      temp: {min: 15, max: 30},
      weather: {icon: SnowIcon}
    }
  ]
}
jest.mock('../../../src/store/mainStore', () => ({
  mainStore: () => ({
    ...weatherData
  })
}))

describe('Main Component', () => {
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

  it.skip('renders the main content', async () => {
    renderComponent()
    expect(screen.getByText('Time Display')).toBeInTheDocument()
    expect(screen.getByText('Weather Information')).toBeInTheDocument()
  })

  it('displays the current time and AM/PM', async () => {
    const {time, amPm} = getTimeString()
    renderComponent()
    await waitFor(() => screen.getByRole('time'))
    const timeElement = screen.getByRole('time')
    expect(timeElement.textContent).toContain(time)
    expect(screen.getByText(amPm)).toBeInTheDocument()
  })

  it('displays the weather information', async () => {
    renderComponent()
    await waitFor(() => {
      screen.getByText(/Rain/i)
    })
    expect(screen.getByText(/20°C/i)).toBeInTheDocument()
    expect(screen.getByText(/Tuesday/i)).toBeInTheDocument()
    expect(screen.getByText(/15°C/i)).toBeInTheDocument()
  })
})
