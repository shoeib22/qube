import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Test 1: read device_states
  const { data: states, error: readError } = await supabase
    .from('device_states')
    .select('*')

  // Test 2: write to device_states
  const { error: writeError } = await supabase
    .from('device_states')
    .upsert(
      { device_id: 'test', state: 'ON', updated_at: new Date().toISOString() },
      { onConflict: 'device_id' }
    )

  // Test 3: write to device_events
  const { error: eventError } = await supabase
    .from('device_events')
    .insert({ topic: 'test/topic', payload: 'TEST' })

  return Response.json({
    supabase_url:    process.env.NEXT_PUBLIC_SUPABASE_URL,
    service_key_set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    read_states:     { data: states, error: readError?.message },
    write_state:     { error: writeError?.message ?? 'OK' },
    write_event:     { error: eventError?.message ?? 'OK' },
  })
}