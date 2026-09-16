import { api } from '../src/lib/api.js'

async function runTests() {
  console.log('--- Starting Client API Verification Tests ---\n')
  let passed = 0
  let total = 0

  function assert(condition, message) {
    total++
    if (condition) {
      console.log(`✅ [PASS] ${message}`)
      passed++
    } else {
      console.error(`❌ [FAIL] ${message}`)
      process.exitCode = 1
    }
  }

  // 1. Health
  const health = await api.health()
  assert(health.status === 'ok' && health.service.includes('Client'), 'api.health() returns valid status')

  // 2. AI Status
  const aiStatus = await api.aiStatus()
  assert(aiStatus.status === 'ok' && aiStatus.llm && aiStatus.embeddings, 'api.aiStatus() returns LLM and embedding info')

  // 3. Understand Issue
  const understand = await api.understand({
    text: 'Borewell water in Gumla has yellow tint and foul smell. Children are falling sick.',
    location: 'Gumla, Jharkhand',
    autoEmbed: true,
  })
  assert(
    understand.success &&
    understand.understanding?.primaryDomain &&
    understand.embedding?.length === 768,
    `api.understand() extracts domain (${understand.understanding?.primaryDomain}) and 768-dim embedding`
  )

  // 4. Vector Embedding
  const embed = await api.embed({ text: 'Rural road submerged by monsoon flood' })
  assert(embed.success && embed.embedding?.length === 768, 'api.embed() produces 768-dimensional normalized vector')

  // 5. Submissions List
  const subs = await api.getSubmissions()
  assert(Array.isArray(subs.submissions) && subs.submissions.length > 0, `api.getSubmissions() returns ${subs.submissions.length} submissions`)

  // 6. Create Submission
  const created = await api.createSubmission({
    raw_text: 'Bridge on river Sankh in Gumla broken due to heavy rain. Commuters stranded.',
    district: 'Gumla',
    state: 'Jharkhand',
  })
  assert(
    created.success &&
    created.submission?.ref_id?.startsWith('SS-') &&
    created.submission?.primary_domain.includes('Infrastructure'),
    `api.createSubmission() creates submission with Ref ID ${created.submission?.ref_id} in domain ${created.submission?.primary_domain}`
  )

  // 7. Confirm Submission
  const confirmed = await api.confirmSubmission({
    submission_id: created.submission.id,
    confirmed_domain: created.submission.primary_domain,
    confirmed_impacts: ['Transit disruption'],
    confirmed_groups: ['Commuters'],
  })
  assert(confirmed.success && confirmed.submission?.status === 'VERIFIED', 'api.confirmSubmission() marks status as VERIFIED')

  // 8. Clusters List
  const clusters = await api.getClusters()
  assert(Array.isArray(clusters.clusters) && clusters.clusters.length > 0, `api.getClusters() returns ${clusters.clusters.length} clusters`)

  // 9. Run Clustering
  const runCluster = await api.runClustering()
  assert(runCluster.success && Array.isArray(runCluster.clusters), `api.runClustering() executed in-browser, formed clusters: ${runCluster.clusters.length}`)

  // 10. Validate Cluster
  const valCluster = await api.validateCluster({
    cluster_id: clusters.clusters[0].id,
    action: 'VALIDATE',
    measurable_objectives: 'Deploy pilot water filter in Gumla primary school within 30 days',
  })
  assert(valCluster.success && valCluster.verification_status === 'VERIFIED', 'api.validateCluster() validates cluster and generates specification')

  // 11. Challenges List & Get
  const challenges = await api.getChallenges()
  assert(Array.isArray(challenges.challenges) && challenges.challenges.length > 0, `api.getChallenges() returns ${challenges.challenges.length} challenges`)
  const singleChallenge = await api.getChallenge(challenges.challenges[0].id)
  assert(singleChallenge && singleChallenge.id === challenges.challenges[0].id, 'api.getChallenge(id) retrieves matching challenge')

  // 12. Teams List
  const teams = await api.getTeams()
  assert(Array.isArray(teams.teams) && teams.teams.length > 0, `api.getTeams() returns ${teams.teams.length} teams`)

  // 13. Proposals List
  const proposals = await api.getProposals()
  assert(Array.isArray(proposals.proposals) && proposals.proposals.length > 0, `api.getProposals() returns ${proposals.proposals.length} proposals`)

  // 14. Projects List & Milestone Update
  const projects = await api.getProjects()
  assert(Array.isArray(projects.projects) && projects.projects.length > 0, `api.getProjects() returns ${projects.projects.length} projects`)
  const activeProj = projects.projects[0]
  if (activeProj.milestones?.[0]) {
    const mileUpdate = await api.updateMilestone({
      id: activeProj.milestones[0].id,
      status: 'COMPLETED',
    })
    assert(mileUpdate.success && mileUpdate.status === 'COMPLETED', 'api.updateMilestone() successfully updates milestone progress')
  }

  // 15. Admin Dashboard
  const dashboard = await api.getDashboard()
  assert(
    dashboard.success &&
    typeof dashboard.metrics?.totalSubmissions === 'number' &&
    Array.isArray(dashboard.recentClusters),
    `api.getDashboard() aggregates metrics (Total Submissions: ${dashboard.metrics?.totalSubmissions})`
  )

  // 16. Demo Reset and Seed
  const resetRes = await api.resetDemo()
  assert(resetRes.success && resetRes.all_clean, 'api.resetDemo() successfully resets demo data')

  const seedRes = await api.seedDemo()
  assert(seedRes.success && seedRes.seeded_counts?.submissions > 0, `api.seedDemo() seeds baseline dataset (${seedRes.seeded_counts?.submissions} submissions)`)

  console.log(`\n=========================================`)
  console.log(`Test Results: ${passed} / ${total} tests passed`)
  console.log(`=========================================`)
}

runTests().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
