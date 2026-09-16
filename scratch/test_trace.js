import fs from 'fs'
import path from 'path'
import handler from '../api/admin/trace.js'

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

async function test() {
  const req = {
    method: 'GET',
    query: { id: '00000000-0000-0000-0002-000000000001' }
  }
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v },
    status(c) { this.statusCode = c; return this },
    json(data) {
      console.log('STATUS:', this.statusCode)
      console.log('TRACE STAGES COUNT:', data.trace?.length)
      console.log('STAGES SUMMARY:')
      data.trace?.forEach(st => {
        console.log(`  Stage ${st.stage_number}: ${st.title} -> ${st.status} (${st.stakeholder})`)
      })
    },
    end() {}
  }

  await handler(req, res)
}

test()
