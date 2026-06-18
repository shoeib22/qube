// instrumentation.js  ← create this in your project root
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initMQTTBridge } = await import('./lib/mqttBridge')
    initMQTTBridge()
  }
}