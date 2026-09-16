import fs from 'fs'
import path from 'path'
import { createServiceClient } from '../api/lib/supabase.js'

try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8')
  envContent.split('\n').forEach(line => {
    const parts = line.split('=')
    if (parts.length >= 2 && !line.startsWith('#')) {
      const k = parts[0].trim()
      const v = parts.slice(1).join('=').trim()
      if (k && !process.env[k]) process.env[k] = v
    }
  })
} catch (e) {}

async function checkDistricts() {
  const supabase = createServiceClient()
  const { data: districts, error } = await supabase.from('districts').select('*')
  console.log('Districts:', districts, error)
}

checkDistricts()
