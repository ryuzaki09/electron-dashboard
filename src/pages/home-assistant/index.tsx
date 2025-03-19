import React from 'react'
import {Switch} from '@ryusenpai/shared-components'

import {Container} from '../../components/container'
import {homeAssistantApi, IDeviceState} from '../../api/homeAssistantApi'
import {conversation} from '../../config/constants'

import styles from './index.module.css'

export function HomeAssistant() {
  const [devices, setDevices] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchDevices = async () => {
      const result = await homeAssistantApi.getLights()
      const transformedData = transformHomeDevices(result)
      setDevices(transformedData)
    }

    fetchDevices()

    let intervalId = setInterval(() => {
      fetchDevices()
    }, 10000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <Container>
      <div className={styles.smartDevicesContainer}>
        {devices.map((d) => (
          <Device key={d.entity_id} device={d} />
        ))}
      </div>
    </Container>
  )
  // return (
  //   <Container>
  //     <div>
  //       <React.Suspense fallback={<p>Loading...</p>}>
  //         <HomeDevices key={time} refreshKey={time} />
  //       </React.Suspense>
  //     </div>
  //   </Container>
  // )
}

function Device({device}) {
  const [isOn, setIsOn] = React.useState(device.state === 'on')

  React.useEffect(
    () => {
      setIsOn(device.state === 'on')
    },
    [device]
  )

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
          value={isOn}
        />
      </div>
    </div>
  )
}

function transformHomeDevices(data: IDeviceState[]) {
  // console.log('transforming original data: ', data)
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
