import fs from 'fs'
import path from 'path'
import handler from '../api/admin/assign.js'

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

async function testAssign() {
  console.log('Testing ASSIGN action...')
  const reqAssign = {
    method: 'POST',
    body: {
      action: 'ASSIGN',
      cluster_id: '00000000-0000-0000-0002-000000000001',
      university_id: '2b79fc24-8235-48a1-989f-2eee0a4bffc2'
    }
  }
  const resAssign = {
    statusCode: 200,
    setHeader() {},
    status(c) { this.statusCode = c; return this },
    json(data) { console.log('ASSIGN RESPONSE:', this.statusCode, data) }
  }
  await handler(reqAssign, resAssign)

  console.log('\nTesting ACCEPT action...')
  const reqAccept = {
    method: 'POST',
    body: {
      action: 'ACCEPT',
      cluster_id: '00000000-0000-0000-0002-000000000001',
      university_id: '2b79fc24-8235-48a1-989f-2eee0a4bffc2'
    }
  }
  const resAccept = {
    statusCode: 200,
    setHeader() {},
    status(c) { this.statusCode = c; return this },
    json(data) { console.log('ACCEPT RESPONSE:', this.statusCode, data) }
  }
  await handler(reqAccept, resAccept)
}

testAssign()
