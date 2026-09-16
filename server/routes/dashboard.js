import { Router } from 'express'
import { store } from '../db/store.js'

const router = Router()

// GET /api/dashboard
router.get('/', (req, res) => {
  const activeProjects = store.projects.filter(p => p.status === 'ACTIVE').length
  const completedProjects = store.projects.filter(p => p.status === 'COMPLETED').length
  const activeChallenges = store.challenges.filter(c => c.status === 'OPEN' || c.status === 'MATCHING').length

  return res.json({
    success: true,
    metrics: {
      newRequests: Math.max(1, store.clusters.length),
      pending: store.clusters.length,
      active: activeChallenges + activeProjects,
      totalSubmissions: store.submissions.length,
      awaitingReview: Math.max(1, store.clusters.length),
      underEvaluation: 1,
      activeProjects,
      deployed: completedProjects,
    },
    recentClusters: store.clusters.slice(0, 5).map(c => ({
      id: c.id,
      title: c.name || c.title,
      description: c.description,
      primary_domain: c.primary_domain,
      problem_count: c.problem_count,
      avg_severity: c.avg_severity,
      emergence_score: c.emergence_score
    })),
    timestamp: new Date().toISOString()
  })
})

// POST /api/dashboard/seed & POST /api/admin/seed
router.post(['/seed', '/admin/seed'], (req, res) => {
  store.reset()
  return res.json({
    success: true,
    message: 'Baseline SIH demonstration dataset successfully seeded!',
    seeded_counts: {
      submissions: store.submissions.length,
      clusters: store.clusters.length,
      challenges: store.challenges.length,
      teams: store.teams.length,
      projects: store.projects.length
    }
  })
})

// POST /api/dashboard/reset & POST /api/admin/reset
router.post(['/reset', '/admin/reset'], (req, res) => {
  store.reset()
  return res.json({
    success: true,
    message: 'Demonstration and test data cleanly reset.',
    all_clean: true
  })
})

export default router
