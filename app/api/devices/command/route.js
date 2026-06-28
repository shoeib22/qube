import { publishCommand } from '@/lib/mqttBridge'
import { requireAuth } from '@/lib/auth-middleware'

export async function POST(request) {
  const authResult = await requireAuth(request)
  if (authResult instanceof Response) return authResult

  const { deviceId, state } = await request.json()

  if (!deviceId || !state) {
    return Response.json({ error: 'Missing deviceId or state' }, { status: 400 })
  }

  const topic = `home/livingroom/${deviceId}/set`
  const success = publishCommand(topic, state)

  if (!success) {
    return Response.json({ error: 'MQTT not connected' }, { status: 503 })
  }

  return Response.json({ ok: true, topic, state })
}
