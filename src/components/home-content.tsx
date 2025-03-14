import React from 'react'

import styles from './styles.module.css'

export function HomeContent() {
  //const loggedIn = useSelector(({user}) => user.loggedIn)
  const loggedIn = false

  return (
    <div className={styles.wrapper}>
      <div>
        <img src="../assets/images/reactlogo.png" />
      </div>
      {loggedIn ? (
        <button type="button" onClick={() => {}}>
          Logout
        </button>
      ) : (
        <button type="button" onClick={() => {}}>
          Login
        </button>
      )}
    </div>
  )
}
