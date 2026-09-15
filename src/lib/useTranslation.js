import { useSelector, useDispatch } from 'react-redux'
import { setLanguage as setLangAction } from '../features/app/appSlice'
import { translations } from './translations'

/**
 * Derives a clean, human-readable Title Case fallback from a missing translation key string.
 * Example: 'nav.howItWorks' -> 'How It Works'
 * Example: 'citizen.dashboard.recentActivities.0.title' -> 'Title'
 */
function formatKeyFallback(keyPath) {
  if (!keyPath || typeof keyPath !== 'string') return ''
  
  const parts = keyPath.split('.')
  // Filter out numeric indices e.g. '0'
  const nonNumeric = parts.filter(p => !/^\d+$/.test(p))
  const lastPart = nonNumeric[nonNumeric.length - 1] || parts[parts.length - 1] || keyPath
  
  // Convert camelCase or kebab_case to Title Case
  return lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim()
}

export function useTranslation() {
  const dispatch = useDispatch()
  const currentLang = useSelector((state) => state.app.selectedLanguage) || 'en'

  const t = (keyPath, params = {}) => {
    if (!keyPath) return ''

    const keys = String(keyPath).split('.')
    
    // 1. Look up in current language
    let res = translations[currentLang]
    for (const k of keys) {
      if (res !== undefined && res !== null && (typeof res === 'object' || Array.isArray(res)) && k in res) {
        res = res[k]
      } else {
        res = undefined
        break
      }
    }

    // 2. Fall back to English if missing in target language
    if (res === undefined && currentLang !== 'en') {
      let fallbackRes = translations['en']
      for (const k of keys) {
        if (fallbackRes !== undefined && fallbackRes !== null && (typeof fallbackRes === 'object' || Array.isArray(fallbackRes)) && k in fallbackRes) {
          fallbackRes = fallbackRes[k]
        } else {
          fallbackRes = undefined
          break
        }
      }
      res = fallbackRes
    }

    // 3. Safe fallback if missing in both: NEVER render raw translation key path!
    if (res === undefined || res === null) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Missing translation key: "${keyPath}" for language "${currentLang}"`)
      }
      res = formatKeyFallback(keyPath)
    }

    // If result is an object or array (not a string), return as is
    if (typeof res !== 'string') {
      return res
    }

    // 4. Interpolate parameters e.g. {name}, {{name}}, {count}
    let interpolated = res
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((paramKey) => {
        const val = params[paramKey]
        if (val !== undefined && val !== null) {
          interpolated = interpolated
            .replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), val)
            .replace(new RegExp(`\\{${paramKey}\\}`, 'g'), val)
        }
      })
    }

    return interpolated
  }

  const setLanguage = (langCode) => {
    dispatch(setLangAction(langCode))
  }

  return {
    t,
    language: currentLang,
    setLanguage
  }
}
