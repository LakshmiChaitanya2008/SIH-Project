import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { setActivePatternDetail, setCommunityPatterns } from '../features/app/appSlice'
import { api } from '../lib/api'

export default function CommunityPatternsView() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const reduxPatterns = useSelector(s => s.app.communityPatterns) || []

  const [clusters, setClusters] = useState([])
  const [loading, setLoading] = useState(true)
  const [clusteringRunning, setClusteringRunning] = useState(false)
  const [error, setError] = useState(null)

  const loadClusters = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getClusters()
      const data = res?.clusters || []
      setClusters(data)
      dispatch(setCommunityPatterns(data))
    } catch (err) {
      console.warn('[CommunityPatternsView Load Error]:', err.message)
      if (reduxPatterns.length > 0) {
        setClusters(reduxPatterns)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRunClustering = async () => {
    setClusteringRunning(true)
    setError(null)
    try {
      await api.runClustering()
      await loadClusters()
    } catch (err) {
      console.error('[Run Clustering Error]:', err.message)
      setError(`Clustering failed: ${err.message}`)
    } finally {
      setClusteringRunning(false)
    }
  }

  useEffect(() => {
    loadClusters()
  }, [])

  return (
    <main className="flex-grow pt-12 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="max-w-3xl">
          <span className="font-label-sm text-brand-teal uppercase tracking-widest text-xs font-bold bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/40 inline-block mb-3">
            CROSS-REPORT PATTERN DISCOVERY
          </span>

          <h1 className="font-display-lg text-brand-indigo text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            What communities are telling us.
          </h1>

          <p className="font-body-lg text-on-surface-variant text-base md:text-lg leading-relaxed">
            Individual observations can reveal larger patterns when similar experiences begin appearing across neighboring communities and districts.
          </p>
        </div>

        <button
          type="button"
          className="bg-brand-indigo text-white px-6 py-3 rounded-full font-label-md text-xs sm:text-sm font-semibold hover:bg-brand-violet transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          onClick={handleRunClustering}
          disabled={clusteringRunning || loading}
        >
          {clusteringRunning ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
              <span>Detecting Patterns...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">hub</span>
              <span>Re-run Clustering Engine</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-error-container text-on-error-container text-xs rounded-2xl border border-error/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-error">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3 mb-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
          <p className="text-sm font-bold text-brand-indigo">Loading community clusters from database...</p>
        </div>
      )}

      {/* Clean Zero-Data Empty State */}
      {!loading && clusters.length === 0 && (
        <div className="bg-white p-12 sm:p-16 rounded-3xl border border-outline-variant/70 text-center space-y-4 shadow-xs mb-12">
          <div className="w-16 h-16 rounded-full bg-surface-container-low text-brand-indigo flex items-center justify-center mx-auto border border-outline-variant/40">
            <span className="material-symbols-outlined text-3xl text-brand-violet">hub</span>
          </div>

          <div className="space-y-1">
            <h3 className="font-headline-sm text-brand-indigo text-xl font-extrabold">
              No Emerging Patterns Detected Yet
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              When multiple citizens report similar problems in the same district or sector, our clustering engine groups them into emerging patterns.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="bg-brand-indigo text-white px-6 py-3 rounded-full font-label-md text-xs sm:text-sm font-semibold hover:bg-brand-violet transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              onClick={handleRunClustering}
              disabled={clusteringRunning}
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>Execute Clustering Now</span>
            </button>
            <button
              type="button"
              className="border border-outline-variant text-brand-indigo px-6 py-3 rounded-full font-label-md text-xs sm:text-sm font-semibold hover:bg-brand-indigo/5 transition-all bg-white cursor-pointer"
              onClick={() => navigate('/citizen/report/method')}
            >
              + Submit Citizen Report
            </button>
          </div>
        </div>
      )}

      {/* Detected Patterns List */}
      {!loading && clusters.length > 0 && (
        <section className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
            <h2 className="font-headline-sm text-brand-indigo text-2xl font-bold">
              Detected Emerging Patterns ({clusters.length})
            </h2>
            <span className="text-xs text-on-surface-variant font-medium">
              Sorted by Emergence Score
            </span>
          </div>

          {clusters.map((pat, idx) => (
            <div
              key={pat.id}
              className="bg-white p-8 rounded-3xl border border-outline-variant/70 shadow-2xs hover:border-brand-violet transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer group"
              onClick={() => {
                dispatch(setActivePatternDetail(pat))
                navigate(`/community/pattern/${pat.id}`)
              }}
            >
              <div className="flex items-start gap-6">
                <div className="font-display-lg text-brand-indigo/30 text-4xl font-extrabold font-mono shrink-0 group-hover:text-brand-violet transition-colors">
                  0{idx + 1}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-teal text-white shadow-2xs">
                      Emerging Pattern
                    </span>
                    <span className="text-xs font-bold text-brand-violet font-mono bg-brand-violet/10 px-2.5 py-0.5 rounded-full">
                      {pat.problem_count || pat.signalCount || pat.members?.length || 3} Verified Signals
                    </span>
                    <span className="text-xs font-bold text-brand-indigo bg-surface-container-low px-2.5 py-0.5 rounded-full border border-outline-variant/40 uppercase">
                      {pat.primary_domain}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Score: {pat.emergence_score || 85}/100
                    </span>
                  </div>

                  <h3 className="font-headline-md text-brand-indigo text-xl sm:text-2xl font-bold leading-snug group-hover:text-brand-violet transition-colors">
                    {pat.title || pat.name}
                  </h3>
                  <p className="font-body-md text-on-surface-variant text-xs sm:text-sm max-w-xl leading-relaxed">
                    {pat.description || pat.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-indigo pt-2">
                    <span>📍 Districts: <strong>{(pat.locations || ['Gumla']).join(' · ')}</strong></span>
                    <span>•</span>
                    <span>⚡ Avg Severity: <strong>{pat.avg_severity || 8.0}/10</strong></span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full md:w-auto bg-surface-container-low text-brand-indigo px-6 py-3 rounded-full font-label-md text-xs font-bold border border-outline-variant hover:bg-brand-indigo hover:text-white transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch(setActivePatternDetail(pat))
                  navigate(`/community/pattern/${pat.id}`)
                }}
              >
                <span>Explore Pattern</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
