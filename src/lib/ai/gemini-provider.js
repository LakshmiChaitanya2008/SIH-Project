import { AIProvider } from './provider.js'
import { CIVIC_UNDERSTANDING_SYSTEM_PROMPT, buildCivicUserPrompt } from './prompts.js'

export class GeminiProvider extends AIProvider {
  constructor() {
    const envModel = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_MODEL) ||
                     (typeof process !== 'undefined' && process.env?.GEMINI_MODEL)
    super('gemini', envModel || 'gemini-1.5-flash')

    const apiKey = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_GEMINI_API_KEY || import.meta.env?.GEMINI_API_KEY)) ||
                   (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment')
    }
    this.apiKey = apiKey
  }

  async understand(text, location = 'Jharkhand, India') {
    const userPrompt = buildCivicUserPrompt(text, location)

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: CIVIC_UNDERSTANDING_SYSTEM_PROMPT }]
        },
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      })
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: { message: response.statusText } }))
      throw new Error(`Gemini API error (${response.status}): ${err?.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
    return this.parseJsonSafely(rawText, text, location)
  }
}
