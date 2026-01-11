import React from 'react'
import {Modal} from '@ryusenpai/shared-components'

import styles from './modal.module.css'

interface ICustomModalProps {
  title?: string
  isOpen: boolean
  content: React.ReactNode
  onClose: () => void
}

export function CustomModal(props: ICustomModalProps) {
  return (
    <div className={styles.modalWrapper}>
      <Modal {...props} />
    </div>
  )
}
