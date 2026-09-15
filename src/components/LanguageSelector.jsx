import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { setLanguage } from '../features/app/appSlice'

export default function LanguageSelector() {
  const dispatch = useDispatch()
  const { selectedLanguage } = useSelector(s => s.app)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'te', label: 'తెలుగు' }
  ]

  const activeLang = languages.find(l => l.code === selectedLanguage) || languages[0]

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        className="flex items-center gap-2 bg-surface-container-low border border-outline-variant px-3 py-1.5 rounded-full text-xs font-semibold text-brand-indigo hover:border-brand-violet transition-all shadow-xs"
        onClick={() => setOpen(!open)}
      >
        <span className="material-symbols-outlined text-base">language</span>
        <span>{activeLang.label}</span>
        <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl border border-outline-variant shadow-lg z-50 overflow-hidden">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                lang.code === selectedLanguage ? 'bg-brand-indigo text-white font-bold' : 'text-on-surface hover:bg-surface-container-low'
              }`}
              onClick={() => {
                dispatch(setLanguage(lang.code))
                setOpen(false)
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
