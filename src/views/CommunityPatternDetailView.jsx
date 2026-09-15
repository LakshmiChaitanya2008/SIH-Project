import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { api } from '../lib/api'

export default function CommunityPatternDetailView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const activePatternDetail = useSelector(s => s.app.activePatternDetail)
  const communityPatterns = useSelector(s => s.app.communityPatterns) || []

  const [pattern, setPattern] = useState(activePatternDetail || communityPatterns.find(p => p.id === id) || null)
  const [loading, setLoading] = useState(!pattern)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadDetail() {
      if (!pattern && id) {
        setLoading(true)
        setError(null)
        try {
          const res = await api.getCluster(id)
          const fetched = res?.clusters?.[0]
          if (fetched) {
            setPattern(fetched)
          } else {
            setError(`Pattern ${id} not found.`)
          }
        } catch (err) {
          console.warn('[Pattern Detail Error]:', err.message)
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
    }
    loadDetail()
  }, [id, pattern])

  const current = pattern || {
    id: 'PATTERN-DEMO',
    title: 'Water Quality & Public Health Concern',
    primary_domain: 'Water Quality & Sanitation',
    problem_count: 3,
    emergence_score: 85,
    locations: ['Gumla', 'Latehar'],
    description: 'Multiple community observations indicate recurring concerns related to drinking water quality, discolouration, and potential health impacts.',
    members: [
      { district: 'Gumla, Jharkhand', text: 'The water from our handpump has become yellow and leaves rust stain.' },
      { district: 'Latehar, Jharkhand', text: 'Many children have stomach problems after drinking village water.' },
      { district: 'Gumla, Jharkhand', text: 'We have to walk far because the nearby open water well is contaminated.' }
    ]
  }

  const memberList = current.members || current.signals || []

  return (
    <main className="flex-grow pt-8 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="mb-8">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-sm font-semibold transition-colors group cursor-pointer"
          onClick={() => navigate('/community/patterns')}
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span> Back to Community Patterns
        </button>
      </div>

      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
          <p className="text-sm font-bold text-brand-indigo">Loading pattern details...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-error">error</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-outline-variant/70 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-brand-teal text-white text-xs font-bold uppercase tracking-wider">
                Emerging Community Pattern
              </span>
              <span className="text-xs font-bold text-brand-violet font-mono bg-brand-violet/10 px-2.5 py-0.5 rounded-full">
                {current.problem_count || memberList.length} Related Signals Linked
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Emergence Score: {current.emergence_score || 85}/100
              </span>
            </div>

            <h1 className="font-display-lg text-brand-indigo text-3xl md:text-4xl font-extrabold leading-tight">
              {current.title || current.name}
            </h1>

            <p className="font-body-lg text-on-surface-variant text-base leading-relaxed">
              {current.description || current.summary}
            </p>

            <div className="pt-4 border-t border-outline-variant/40">
              <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-widest block mb-3">
                PATTERN LIFECYCLE STAGE
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase">
                <div className="p-2 rounded-xl bg-surface-container-low text-brand-teal border border-brand-teal/20">
                  ✓ 1. Signals Intake
                </div>
                <div className="p-2 rounded-xl bg-brand-teal text-white shadow-xs">
                  ✓ 2. Pattern Clustered
                </div>
                <div className="p-2 rounded-xl bg-brand-violet/10 text-brand-violet border border-brand-violet/20 animate-pulse">
                  ● 3. Pending Mentor Review
                </div>
                <div className="p-2 rounded-xl bg-surface-container-low text-outline opacity-60">
                  4. Challenge Formation
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-outline-variant/70 shadow-sm space-y-6">
            <div className="text-xs font-bold text-brand-teal uppercase tracking-widest mb-6">
              CONNECTED COMMUNITY OBSERVATIONS ({memberList.length})
            </div>

            <div className="space-y-4">
              {memberList.map((sig, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/50">
                  <div className="w-8 h-8 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="space-y-1 flex-grow">
                    <div className="text-xs font-bold text-brand-indigo flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-brand-teal">location_on</span>
                      <span>{sig.district || sig.location?.label || sig.location || 'Gumla, Jharkhand'}</span>
                      {sig.similarity_score && (
                        <span className="text-[10px] font-mono text-brand-violet ml-auto">
                          Sim: {Math.round(sig.similarity_score * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-on-surface italic leading-relaxed">
                      "{sig.text || sig.original_text || sig.description}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-brand-indigo/5 border border-brand-indigo/20 space-y-2">
              <span className="text-[10px] font-bold text-brand-violet uppercase tracking-widest block">
                WHAT MAY BE CONNECTING THEM?
              </span>
              <div className="font-headline-sm text-brand-indigo font-bold text-lg">
                {current.primary_domain || current.primaryDomain}
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                These reports describe distinct individual experiences from different hamlets, but together they point toward a shared community issue across {(current.locations || ['Gumla']).join(', ')}.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex items-center gap-2 border border-outline-variant/30">
              <span className="material-symbols-outlined text-brand-teal text-base">shield</span>
              <span>All signal descriptions are completely anonymized. Citizen privacy is strictly protected.</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
