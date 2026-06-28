// lib/mqttBridge.js
import mqtt from 'mqtt'
import { createClient } from '@supabase/supabase-js'

let supabase = null
let bridgeInitialized = false
let mqttClient = null

export function initMQTTBridge() {
  if (bridgeInitialized) return
  bridgeInitialized = true

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[MQTT Bridge] Supabase env vars missing — bridge disabled')
    return
  }

  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  console.log('[MQTT Bridge] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('[MQTT Bridge] Service key set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

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

    // Log event
    const { error: logError } = await supabase
      .from('device_events')
      .insert({ topic, payload })

    if (logError) {
      console.error('[MQTT Bridge] device_events error:', JSON.stringify(logError))
    } else {
      console.log('[MQTT Bridge] device_events insert OK')
    }

    // Parse topic
    const parts    = topic.split('/')
    const deviceId = parts[2]
    const type     = parts[3]

    console.log(`[MQTT Bridge] Parsed → deviceId="${deviceId}" type="${type}"`)

    if (type === 'state') {
      console.log(`[MQTT Bridge] Running upsert for device_id="${deviceId}" state="${payload}"`)

      const { data, error: stateError } = await supabase
        .from('device_states')
        .upsert(
          {
            device_id:  deviceId,
            state:      payload,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'device_id' }
        )
        .select()

      if (stateError) {
        console.error('[MQTT Bridge] device_states upsert FAILED:', JSON.stringify(stateError))
      } else {
        console.log('[MQTT Bridge] device_states upsert OK:', JSON.stringify(data))
      }
    } else {
      console.log(`[MQTT Bridge] Skipping — type is "${type}", not "state"`)
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