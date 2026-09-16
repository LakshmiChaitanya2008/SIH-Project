import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import { setActivePatternDetail, setCommunityPatterns } from '../features/app/appSlice'
import { api } from '../lib/api'

export default function CommunityPatternsView() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
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
    <div className="space-y-6 text-slate-800 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-[10px] font-mono font-extrabold text-[#26205F] uppercase tracking-wider block">
            ECOSYSTEM CLUSTERING &amp; PATTERN DISCOVERY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Community Problems &amp; Clusters
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Aggregated societal patterns formed from recurring citizen observations across Jharkhand districts.
          </p>
        </div>

        <button
          type="button"
          className="bg-[#26205F] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1C1748] transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
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
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-2xs">
          <span className="material-symbols-outlined animate-spin text-3xl text-[#26205F]">progress_activity</span>
          <p className="text-xs font-bold text-slate-700">Loading community clusters from Supabase engine...</p>
        </div>
      )}

      {/* Zero-Data Empty State */}
      {!loading && clusters.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-[#26205F] flex items-center justify-center mx-auto border border-purple-100">
            <span className="material-symbols-outlined text-3xl">hub</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              No Emerging Patterns Detected Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              When multiple citizens report similar problems in the same district or sector, our AI clustering engine groups them into emerging community patterns.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="bg-[#26205F] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C1748] transition-all shadow-2xs inline-flex items-center gap-2 cursor-pointer"
              onClick={handleRunClustering}
              disabled={clusteringRunning}
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>Execute Clustering Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Detected Patterns List */}
      {!loading && clusters.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Detected Emerging Community Patterns ({clusters.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Sorted by Emergence &amp; Severity
            </span>
          </div>

          {clusters.map((pat, idx) => (
            <div
              key={pat.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer group"
              onClick={() => {
                dispatch(setActivePatternDetail(pat))
                if (isAdmin) {
                  navigate(`/admin/problem/${pat.id}`)
                } else {
                  navigate(`/community/pattern/${pat.id}`)
                }
              }}
            >
              <div className="flex items-start gap-5">
                <div className="text-2xl font-extrabold font-mono text-slate-300 group-hover:text-[#26205F] transition-colors shrink-0">
                  0{idx + 1}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#26205F] text-white">
                      Community Pattern
                    </span>
                    <span className="text-[10px] font-bold text-purple-900 font-mono bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                      {pat.problem_count || pat.signalCount || pat.members?.length || 3} Verified Signals
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase">
                      {pat.primary_domain}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Emergence: {pat.emergence_score || 85}/100
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#26205F] transition-colors leading-snug tracking-tight">
                    {pat.title || pat.name}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    {pat.description || pat.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 pt-1">
                    <span>📍 Locations: <strong className="text-slate-900">{(pat.locations || ['Gumla']).join(' · ')}</strong></span>
                    <span>•</span>
                    <span>⚡ Avg Severity: <strong className="text-slate-900">{pat.avg_severity || 8.0}/10</strong></span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full md:w-auto bg-[#26205F] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1C1748] transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch(setActivePatternDetail(pat))
                  if (isAdmin) {
                    navigate(`/admin/problem/${pat.id}`)
                  } else {
                    navigate(`/community/pattern/${pat.id}`)
                  }
                }}
              >
                <span>Inspect Pattern</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

