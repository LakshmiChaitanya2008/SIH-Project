import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../db/store.js'
import { clusterSubmissions } from '../services/clusterService.js'

const router = Router()

// GET /api/clusters
router.get('/', (req, res) => {
  const { id, domain } = req.query
  let result = [...store.clusters]

  if (id) {
    result = result.filter(c => c.id === id)
  }
  if (domain && domain !== 'ALL') {
    result = result.filter(c => (c.primary_domain || '').toUpperCase().includes(domain.toUpperCase()))
  }

  return res.json({
    success: true,
    clusters: result
  })
})

// GET /api/clusters/:id
router.get('/:id', (req, res) => {
  const found = store.clusters.find(c => c.id === req.params.id)
  if (!found) {
    return res.status(404).json({ error: 'Cluster not found' })
  }
  return res.json(found)
})

// POST /api/clusters/run
router.post('/run', (req, res) => {
  const newClusters = clusterSubmissions(store.submissions)
  if (newClusters.length > 0) {
    store.clusters = [...newClusters, ...store.clusters]
  }

  return res.json({
    success: true,
    clusters: store.clusters,
    stats: {
      totalSubmissions: store.submissions.length,
      clustersFormed: store.clusters.length
    }
  })
})

// POST /api/clusters/:id/validate
router.post('/:id/validate', (req, res) => {
  const { action = 'VALIDATE', measurable_objectives, verified_by } = req.body || {}
  const cluster = store.clusters.find(c => c.id === req.params.id)

  const spec = {
    id: randomUUID(),
    cluster_id: req.params.id,
    title: cluster ? cluster.name : 'Community Problem Specification',
    domain: cluster ? cluster.primary_domain : 'WATER QUALITY & SANITATION',
    location_description: cluster?.district || 'Jharkhand',
    measurable_objectives: measurable_objectives || 'Develop field-deployable community solution prototype',
    target_trl: 3,
    human_verification_status: action.toUpperCase() === 'REJECT' ? 'REJECTED' : 'VERIFIED',
    verified_at: new Date().toISOString(),
    verified_by: verified_by || req.user?.id || 'admin-user'
  }

  return res.json({
    success: true,
    cluster_id: req.params.id,
    verification_status: spec.human_verification_status,
    specification: spec
  })
})

export default router
