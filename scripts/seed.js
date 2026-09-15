#!/usr/bin/env node
import seedHandler from '../api/admin/seed.js'
import resetHandler from '../api/admin/reset.js'

function createMockRes() {
  let statusCode = 200
  let resData = null
  const res = {
    setHeader: () => {},
    status: (code) => { statusCode = code; return res },
    json: (data) => { resData = data; return res },
    end: () => res,
    getStatusCode: () => statusCode,
    getData: () => resData,
  }
  return res
}

async function main() {
  const args = process.argv.slice(2)
  const isResetOnly = args.includes('--reset') || args.includes('-r')

  console.log('===========================================================')
  console.log('SAMADHANSETU CLI DEMO DATA MANAGEMENT')
  console.log('===========================================================')

  if (isResetOnly) {
    console.log('\n🗑️  Executing RESET of transactional demonstration data...')
    const res = createMockRes()
    await resetHandler({ method: 'POST' }, res)
    const data = res.getData()
    if (res.getStatusCode() === 200) {
      console.log('✅ ' + data.message)
      console.log('\nTable Status:')
      for (const [tbl, count] of Object.entries(data.verification || {})) {
        console.log(`  - ${tbl}: ${count} rows`)
      }
    } else {
      console.error('❌ Reset failed:', data?.error)
      process.exit(1)
    }
  } else {
    console.log('\n⚡ Executing SEED of baseline SIH demonstration dataset...')
    const res = createMockRes()
    await seedHandler({ method: 'POST' }, res)
    const data = res.getData()
    if (res.getStatusCode() === 200) {
      console.log('✅ ' + data.message)
      console.log('\nSeeded Counts:')
      for (const [entity, count] of Object.entries(data.seeded_counts || {})) {
        console.log(`  - ${entity}: ${count}`)
      }
      console.log(`  - Playable Voice Recording URL: ${data.audio_url}`)
      console.log('\n🎉 Demonstration environment is now presentation-ready!')
    } else {
      console.error('❌ Seeding failed:', data?.error)
      process.exit(1)
    }
  }
}

main().catch((err) => {
  console.error('❌ CLI Execution Exception:', err)
  process.exit(1)
})
