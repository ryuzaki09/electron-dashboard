import React from 'react'
//import '@picovoice/porcupine-web'
//jest.mock('@picovoice/porcupine-web')
import {format} from 'date-fns'
import {MemoryRouter, Routes, Route} from 'react-router'
import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import {Main} from '../../../src/pages/main'
//import Container from '../components/container';
//import TimeDisplay from './TimeDisplay';
//import WeatherInformation from './WeatherInformation';

describe('Main Component', () => {
  function renderComponent() {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it.only('renders the main content', async () => {
    renderComponent()
    expect(screen.getByText('Time Display')).toBeInTheDocument()
    expect(screen.getByText('Weather Information')).toBeInTheDocument()
  })

  //it('displays the current time and AM/PM', async () => {
    //const {getByText, getByRole} = render(<Main />)
    //await waitFor(() => getByRole('time'))
    //const timeElement = getByRole('time')
    //expect(timeElement.textContent).toContain(new Date().toLocaleTimeString())
    //expect(getByText('AM/PM')).toBeInTheDocument()
  //})

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
