import React from 'react'
import {Switch} from '@ryusenpai/shared-components'

import {Container} from '../../components/container'
import {homeAssistantApi, IDeviceState} from '../../api/homeAssistantApi'
import {homeConfig} from '../../config'

import styles from './index.module.css'

export function HomeAssistant() {
  const [devices, setDevices] = React.useState<any[]>([])

  React.useEffect(() => {
    const controller = new AbortController()
    const {signal} = controller
    let intervalId: NodeJS.Timeout
    const fetchDevices = async () => {
      try {
        homeAssistantApi.setSignal(signal)
        const result = await homeAssistantApi.getLights()
        const transformedData = transformHomeDevices(result)
        setDevices(transformedData)
      } catch (e) {
        console.log('unable to set devices')
      }
    }

    fetchDevices()

    intervalId = setInterval(() => {
      fetchDevices()
    }, 10000)

    return () => {
      clearInterval(intervalId)
      controller.abort()
      homeAssistantApi.closeSignal()
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
          size="large"
        />
      </div>
    </div>
  )
}

function transformHomeDevices(data: IDeviceState[]) {
  // console.log('transforming original data: ', data)
  if (!homeConfig.conversation.length) {
    return []
  }

  const filtered = Object.entries(homeConfig.conversation).reduce<any[]>((acc, device) => {
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
