// lib/mqttBridge.js
import mqtt from 'mqtt'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

let bridgeInitialized = false
let mqttClient = null

export function initMQTTBridge() {
  if (bridgeInitialized) return
  bridgeInitialized = true

  mqttClient = mqtt.connect(process.env.MQTT_BROKER, {
    username:        process.env.MQTT_USERNAME,
    password:        process.env.MQTT_PASSWORD,
    reconnectPeriod: 5000,
    connectTimeout:  10000,
    clientId:        `xerovolt-bridge-${Math.random().toString(16).slice(2)}`,
  })

  mqttClient.on('connect', () => {
    console.log('[MQTT Bridge] Connected to HiveMQ ✓')
    mqttClient.subscribe('home/#')
    mqttClient.subscribe('xerovolt/#')
  })

  mqttClient.on('message', async (topic, message) => {
    const payload = message.toString()
    console.log(`[MQTT Bridge] ${topic} → ${payload}`)

    // Log every event
    const { error } = await supabase
      .from('device_events')
      .insert({ topic, payload })

    if (error) console.error('[MQTT Bridge] Log error:', error.message)

    // Update current state
    const parts    = topic.split('/')
    const deviceId = parts[2]
    const type     = parts[3]

    if (type === 'state') {
      const { error: stateError } = await supabase
        .from('device_states')
        .upsert(
          { device_id: deviceId, state: payload, updated_at: new Date().toISOString() },
          { onConflict: 'device_id' }
        )
      if (stateError) console.error('[MQTT Bridge] State error:', stateError.message)
      else console.log(`[MQTT Bridge] Supabase updated → ${deviceId} is ${payload}`)
    }
  })

  mqttClient.on('reconnect', () => console.warn('[MQTT Bridge] Reconnecting...'))
  mqttClient.on('offline',   () => console.warn('[MQTT Bridge] Offline'))
  mqttClient.on('error',     (err) => console.error('[MQTT Bridge] Error:', err.message))
}

export function publishCommand(topic, payload) {
  if (!mqttClient || !mqttClient.connected) {
    console.error('[MQTT Bridge] Cannot publish — not connected')
    return false
  }
  mqttClient.publish(topic, payload)
  console.log(`[MQTT Bridge] Published: ${topic} → ${payload}`)
  return true
}