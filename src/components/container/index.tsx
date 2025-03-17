import React from 'react'
import {Header} from '../header'

import styles from './index.module.css'

interface IContainerProps {
  children: React.ReactNode
}
export function Container({children}: IContainerProps) {
  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.container}>{children}</div>
    </div>
  )
}
