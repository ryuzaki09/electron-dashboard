import React from 'react'
import {Container} from '../components/container'

import {useTime} from '../hooks/useTime'

import styles from './main.module.css'

export function Main() {
  const {amPm, time} = useTime()

  return (
    <Container>
      <div>
        <div>
          <span className={styles.time}>{time}</span> {amPm}
        </div>
      </div>
    </Container>
  )
}
