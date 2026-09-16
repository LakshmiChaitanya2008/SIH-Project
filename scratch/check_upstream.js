import fs from 'fs'
import path from 'path'
import { createServiceClient } from '../api/lib/supabase.js'

// Parse .env manually
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

async function check() {
  const supabase = createServiceClient()

  console.log('Querying cluster members with service client...')
  const { data: members, error: mErr } = await supabase
    .from('problem_cluster_members')
    .select('*')

  console.log('Cluster members count:', members?.length, mErr)
  console.log('Cluster members:', members)

  console.log('Querying submissions...')
  const { data: subs, error: sErr } = await supabase
    .from('problem_submissions')
    .select('*')

  console.log('Submissions count:', subs?.length, sErr)
  if (subs) console.log('Submissions:', subs.map(s => ({ id: s.id, text: s.original_text?.slice(0, 40), channel: s.submission_channel })))

  console.log('Querying AI analysis...')
  const { data: ai, error: aErr } = await supabase
    .from('problem_ai_analysis')
    .select('*')

  console.log('AI Analysis count:', ai?.length, aErr)
  if (ai) console.log('AI:', ai.map(a => ({ id: a.id, submission_id: a.submission_id, domain: a.domain, severity: a.severity_score })))

  console.log('Querying embeddings...')
  const { data: emb, error: eErr } = await supabase
    .from('problem_embeddings')
    .select('*')

  console.log('Embeddings count:', emb?.length, eErr)
}

check()
