import React from 'react'
import {Switch} from '@ryusenpai/shared-components'

import {Container} from '../../components/container'
import {homeAssistantApi, IDeviceState} from '../../api/homeAssistantApi'
import {conversation} from '../../config/constants'
import {useCachedPromise} from '../../hooks/useCachedPromise'

import styles from './index.module.css'

export function HomeAssistant() {
  return (
    <Container>
      <div>
        <React.Suspense fallback={<p>Loading...</p>}>
          <HomeDevices />
        </React.Suspense>
      </div>
    </Container>
  )
}

function HomeDevices() {
  const data = useCachedPromise(homeAssistantApi.getLights())
  const transformedData = transformHomeDevices(data)

  return transformedData ? (
    <div className={styles.smartDevicesContainer}>
      {transformedData.map((d) => (
        <Device key={d.entity_id} device={d} />
      ))}
    </div>
  ) : null
}

function Device({device}) {
  const [isOn, setIsOn] = React.useState(device.state === 'on')

  const toggleDevice = async (state: string) => {
    setIsOn((prevState) => !prevState)
    await homeAssistantApi.conversation(state)
  }

  return (
    <div key={device.entity_id} className={styles.deviceCard}>
      <div>{device.deviceName.replace('_', ' ')}</div>
      <div>
        <Switch
          onToggleCallback={() =>
            toggleDevice(isOn ? device.deviceProps.off : device.deviceProps.on)
          }
          variant="lightswitch"
          initialState={isOn}
        />
      </div>
    </div>
  )
}

function transformHomeDevices(data: IDeviceState[]) {
  const filtered = Object.entries(conversation).reduce<any[]>((acc, device) => {
    const [deviceName, deviceProps] = device
    const foundDevice = data.find((d) => d.entity_id.includes(deviceName))
    if (foundDevice) {
      acc.push({
        deviceName,
        deviceProps,
        ...foundDevice
      })
    }

    return acc
  }, [])

  return filtered
}
