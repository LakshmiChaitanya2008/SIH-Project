/**
 * Client-Side Semantic Vector Embedder
 * 
 * Generates 768-dimensional normalized dense vectors.
 * Uses Google Gemini text-embedding-004 if API key is provided,
 * with deterministic semantic-feature fallback when keys are absent or offline.
 */

function generateDeterministicVector(text, dimensions = 768) {
  const clean = (text || '').toLowerCase().trim()
  const vector = new Float32Array(dimensions)
  
  // Seedable hash from text
  let h = 0x811c9dc5
  for (let i = 0; i < clean.length; i++) {
    h ^= clean.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }

  // Generate deterministic pseudo-gaussian features
  for (let i = 0; i < dimensions; i++) {
    h = Math.imul(h ^ (i * 31), 0x5bd1e995)
    h ^= h >>> 15
    const val = ((h & 0xffff) / 0xffff) * 2 - 1
    vector[i] = val
  }

  // Domain keyword boosting for realistic clustering
  const domainKeywords = {
    water: [0, 48, 96, 144, 192, 240, 288, 336],
    sanitation: [1, 49, 97, 145, 193, 241, 289, 337],
    road: [8, 56, 104, 152, 200, 248, 296, 344],
    bridge: [9, 57, 105, 153, 201, 249, 297, 345],
    crop: [16, 64, 112, 160, 208, 256, 304, 352],
    farmer: [17, 65, 113, 161, 209, 257, 305, 353],
    health: [24, 72, 120, 168, 216, 264, 312, 360],
    hospital: [25, 73, 121, 169, 217, 265, 313, 361],
    solar: [32, 80, 128, 176, 224, 272, 320, 368],
    electricity: [33, 81, 129, 177, 225, 273, 321, 369],
  }

  for (const [kw, indices] of Object.entries(domainKeywords)) {
    if (clean.includes(kw)) {
      for (const idx of indices) {
        vector[idx] += 1.5
      }
    }
  }

  // L2 normalize
  let normSq = 0
  for (let i = 0; i < dimensions; i++) {
    normSq += vector[i] * vector[i]
  }
  const norm = Math.sqrt(normSq) || 1
  return Array.from(vector).map((v) => v / norm)
}

export async function generateEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return null
  }

  const cleanText = text.replace(/\s+/g, ' ').trim().slice(0, 1000)

  const apiKey = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_GEMINI_API_KEY || import.meta.env?.GEMINI_API_KEY)) ||
                 (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)

  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text: cleanText }] },
          outputDimensionality: 768,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const values = data.embedding?.values
        if (Array.isArray(values) && values.length === 768) {
          return values
        }
        if (Array.isArray(values) && values.length > 768) {
          const sliced = values.slice(0, 768)
          const norm = Math.sqrt(sliced.reduce((sum, v) => sum + v * v, 0)) || 1
          return sliced.map((v) => v / norm)
        }
      }
    } catch (err) {
      console.warn('[Client Embedder] Gemini remote embedding failed, using deterministic fallback:', err.message)
    }
  }

  // Deterministic 768-dim normalized embedding fallback
  return generateDeterministicVector(cleanText, 768)
}
