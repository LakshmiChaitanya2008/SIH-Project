#!/usr/bin/env node

const BASE_URL = process.env.API_URL || 'http://localhost:5000'

async function runTests() {
  console.log('===========================================================')
  console.log(`🧪 Running SamadhanSetu Backend API Automated Test Suite`)
  console.log(`🎯 Target Server: ${BASE_URL}`)
  console.log('===========================================================\n')

  let passed = 0
  let failed = 0

  async function test(name, fn) {
    try {
      process.stdout.write(`• Testing ${name}... `)
      await fn()
      console.log('✅ PASSED')
      passed++
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`)
      failed++
    }
  }

  // 1. Health
  await test('GET /api/health', async () => {
    const res = await fetch(`${BASE_URL}/api/health`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.status !== 'ok') throw new Error('status not ok')
  })

  // 2. Auth Login (Admin)
  let adminToken = ''
  await test('POST /api/auth/login (Admin)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@samadhansetu.gov.in', password: 'admin123' })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data.token || data.user.role !== 'admin') throw new Error('Invalid token/role')
    adminToken = data.token
  })

  // 3. Auth Profile Check
  await test('GET /api/auth/me (Protected)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.user.role !== 'admin') throw new Error('Role mismatch')
  })

  // 4. Submissions Listing
  await test('GET /api/submissions', async () => {
    const res = await fetch(`${BASE_URL}/api/submissions`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data.submissions) || data.submissions.length === 0) throw new Error('No submissions returned')
  })

  // 5. Create Submission
  let createdSubId = ''
  await test('POST /api/submissions (Civic Intake)', async () => {
    const res = await fetch(`${BASE_URL}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'text',
        raw_text: 'Borewell handpump water in Gumla has brown rusty color and children have stomach ache.',
        district: 'Gumla',
        state: 'Jharkhand'
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data.success || !data.submission.id) throw new Error('Failed to create submission')
    createdSubId = data.submission.id
  })

  // 6. Confirm Submission
  await test('PUT /api/submissions/:id/confirm', async () => {
    const res = await fetch(`${BASE_URL}/api/submissions/${createdSubId}/confirm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        confirmed_domain: 'WATER QUALITY & SANITATION',
        confirmed_impacts: ['Drinking water contamination'],
        confirmed_groups: ['Children']
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data.success || data.submission.status !== 'VERIFIED') throw new Error('Confirmation status mismatch')
  })

  // 7. AI Understanding
  await test('POST /api/ai/understand', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/understand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Irrigation canal wall collapsed in Kanke fields, soil erosion is affecting potato yield.',
        location: 'Ranchi, Jharkhand'
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data.success || !data.understanding.primaryDomain) throw new Error('AI extraction failed')
  })

  // 8. Clusters Listing & Run
  await test('GET /api/clusters & POST /api/clusters/run', async () => {
    const runRes = await fetch(`${BASE_URL}/api/clusters/run`, { method: 'POST' })
    if (!runRes.ok) throw new Error(`HTTP ${runRes.status}`)
    const listRes = await fetch(`${BASE_URL}/api/clusters`)
    const data = await listRes.json()
    if (!data.success || data.clusters.length === 0) throw new Error('Clusters not populated')
  })

  // 9. Challenges Catalog
  await test('GET /api/challenges', async () => {
    const res = await fetch(`${BASE_URL}/api/challenges`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data.success || data.challenges.length === 0) throw new Error('No challenges found')
  })

  // 10. Teams & Proposals
  await test('GET /api/teams & GET /api/proposals', async () => {
    const tRes = await fetch(`${BASE_URL}/api/teams`)
    const pRes = await fetch(`${BASE_URL}/api/proposals`)
    if (!tRes.ok || !pRes.ok) throw new Error('Failed to retrieve teams/proposals')
  })

  // 11. Projects & Milestones Progress
  await test('GET /api/projects & PUT /api/projects/milestone/:id', async () => {
    const projRes = await fetch(`${BASE_URL}/api/projects`)
    const projData = await projRes.json()
    if (!projData.projects || projData.projects.length === 0) throw new Error('No projects found')

    const milestoneId = projData.projects[0].milestones[1]?.id
    if (milestoneId) {
      const mRes = await fetch(`${BASE_URL}/api/projects/milestone/${milestoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', evidence_url: 'https://storage.samadhansetu.in/evidence/lab_test.pdf' })
      })
      if (!mRes.ok) throw new Error('Failed to update milestone')
    }
  })

  // 12. Dashboard Metrics
  await test('GET /api/dashboard', async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data.metrics || typeof data.metrics.totalSubmissions !== 'number') throw new Error('Metrics missing')
  })

  console.log('\n===========================================================')
  console.log(`📊 Automated Test Results: ${passed} Passed, ${failed} Failed`)
  console.log('===========================================================')

  if (failed > 0) process.exit(1)
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err)
  process.exit(1)
})
