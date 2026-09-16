import Groq from 'groq-sdk'
import { config } from '../config.js'

let groqClient = null
if (config.groqApiKey && config.groqApiKey !== 'your_groq_api_key_here') {
  try {
    groqClient = new Groq({ apiKey: config.groqApiKey })
  } catch (e) {
    console.warn('[Server AI] Groq client init failed:', e.message)
  }
}

export const SYSTEM_PROMPT = `You are the Civic Intelligence Engine of SamadhanSetu, India's civic innovation platform.
Analyze civic problem complaints submitted by citizens (in English, Hindi, or vernacular languages).
Always return ONLY a valid, raw JSON object matching this exact schema:
{
  "primaryDomain": "WATER QUALITY & SANITATION" | "AGRICULTURE & RURAL LIVELIHOOD" | "HEALTHCARE & PUBLIC HEALTH" | "RURAL INFRASTRUCTURE & CONNECTIVITY" | "RENEWABLE ENERGY & POWER" | "COMMUNITY SAFETY & DISASTER",
  "relatedDomains": ["string"],
  "issueSummary": "Concise 1-sentence engineering summary of the core technical failure",
  "affectedGroups": ["string"],
  "possibleImpacts": ["string"],
  "severity": "low" | "medium" | "high" | "critical",
  "entities": {
    "locations": ["string"],
    "infrastructure": ["string"],
    "symptoms": ["string"]
  }
}`

export async function understandCivicIssue(text, location = 'Jharkhand, India') {
  if (!text || typeof text !== 'string' || text.trim().length < 3) {
    throw new Error('Valid complaint text (min 3 chars) is required')
  }

  // 1. Try Groq LPU if configured
  if (groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({
        model: config.groqModel || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Complaint: "${text}"\nGeographic Location: "${location}"` }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
      const parsed = JSON.parse(completion.choices[0].message.content)
      const severityScoreMap = { low: 3.0, medium: 6.0, high: 8.0, critical: 9.5 }
      return {
        ...parsed,
        severityScore: severityScoreMap[parsed.severity] || 6.0,
        ai_provider: 'groq',
        ai_model: config.groqModel || 'llama-3.3-70b-versatile',
        processed_at: new Date().toISOString()
      }
    } catch (err) {
      console.warn('[Server AI] Groq call failed, falling back to rule engine:', err.message)
    }
  }

  // 2. Deterministic Heuristic Fallback
  return parseDeterministicRules(text, location)
}

export function parseDeterministicRules(text, location) {
  const lower = (text || '').toLowerCase()
  let primaryDomain = 'WATER QUALITY & SANITATION'
  let relatedDomains = ['HEALTHCARE & PUBLIC HEALTH']
  let issueSummary = 'Observed water quality variation or contamination risk in community water source.'
  let affectedGroups = ['Local Families', 'Children']
  let possibleImpacts = ['Drinking water contamination', 'Waterborne illness risk']
  let severity = 'high'
  let severityScore = 8.0

  if (lower.includes('road') || lower.includes('bridge') || lower.includes('submerge') || lower.includes('connectivity') || lower.includes('transport')) {
    primaryDomain = 'RURAL INFRASTRUCTURE & CONNECTIVITY'
    relatedDomains = ['PUBLIC SAFETY', 'MONSOON ACCESS']
    issueSummary = 'Road, bridge, or culvert accessibility disruption during seasonal weather.'
    affectedGroups = ['Commuters', 'School Students', 'Local Farmers']
    possibleImpacts = ['Isolated village connectivity', 'Delayed emergency transit']
    severity = 'medium'
    severityScore = 6.0
  } else if (lower.includes('crop') || lower.includes('farmer') || lower.includes('canal') || lower.includes('soil') || lower.includes('paddy')) {
    primaryDomain = 'AGRICULTURE & RURAL LIVELIHOOD'
    relatedDomains = ['SOIL DEGRADATION', 'MONSOON DRAINAGE']
    issueSummary = 'Agricultural damage, irrigation channel siltation, or fast-spreading crop disease.'
    affectedGroups = ['Smallholder Farmers', 'Agricultural Laborers']
    possibleImpacts = ['Severe crop yield loss', 'Farmland erosion']
    severity = 'high'
    severityScore = 7.5
  } else if (lower.includes('doctor') || lower.includes('hospital') || lower.includes('medicine') || lower.includes('fever') || lower.includes('health') || lower.includes('sick')) {
    primaryDomain = 'HEALTHCARE & PUBLIC HEALTH'
    relatedDomains = ['EPIDEMIC PREVENTION', 'CLEAN WATER']
    issueSummary = 'Healthcare service disruption or community health symptoms in local hamlets.'
    affectedGroups = ['Children', 'Elderly Villagers', 'Mothers']
    possibleImpacts = ['Public health outbreak risk', 'Urgent medical supply deficit']
    severity = 'critical'
    severityScore = 9.0
  }

  return {
    primaryDomain,
    relatedDomains,
    issueSummary,
    affectedGroups,
    possibleImpacts,
    severity,
    severityScore,
    entities: {
      locations: [location || 'Gumla, Jharkhand'],
    },
    ai_provider: 'deterministic-rule-engine',
    ai_model: 'heuristic-v1',
    processed_at: new Date().toISOString()
  }
}

export async function generateEmbedding(text) {
  // Deterministic 768-dim hash-seeded vector if Gemini key is not provided
  const dim = 768
  const vec = new Array(dim).fill(0)
  const clean = (text || '').toLowerCase().trim()
  
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i)
    const idx = (code * 31 + i * 17) % dim
    vec[idx] += (code / 255.0) - 0.5
  }

  // Normalize vector to unit length
  let normSq = 0
  for (let i = 0; i < dim; i++) normSq += vec[i] * vec[i]
  const norm = Math.sqrt(normSq) || 1.0
  for (let i = 0; i < dim; i++) vec[i] = Math.round((vec[i] / norm) * 10000) / 10000

  return vec
}
