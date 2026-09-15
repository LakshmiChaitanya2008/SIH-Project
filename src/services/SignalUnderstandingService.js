import { api } from '../lib/api.js'

/**
 * Signal Understanding Service
 * 
 * Calls the provider-agnostic AI API (/api/ai/understand) powered by Groq Llama 3.3 70B
 * with Google Gemini 2.0 Flash fallback and resilient client-side heuristic rules.
 */

export const SignalUnderstandingService = {
  /**
   * Processes a raw community signal or report draft and extracts structured domain, impacts, and affected groups.
   * @param {Object} signal - The signal object containing description, location, method
   * @param {String} language - Language code ('en', 'hi', 'te')
   * @returns {Promise<Object>} Structured understanding payload
   */
  async understandSignal(signal = {}, language = 'en') {
    const rawText = signal.description || signal.raw_text || ''
    const location = signal.location?.label || signal.location || 'Gumla District, Jharkhand'

    // 1. Try calling the live serverless AI endpoint
    try {
      if (rawText.trim().length >= 3) {
        const response = await api.understand({
          text: rawText,
          location,
          autoEmbed: true,
        })

        if (response?.understanding) {
          return {
            primaryDomain: response.understanding.primaryDomain || 'Water Quality & Sanitation',
            relatedDomains: response.understanding.relatedDomains || ['Public Health'],
            issueSummary: response.understanding.issueSummary || rawText.slice(0, 100),
            affectedGroups: response.understanding.affectedGroups || ['Local Community'],
            possibleImpacts: response.understanding.possibleImpacts || ['Public concern'],
            severity: response.understanding.severity || 'medium',
            entities: response.understanding.entities || {},
            extractedLocation: location,
            confirmedByCitizen: false,
            provider: response.meta?.provider || 'groq',
            model: response.meta?.model || 'llama-3.3-70b-versatile',
            processedAt: new Date().toISOString(),
          }
        }
      }
    } catch (apiErr) {
      console.warn('[SignalUnderstandingService] Live API unavailable, running client fallback:', apiErr.message)
    }

    // 2. Client-Side Heuristic Fallback
    return this.fallbackRules(rawText, location)
  },

  /**
   * Fast client-side fallback rule engine
   */
  fallbackRules(rawText, location) {
    const text = (rawText || '').toLowerCase()

    let primaryDomain = 'Water Quality & Sanitation'
    let relatedDomains = ['Public Health']
    let issueSummary = 'Observed water quality variation or contamination risk.'
    let affectedGroups = ['Children & Local Families']
    let possibleImpacts = ['Drinking water quality risk', 'Community health concern']
    let severity = 'high'

    if (text.includes('road') || text.includes('bridge') || text.includes('rain') || text.includes('transport') || text.includes('submerge')) {
      primaryDomain = 'Rural Infrastructure & Connectivity'
      relatedDomains = ['Public Safety', 'Monsoon Access']
      issueSummary = 'Road or bridge accessibility issues during monsoon rainfall.'
      affectedGroups = ['Commuters', 'School Students', 'Local Farmers']
      possibleImpacts = ['Isolated village connectivity', 'Delayed transport']
      severity = 'medium'
    } else if (text.includes('soil') || text.includes('canal') || text.includes('farmer') || text.includes('crop') || text.includes('paddy')) {
      primaryDomain = 'Agriculture & Irrigation'
      relatedDomains = ['Soil Degradation', 'Monsoon Drainage']
      issueSummary = 'Irrigation canal wall degradation and sediment runoff into fields.'
      affectedGroups = ['Smallholder Farmers', 'Agricultural Laborers']
      possibleImpacts = ['Crop yield loss', 'Farmland soil erosion']
      severity = 'high'
    } else if (text.includes('sick') || text.includes('illness') || text.includes('doctor') || text.includes('hospital') || text.includes('fever')) {
      primaryDomain = 'Healthcare & Public Health'
      relatedDomains = ['Epidemic Prevention', 'Clean Water']
      issueSummary = 'Increased incidence of seasonal health symptoms in the community.'
      affectedGroups = ['Children', 'Elderly Villagers']
      possibleImpacts = ['Waterborne health risk', 'Medical supply demand']
      severity = 'critical'
    }

    return {
      primaryDomain,
      relatedDomains,
      issueSummary,
      affectedGroups,
      possibleImpacts,
      severity,
      extractedLocation: location,
      confirmedByCitizen: false,
      provider: 'client-heuristic-fallback',
      model: 'rule-engine-v1',
      processedAt: new Date().toISOString(),
    }
  },
}
