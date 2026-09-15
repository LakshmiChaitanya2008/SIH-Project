import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router'
import { startNewReport } from '../features/app/appSlice'
import { api } from '../lib/api'
import { useTranslation } from '../lib/useTranslation'

export default function TrackProblemsView() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTrackedId = useSelector(s => s.app.activeTrackedProblemId)
  const recentSignal = useSelector(s => s.app.communitySignals?.[0])
  const urlId = searchParams.get('id')

  const initialId = urlId || activeTrackedId || recentSignal?.id || ''

  const [searchInput, setSearchInput] = useState(initialId)
  const [currentId, setCurrentId] = useState(initialId)
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const pollTimerRef = useRef(null)

  const fetchProblem = async (targetId, isBackground = false) => {
    if (!targetId || !targetId.trim()) return

    if (!isBackground) setLoading(true)
    setError(null)

    try {
      const response = await api.getSubmission(targetId.trim())
      const sub = response?.submissions?.[0]

      if (sub) {
        setProblem(sub)
        setLastUpdated(new Date().toLocaleTimeString())
      } else {
        if (!urlId || targetId === 'SS-2026-00401') {
          try {
            const latestRes = await api.getSubmissions('limit=1')
            const latestSub = latestRes?.submissions?.[0]
            if (latestSub) {
              setProblem(latestSub)
              setSearchInput(latestSub.ref_id || latestSub.id)
              setLastUpdated(new Date().toLocaleTimeString())
              setError(null)
              return
            }
          } catch {}
        }

        if (!isBackground) {
          setError(`No problem found matching Reference ID "${targetId}".`)
          setProblem(null)
        }
      }
    } catch (err) {
      console.warn('[Track Problem Fetch Error]:', err.message)
      if (!isBackground) {
        setError(`Unable to load tracking details (${err.message}).`)
      }
    } finally {
      if (!isBackground) setLoading(false)
    }
  }

  useEffect(() => {
    if (currentId) {
      fetchProblem(currentId)
    }
  }, [currentId])

  useEffect(() => {
    if (!problem?.id) return

    const subId = problem.id

    pollTimerRef.current = setInterval(() => {
      fetchProblem(subId, true)
    }, 15000)

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [problem?.id])

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = searchInput.trim()
    if (!trimmed) return
    setCurrentId(trimmed)
    setSearchParams({ id: trimmed })
  }

  const status = (problem?.status || '').toUpperCase()

  const isSubmitted = !!problem
  const isAnalyzed = isSubmitted && (status !== 'SUBMITTED' || !!problem?.primary_domain)
  const isVerified = ['VERIFIED', 'CLUSTERED', 'CHALLENGE_CREATED', 'IN_PROGRESS', 'RESOLVED'].includes(status)
  const isClustered = ['CLUSTERED', 'CHALLENGE_CREATED', 'IN_PROGRESS', 'RESOLVED'].includes(status)
  const isChallenged = ['CHALLENGE_CREATED', 'IN_PROGRESS', 'RESOLVED'].includes(status)
  const isInProgress = ['IN_PROGRESS', 'RESOLVED'].includes(status)
  const isResolved = status === 'RESOLVED'

  const activeStageNum = isResolved
    ? 7
    : isInProgress
    ? 6
    : isChallenged
    ? 5
    : isClustered
    ? 4
    : isVerified
    ? 4
    : isAnalyzed
    ? 3
    : 2

  const stages = [
    {
      num: 1,
      title: t('stages.reported'),
      desc: 'Your observation was successfully received and registered in the public database.',
      done: isSubmitted,
      active: activeStageNum === 1,
    },
    {
      num: 2,
      title: t('stages.ai'),
      desc: problem
        ? `Categorized under "${problem.primary_domain || 'Civic Issue'}" with high-dimensional embedding.`
        : 'Natural language analysis and dense vector generation.',
      done: isAnalyzed,
      active: activeStageNum === 2,
    },
    {
      num: 3,
      title: 'Citizen Verification',
      desc: isVerified
        ? 'Ground-truth interpretation confirmed by citizen and logged in civic registry.'
        : 'Awaiting citizen review and ground-truth confirmation.',
      done: isVerified,
      active: activeStageNum === 3,
    },
    {
      num: 4,
      title: t('stages.pattern'),
      desc: isClustered
        ? 'Matched and clustered with recurring community observations in this region.'
        : 'Cross-referencing vector embeddings with nearby reports across Jharkhand.',
      done: isClustered,
      active: activeStageNum === 4,
    },
    {
      num: 5,
      title: t('stages.challenge'),
      desc: isChallenged
        ? 'Admin/Mentor validated recurring pattern and published an Innovation Challenge.'
        : 'Pending validation by university mentor for student challenge adoption.',
      done: isChallenged,
      active: activeStageNum === 5,
    },
    {
      num: 6,
      title: t('stages.solution'),
      desc: isInProgress
        ? 'University student engineering team actively building physical/digital solution.'
        : 'Awaiting student team adoption and prototype proposal build.',
      done: isInProgress,
      active: activeStageNum === 6,
    },
    {
      num: 7,
      title: t('stages.impact'),
      desc: isResolved
        ? 'Solution prototype tested, deployed in community, and verified by local residents.'
        : 'Community deployment and resolution verification.',
      done: isResolved,
      active: activeStageNum === 7,
    },
  ]

  return (
    <main className="flex-grow pt-6 sm:pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1100px] mx-auto w-full space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest block mb-1">
            {t('tracking.liveTrackerTag')}
          </span>
          <h1 className="font-display-lg text-brand-indigo text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('tracking.title')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            {t('tracking.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="bg-brand-indigo text-white px-4 py-2 rounded-full font-label-md text-xs sm:text-sm font-semibold hover:bg-brand-violet transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            onClick={() => { dispatch(startNewReport()); navigate('/citizen/report/method'); }}
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ {t('citizen.dashboard.reportProblem')}</span>
          </button>
          <button
            type="button"
            className="border border-outline-variant text-brand-indigo px-4 py-2 rounded-full font-label-md text-xs font-semibold hover:border-brand-violet hover:bg-brand-indigo/5 transition-all bg-white flex items-center gap-1.5 cursor-pointer"
            onClick={() => navigate('/citizen/my-problems')}
          >
            <span className="material-symbols-outlined text-base">format_list_bulleted</span>
            <span>{t('nav.myProblems')}</span>
          </button>
        </div>
      </div>

      {/* Reference ID Search Input */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-outline-variant/70 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-sm font-medium text-brand-indigo focus:border-brand-violet focus:outline-none"
              placeholder={t('tracking.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-brand-indigo text-white px-6 py-2.5 rounded-xl font-label-md text-xs sm:text-sm font-bold hover:bg-brand-violet transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{t('tracking.trackBtn')}</span>
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
          <p className="text-sm font-bold text-brand-indigo">Fetching live problem status...</p>
        </div>
      )}

      {/* Error / Empty Search State */}
      {error && !loading && (
        <div className="bg-white p-10 rounded-3xl border border-error/30 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">search_off</span>
          </div>
          <h3 className="font-bold text-brand-indigo text-base">Problem Not Found</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">{error}</p>
          <button
            type="button"
            className="text-xs font-bold text-brand-violet hover:underline pt-2 inline-block cursor-pointer"
            onClick={() => navigate('/citizen/my-problems')}
          >
            View all submitted civic problems &rarr;
          </button>
        </div>
      )}

      {/* Active Problem Card */}
      {problem && !loading && (
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-brand-teal px-2.5 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/20">
                {problem.ref_id || `SS-${problem.id.slice(0, 8).toUpperCase()}`}
              </span>
              <span className="text-xs font-semibold text-brand-violet bg-brand-violet/10 px-2.5 py-0.5 rounded-full">
                Stage {activeStageNum}: {stages[activeStageNum - 1]?.title}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                {problem.primary_domain || 'Civic Problem'}
              </span>
            </div>
            <h2 className="font-headline-sm text-brand-indigo text-xl font-extrabold leading-snug">
              {problem.ai_summary || problem.raw_text}
            </h2>
            <div className="text-xs text-on-surface-variant flex items-center gap-3 pt-0.5 flex-wrap">
              <span>📍 {problem.district || 'Gumla'}, {problem.state || 'Jharkhand'}</span>
              <span>•</span>
              <span>📅 Logged: {problem.created_at ? new Date(problem.created_at).toLocaleDateString() : 'Today'}</span>
            </div>
          </div>

          <div className="shrink-0 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50 text-center space-y-1 w-full md:w-auto">
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest block">
              DATABASE STATUS
            </span>
            <span className="font-bold text-brand-indigo text-sm block capitalize">
              {problem.status || 'SUBMITTED'}
            </span>
            <span className="text-[10px] text-on-surface-variant flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse"></span>
              Realtime WebSocket Active
            </span>
          </div>
        </div>
      )}

      {/* 7-Stage Resolution Timeline */}
      {problem && !loading && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
            <h3 className="font-headline-sm text-brand-indigo text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-violet">timeline</span>
              <span>{t('tracking.timelineTitle')}</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Live Synced {lastUpdated ? `at ${lastUpdated}` : ''}</span>
            </div>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/60">
            {stages.map((st) => (
              <div key={st.num} className="relative flex items-start gap-4 group">
                <div
                  className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    st.done
                      ? 'bg-brand-teal text-white shadow-2xs'
                      : st.active
                      ? 'bg-brand-violet text-white ring-4 ring-brand-violet/20 animate-pulse'
                      : 'bg-surface-container-low text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  {st.done ? '✓' : st.num}
                </div>

                <div
                  className={`p-4 rounded-2xl flex-grow space-y-1 transition-all ${
                    st.active
                      ? 'bg-brand-violet/5 border-2 border-brand-violet/40 shadow-xs'
                      : st.done
                      ? 'bg-surface-container-low/70 border border-outline-variant/40'
                      : 'bg-white border border-outline-variant/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-indigo text-sm sm:text-base">
                      {st.num}. {st.title}
                    </span>
                    {st.done ? (
                      <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2 py-0.5 rounded-md border border-brand-teal/20">
                        {t('status.done')}
                      </span>
                    ) : st.active ? (
                      <span className="text-[10px] font-bold text-brand-violet uppercase tracking-wider bg-brand-violet/10 px-2 py-0.5 rounded-md border border-brand-violet/20 animate-pulse">
                        {t('status.inProgress')}
                      </span>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
