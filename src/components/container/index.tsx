import React from 'react'
import {Header} from '../header'

interface IContainerProps {
  children: React.ReactNode
}
export function Container({children}: IContainerProps) {
  return (
    <>
      <Header />
      <div style={{padding: '2rem 1rem'}}>{children}</div>
    </>
  )
}
