import { AIProvider } from './provider.js'
import { CIVIC_UNDERSTANDING_SYSTEM_PROMPT, buildCivicUserPrompt } from './prompts.js'

export class GroqProvider extends AIProvider {
  constructor() {
    const envModel = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_MODEL) ||
                     (typeof process !== 'undefined' && process.env?.GROQ_MODEL)
    super('groq', envModel || 'llama-3.3-70b-versatile')

    const apiKey = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_GROQ_API_KEY || import.meta.env?.GROQ_API_KEY)) ||
                   (typeof process !== 'undefined' && process.env?.GROQ_API_KEY)
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured in environment')
    }
    this.apiKey = apiKey
  }

  async understand(text, location = 'Jharkhand, India') {
    const userPrompt = buildCivicUserPrompt(text, location)

    const messages = [
      { role: 'system', content: CIVIC_UNDERSTANDING_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: { message: response.statusText } }))
      throw new Error(`Groq API error (${response.status}): ${err?.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content
    return this.parseJsonSafely(rawContent, text, location)
  }
}
