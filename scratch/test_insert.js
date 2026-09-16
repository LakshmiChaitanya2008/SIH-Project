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
} catch (e) {
  console.error('Could not read .env:', e.message)
}

async function testInsert() {
  const supabase = createServiceClient()

  const gumlaDistrictId = '45f4cdc5-52ba-438b-8119-6fb551dab556'
  const subWater1Id = '00000000-0000-0000-0001-000000000001'

  const { data, error } = await supabase.from('problem_submissions').insert([
    {
      id: subWater1Id,
      original_text: 'Borewell water in Gumla has yellow tint and foul smell. Children are falling sick after drinking it.',
      translated_text: 'Borewell water in Gumla has yellow tint and foul smell. Children are falling sick after drinking it.',
      original_language: 'en',
      submission_channel: 'WEB',
      district_id: gumlaDistrictId,
      status: 'CLUSTERED',
    }
  ]).select()

  console.log('Test Insert Result:', { data, error })
}

testInsert()
