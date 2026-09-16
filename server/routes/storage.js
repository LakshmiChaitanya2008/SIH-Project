import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../db/store.js'

const router = Router()

// POST /api/storage/upload
router.post('/upload', (req, res) => {
  const { fileName, fileType, base64Data } = req.body || {}
  const fileId = randomUUID()
  const cleanName = fileName || `evidence_${fileId}.jpg`
  const publicUrl = `/uploads/${fileId}_${cleanName}`

  if (base64Data) {
    store.evidenceFiles.set(fileId, { fileName: cleanName, fileType, base64Data })
  }

  return res.status(201).json({
    success: true,
    fileId,
    url: publicUrl,
    name: cleanName
  })
})

// POST /api/storage/presigned-url
router.post('/presigned-url', (req, res) => {
  const { fileName } = req.body || {}
  const fileId = randomUUID()
  const cleanName = fileName || `evidence_${fileId}.jpg`
  const targetUrl = `/uploads/${fileId}_${cleanName}`

  return res.json({
    uploadUrl: `/api/storage/upload`,
    fileUrl: targetUrl,
    fileId
  })
})

export default router
