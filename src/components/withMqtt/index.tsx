import React from 'react'

import {websocket} from '../../services/websocket'

export function WithMQTT({children}: {children: React.ReactNode}) {
  React.useEffect(() => {
    function onMessageReceived(event: MessageEvent) {
      console.log('📨 Message received:', event)
    }

    websocket.start(onMessageReceived)
  }, [])

  return <>{children}</>
}
