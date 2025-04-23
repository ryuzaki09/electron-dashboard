import React from 'react'
import {format} from 'date-fns'
import {MemoryRouter, Routes, Route} from 'react-router'
import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import {Main} from '../../../src/pages/main'
//import Container from '../components/container';
//import TimeDisplay from './TimeDisplay';
//import WeatherInformation from './WeatherInformation';
import {MusicProvider} from '../../../src/context/audio'
import {getTimeString} from '../../../src/hooks/useTime'

describe('Main Component', () => {
  function renderComponent() {
    render(
      <MusicProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </MemoryRouter>
      </MusicProvider>
    )
  }

  it('renders the main content', async () => {
    renderComponent()
    // render(
    //   <MusicProvider>
    //     <Main />
    //   </MusicProvider>
    // )
    expect(screen.getByText('Time Display')).toBeInTheDocument()
    expect(screen.getByText('Weather Information')).toBeInTheDocument()
  })

  it.only('displays the current time and AM/PM', async () => {
    const {time, amPm} = getTimeString()
    renderComponent()
    await waitFor(() => screen.getByRole('time'))
    const timeElement = screen.getByRole('time')
    expect(timeElement.textContent).toContain(time)
    expect(screen.getByText(amPm)).toBeInTheDocument()
  })

  //it('displays the current date', async () => {
  //const {getByText, getByRole} = render(<Main />)
  //await waitFor(() => getByRole('time'))
  //const dateElement = getByText(format(new Date(), 'eeee, do LLL'))
  //expect(dateElement.textContent).toContain(
  //format(new Date(), 'eeee, do LLL')
  //)
  //})

  //it('displays the weather information', async () => {
  //const weatherData = {
  //main: 'Rain',
  //temp: 20,
  //icon: 'sun',
  //daily: [
  //{dt: {day: 'Monday'}, temp: {min: 10, max: 25}},
  //{dt: {day: 'Tuesday'}, temp: {min: 12, max: 28}},
  //{dt: {day: 'Wednesday'}, temp: {min: 15, max: 30}}
  //]
  //}
  //const store = {mainStore: () => weatherData}
  //render(<Main store={store} />)
  //await waitFor(() => screen.getByText('Rain'))
  //expect(screen.getByText('20°C')).toBeInTheDocument()
  //expect(screen.getByText('Monday')).toBeInTheDocument()
  //expect(screen.getByText('15°C')).toBeInTheDocument()
  //})

  //it('displays the daily forecast', async () => {
  //const weatherData = {
  //main: 'Rain',
  //temp: 20,
  //icon: 'sun',
  //daily: [
  //{dt: {day: 'Monday'}, temp: {min: 10, max: 25}},
  //{dt: {day: 'Tuesday'}, temp: {min: 12, max: 28}},
  //{dt: {day: 'Wednesday'}, temp: {min: 15, max: 30}}
  //]
  //}
  //const store = {mainStore: () => weatherData}
  //render(<Main store={store} />)
  //await waitFor(() => screen.getByText('Monday'))
  //expect(screen.getByText('10°C')).toBeInTheDocument()
  //expect(screen.getByText('28°C')).toBeInTheDocument()
  //expect(screen.getByText('30°C')).toBeInTheDocument()
  //})
})
