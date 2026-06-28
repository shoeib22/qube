import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-middleware'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  const authResult = await requireAuth(request)
  if (authResult instanceof Response) return authResult

  const { data, error } = await getSupabase()
    .from('device_states')
    .select('*')
    .order('device_id')

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ devices: data })
}
