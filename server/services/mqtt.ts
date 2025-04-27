import mqtt from 'mqtt'
import {WebSocketServer} from 'ws'

export function startMqtt() {
  const wss = new WebSocketServer({port: 8082})
  const mqttClient = mqtt.connect(
    'mqtt://172.16.170.50:1883',
    {
      username: 'mqttuser',
      password: 'Deathnote1'
    }
  )

  wss.on('connection', (ws) => {
    mqttClient.on('message', (topic, message) => {
      console.log('mqtt message: ', message.toString())
      console.log('mqtt topic: ', topic)
      ws.send(JSON.stringify({topic, message: message.toString()}))
    })
  })

  mqttClient.on('connect', () => {
    mqttClient.subscribe('door/ring', (err) => {
      if (err) {
        console.log('door/ring error: ', err)
      }
    })
  })
}
