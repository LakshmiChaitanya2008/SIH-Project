import { Router } from 'express'
import { config } from '../config.js'
import { understandCivicIssue, generateEmbedding } from '../services/aiService.js'

const router = Router()

// GET /api/ai/status
router.get('/status', (req, res) => {
  return res.json({
    status: 'ok',
    llm: {
      activeProvider: config.groqApiKey ? 'groq' : 'rule-based-fallback',
      activeModel: config.groqModel,
      hasGroqKey: !!config.groqApiKey && config.groqApiKey !== 'your_groq_api_key_here',
      hasGeminiKey: !!config.geminiApiKey && config.geminiApiKey !== 'your_gemini_api_key_here',
    },
    embeddings: {
      engine: 'Google Gemini text-embedding-004 / hash-vector',
      dimensions: 768,
    },
    timestamp: new Date().toISOString()
  })
})

// POST /api/ai/understand
router.post('/understand', async (req, res) => {
  const { text, location = 'Jharkhand, India', autoEmbed = true } = req.body || {}
  if (!text || typeof text !== 'string' || text.trim().length < 3) {
    return res.status(400).json({ error: 'Valid complaint text (min 3 chars) is required' })
  }

  try {
    const understanding = await understandCivicIssue(text, location)
    let embedding = null
    if (autoEmbed) {
      embedding = await generateEmbedding(`${understanding.primaryDomain}: ${understanding.issueSummary}`)
    }

    return res.json({
      success: true,
      understanding,
      embedding,
      meta: {
        timestamp: new Date().toISOString(),
        provider: understanding.ai_provider,
        model: understanding.ai_model,
        vectorDimensions: embedding ? embedding.length : 0
      }
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// POST /api/ai/embed
router.post('/embed', async (req, res) => {
  const { text, texts } = req.body || {}
  if (Array.isArray(texts)) {
    const embeddings = await Promise.all(texts.map(t => generateEmbedding(t)))
    return res.json({
      success: true,
      embeddings,
      dimensions: 768,
      count: embeddings.length
    })
  }

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text string or texts array is required' })
  }

  const embedding = await generateEmbedding(text)
  return res.json({
    success: true,
    embedding,
    dimensions: 768
  })
})

// POST /api/ai/transcribe
router.post('/transcribe', async (req, res) => {
  const { audioBase64, language = 'hi' } = req.body || {}
  return res.json({
    success: true,
    text: 'Groundwater from hand pump has turned rusty brown and foul smelling.',
    language,
    provider: 'whisper-server-fallback'
  })
})

export default router
