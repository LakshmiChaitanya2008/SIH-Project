import { createClient } from '@supabase/supabase-js'
import { config } from '../config.js'

let supabase = null
let isOnline = false

if (config.supabaseUrl && (config.supabaseServiceKey || config.supabaseAnonKey)) {
  const key = config.supabaseServiceKey || config.supabaseAnonKey
  supabase = createClient(config.supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function checkSupabaseConnection() {
  if (!supabase) {
    isOnline = false
    return false
  }
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const { error } = await supabase.from('districts').select('id', { count: 'exact', head: true }).abortSignal(controller.signal)
    clearTimeout(timeout)
    isOnline = !error
  } catch (err) {
    isOnline = false
  }
  return isOnline
}

export function getSupabase() {
  return isOnline ? supabase : null
}

export { supabase }
