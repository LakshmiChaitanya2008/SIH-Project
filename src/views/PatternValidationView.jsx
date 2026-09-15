import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { createChallengeDraft } from '../features/app/appSlice'
import { api } from '../lib/api'
import { JHARKHAND_DISTRICTS } from '../lib/geo'

export default function PatternValidationView() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const reduxActivePattern = useSelector((state) => state.app.activeValidationPattern) || useSelector((state) => state.app.activePatternDetail)
  const reportDraftEvidence = useSelector((state) => state.app.reportDraft?.evidence) || []

  const [activePattern, setActivePattern] = useState(reduxActivePattern)
  const [validating, setValidating] = useState(false)
  const [validatedSuccess, setValidatedSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Evidence drawer state: null | 'reports' | 'locations'
  const [evidenceTab, setEvidenceTab] = useState(null)

  // Lightbox Modal state: null | number (index)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const [feasibility, setFeasibility] = useState('High Feasibility')
  const [department, setDepartment] = useState('Environmental Engineering')
  const [objectives, setObjectives] = useState('Design scalable, low-cost field filtration unit using locally available materials capable of purifying 500L/day.')
  const [evalNotes, setEvalNotes] = useState('')

  // Refresh cluster details if pattern ID is active
  useEffect(() => {
    async function refreshCluster() {
      if (!reduxActivePattern?.id) return
      try {
        const res = await api.getCluster(reduxActivePattern.id)
        const cluster = res?.cluster || res?.clusters?.[0]
        if (cluster) {
          setActivePattern(cluster)
        }
      } catch (err) {
        console.warn('[PatternValidationView] Could not refresh cluster details:', err.message)
      }
    }
    refreshCluster()
  }, [reduxActivePattern?.id])

  const patternTitle = activePattern?.title || activePattern?.name || 'Unsafe Drinking Water in Gumla'
  const patternDomain = activePattern?.primary_domain || activePattern?.primaryDomain || 'WATER & SANITATION'
  const district = activePattern?.district || (activePattern?.locations || [])[0] || 'Gumla'
  const blocksText = activePattern?.blocks || '3 blocks · 12 villages'
  const signalCount = activePattern?.problem_count || activePattern?.members?.length || 32
  const fitScore = activePattern?.match_score || activePattern?.emergence_score || 94
  const impact = activePattern?.impact_level || (activePattern?.avg_severity > 8 ? 'HIGH IMPACT' : 'MEDIUM-HIGH IMPACT')
  const disciplines = activePattern?.recommended_disciplines || ['Environmental Engineering', 'Public Health', 'Material Science']
  const members = activePattern?.members || []

  // Resolve real geographic coordinates from district library
  const districtObj = JHARKHAND_DISTRICTS.find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  ) || { name: district, lat: 23.0423, lng: 84.5412 }

  // Extract citizen-submitted photos / evidence URLs cleanly
  const rawPhotos = [
    ...(activePattern?.photos || []),
    ...(activePattern?.images || []),
    ...(activePattern?.photo_urls || []),
    ...(members.flatMap((m) => [m.photo_url, m.previewUrl, m.image_url, ...(m.photos || [])]).filter(Boolean)),
    ...(reportDraftEvidence.map((e) => e.previewUrl).filter(Boolean)),
  ].filter(Boolean)

  // Deduplicate photo URLs
  const photos = Array.from(new Set(rawPhotos))

  // Validate & Convert to Challenge
  const handleValidateAndCreateChallenge = async () => {
    setValidating(true)
    setError(null)
    try {
      if (activePattern?.id) {
        await api.validateCluster({
          cluster_id: activePattern.id,
          action: 'VALIDATE',
          measurable_objectives: objectives,
          notes: `${feasibility} | Dept: ${department} | ${evalNotes}`,
        })
      }

      dispatch(createChallengeDraft({
        ...activePattern,
        title: patternTitle,
        primaryDomain: patternDomain,
        locations: activePattern?.locations || [`${district}, Jharkhand`],
        problemStatement: activePattern?.description || `High levels of fluoride and heavy metals detected in village borewells across ${district}.`,
        objectives: objectives,
        targetDepartment: department,
      }))

      setValidatedSuccess(true)
    } catch (err) {
      console.warn('[Validation Warning, proceeding with draft creation]:', err.message)
      dispatch(createChallengeDraft({
        ...activePattern,
        title: patternTitle,
        primaryDomain: patternDomain,
        locations: activePattern?.locations || [`${district}, Jharkhand`],
        problemStatement: activePattern?.description || `High levels of fluoride and heavy metals detected in village borewells across ${district}.`,
        objectives: objectives,
        targetDepartment: department,
      }))
      setValidatedSuccess(true)
    } finally {
      setValidating(false)
    }
  }

  const handleDeclineOpportunity = async () => {
    setValidating(true)
    try {
      if (activePattern?.id) {
        await api.validateCluster({
          cluster_id: activePattern.id,
          action: 'REJECT',
          notes: 'Declined by mentor evaluation',
        })
      }
      navigate('/validation/queue')
    } catch (err) {
      navigate('/validation/queue')
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <main className="flex-grow pt-6 pb-24 px-4 sm:px-6 max-w-[1180px] mx-auto w-full space-y-7">

        {/* 1. TOP NAVIGATION */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/validation/queue')}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#171A5A] hover:text-indigo-700 transition-colors cursor-pointer"
          >
            <span className="text-base">←</span>
            <span>Back to Opportunities</span>
          </button>
        </div>

        {/* AFTER VALIDATION SUCCESS / TRANSITION STATE */}
        {validatedSuccess ? (
          <div className="bg-white p-7 sm:p-10 rounded-xl border border-emerald-200/90 shadow-[0_2px_10px_rgba(20,24,80,0.04)] text-center space-y-7 max-w-2xl mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200/80 inline-block">
                INNOVATION CHALLENGE READY
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#171A5A] leading-tight">
                {patternTitle}
              </h1>
              <p className="text-[15px] leading-[1.65] text-[#333E5D]">
                The validated community problem has been converted into an Innovation Challenge for student and faculty teams.
              </p>
            </div>

            {/* REFINED WORKFLOW LIFECYCLE */}
            <div className="bg-[#FAF8F5] p-4.5 rounded-xl border border-stone-200/80 max-w-xl mx-auto space-y-3">
              <div className="flex flex-wrap items-center justify-between text-[13px] font-medium text-slate-700 gap-2">
                <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <span>Community Signal</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <span>Emerging Pattern</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <span>University Validation</span>
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-[#171A5A] text-white px-2.5 py-1 rounded-md text-[12px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Challenge Ready</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="text-slate-400 text-[12.5px]">
                  Publish to Students
                </div>
              </div>

              {/* HELPFUL CONTEXT LINE */}
              <p className="text-[12.5px] text-[#525B75] italic pt-1 border-t border-stone-200/60">
                Review the challenge details before publishing it to student innovators.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => navigate('/challenge/formation')}
                className="bg-[#171A5A] text-white px-7 py-3.5 rounded-xl text-[14px] font-bold hover:bg-indigo-900 transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Review & Publish Challenge →</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/validation/queue')}
                className="bg-white border border-stone-200 text-[#171A5A] px-5 py-3.5 rounded-xl text-[13.5px] font-medium hover:bg-stone-50 transition-colors cursor-pointer"
              >
                View Opportunities
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-7">

            {/* ==================================================
                TOP PROBLEM HEADER
               ================================================== */}
            <header className="bg-white p-6 sm:p-7 rounded-xl border border-[rgba(20,24,80,0.10)] shadow-[0_2px_10px_rgba(20,24,80,0.04)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-2">
                  {/* Category / Domain Tag */}
                  <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                    {patternDomain}
                  </div>

                  {/* Problem Title */}
                  <h1 className="text-[26px] sm:text-[30px] font-bold text-[#171A5A] tracking-[-0.02em] leading-[1.25]">
                    {patternTitle}
                  </h1>

                  {/* Location & Metadata Line */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[14px] text-[#525B75] font-medium pt-0.5">
                    <span className="font-semibold text-[#171A5A]">{district} District</span>
                    <span>·</span>
                    <span>{blocksText}</span>
                    <span>·</span>
                    <span className="text-[#171A5A] font-semibold">{signalCount} community signals</span>
                    <span>·</span>
                    <span className="text-amber-800 font-semibold bg-amber-50/90 px-2.5 py-0.5 rounded text-[12px] border border-amber-200/80">
                      {impact}
                    </span>
                  </div>
                </div>

                {/* University Fit Score Badge */}
                <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl px-5 py-3 text-center shrink-0 self-start sm:self-auto min-w-[140px]">
                  <div className="text-[24px] font-bold text-[#171A5A] leading-none">
                    {fitScore}%
                  </div>
                  <div className="text-[11px] font-semibold text-[#525B75] tracking-wider mt-1.5 uppercase">
                    UNIVERSITY FIT
                  </div>
                </div>
              </div>
            </header>

            {error && (
              <div className="p-4 bg-red-50 text-red-900 text-[14px] rounded-lg border border-red-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* ==================================================
                MAIN BODY: TWO-COLUMN INVESTIGATION WORKSPACE
               ================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

              {/* ==================================================
                  LEFT COLUMN: COMMUNITY & EVIDENCE (7 cols)
                 ================================================== */}
              <div className="lg:col-span-7 space-y-7">

                {/* COMPOSED WORKSPACE SURFACE */}
                <div className="bg-white p-6 sm:p-8 rounded-xl border border-[rgba(20,24,80,0.10)] shadow-[0_2px_10px_rgba(20,24,80,0.04)] space-y-7 divide-y divide-stone-100">

                  {/* 1. COMMUNITY PROBLEM SUMMARY */}
                  <div className="space-y-3">
                    <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                      COMMUNITY PROBLEM SUMMARY
                    </div>
                    <h2 className="text-[19px] font-bold text-[#171A5A] leading-tight">
                      Recurring heavy metal & fluoride contamination in drinking borewells
                    </h2>
                    <p className="text-[15.5px] leading-[1.65] text-[#333E5D] font-normal">
                      {activePattern?.description || `High levels of fluoride and heavy metals have been detected in village borewells across ${district} district.`}
                    </p>

                    {/* Highlighted Impact Line */}
                    <div className="bg-amber-50/80 border-l-3 border-amber-500 p-4 rounded-r-lg text-[14.5px] leading-[1.55] text-amber-950 font-medium">
                      <strong>Impact:</strong> Primary school drinking nodes are affected, with recurring health concerns reported by local residents.
                    </div>
                  </div>

                  {/* 2. COMMUNITY CONTEXT */}
                  <div className="pt-7 space-y-3">
                    <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                      COMMUNITY CONTEXT
                    </div>
                    <h2 className="text-[19px] font-bold text-[#171A5A] leading-tight">
                      Key Field Observations
                    </h2>
                    <p className="text-[14px] text-[#525B75] mb-2">
                      Reported by local citizens, school headmasters, and field workers:
                    </p>
                    <ul className="space-y-3 text-[15px] leading-[1.6] text-[#333E5D]">
                      <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>Contamination reported across multiple handpumps during pre-monsoon water testing.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>Recurring health concerns among primary school children (dental fluorosis and digestive distress).</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>Damaged filtration infrastructure across 12 villages lacking cartridge replacements.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>Laboratory observations indicating heavy metal levels exceeding WHO safety thresholds by 2.4x.</span>
                      </li>
                    </ul>
                  </div>

                  {/* 3. COMMUNITY EVIDENCE */}
                  <div className="pt-7 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                          COMMUNITY EVIDENCE
                        </div>
                        <h2 className="text-[19px] font-bold text-[#171A5A] leading-tight mt-0.5">
                          Field Submissions & Media
                        </h2>
                      </div>
                      <span className="text-[12px] font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-200/80">
                        12 validated observations · 3 locations
                      </span>
                    </div>

                    {/* PHOTO GALLERY */}
                    {photos.length > 0 ? (
                      <div className="space-y-3 pt-1">
                        {/* Large Hero Photo */}
                        <div
                          onClick={() => setLightboxIndex(0)}
                          className="relative h-64 sm:h-72 rounded-xl overflow-hidden border border-stone-200 cursor-pointer group bg-stone-100"
                        >
                          <img
                            src={photos[0]}
                            alt="Citizen Field Evidence"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white flex items-end justify-between">
                            <span className="text-[12px] font-semibold text-amber-300 uppercase tracking-wider">
                              Citizen Field Observation · {district}
                            </span>
                            <span className="material-symbols-outlined text-xl opacity-90 group-hover:opacity-100">
                              zoom_in
                            </span>
                          </div>
                        </div>

                        {/* Thumbnails Row */}
                        {photos.length > 1 && (
                          <div className="grid grid-cols-3 gap-3">
                            {photos.slice(1, 4).map((url, idx) => {
                              const actualIndex = idx + 1
                              const isLastThumb = idx === 2 && photos.length > 4
                              const remainingCount = photos.length - 4

                              return (
                                <div
                                  key={idx}
                                  onClick={() => setLightboxIndex(actualIndex)}
                                  className="relative h-24 rounded-lg overflow-hidden border border-stone-200 cursor-pointer group bg-stone-100"
                                >
                                  <img
                                    src={url}
                                    alt={`Field Evidence ${actualIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                  />
                                  {isLastThumb ? (
                                    <div className="absolute inset-0 bg-black/60 hover:bg-black/50 transition-colors flex items-center justify-center text-white text-xs font-bold">
                                      +{remainingCount} more
                                    </div>
                                  ) : (
                                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                      <span className="material-symbols-outlined text-white text-base drop-shadow-md">
                                        zoom_in
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* COMPACT NO PHOTO SUBMITTED STATE */
                      <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-stone-200/80 text-left space-y-1">
                        <div className="text-[13px] font-semibold text-[#171A5A] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-stone-500">no_photography</span>
                          <span>No photo evidence submitted</span>
                        </div>
                        <p className="text-[13px] text-[#525B75] italic">
                          Citizens submitted text and voice transcripts for this problem report.
                        </p>
                      </div>
                    )}

                    {/* Stats & Actions Row */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[14px] text-[#525B75] font-medium border-t border-stone-100">
                      <div>
                        <span className="font-semibold text-[#171A5A]">{signalCount} citizen reports</span>
                        <span className="mx-2 text-slate-300">·</span>
                        <span>4 field observations</span>
                      </div>

                      <div className="flex items-center gap-4 text-[13.5px]">
                        <button
                          type="button"
                          onClick={() => setEvidenceTab(evidenceTab === 'reports' ? null : 'reports')}
                          className={`font-semibold cursor-pointer transition-colors ${evidenceTab === 'reports' ? 'text-[#171A5A] underline' : 'text-[#525B75] hover:text-[#171A5A]'
                            }`}
                        >
                          View reports →
                        </button>
                        <button
                          type="button"
                          onClick={() => setEvidenceTab(evidenceTab === 'locations' ? null : 'locations')}
                          className={`font-semibold cursor-pointer transition-colors ${evidenceTab === 'locations' ? 'text-[#171A5A] underline' : 'text-[#525B75] hover:text-[#171A5A]'
                            }`}
                        >
                          View locations →
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED EVIDENCE DRAWER CONTENT */}
                    {evidenceTab && (
                      <div className="pt-3 border-t border-stone-200/80 space-y-3 text-[14px]">
                        {evidenceTab === 'reports' && (
                          <div className="space-y-2.5">
                            <span className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider block">
                              Verified Citizen Transcripts ({members.length || signalCount})
                            </span>
                            {members.length > 0 ? (
                              members.map((m, idx) => (
                                <div key={idx} className="p-3.5 bg-[#FAF8F5] rounded-lg border border-stone-200/80 space-y-1">
                                  <div className="flex items-center justify-between font-semibold text-slate-900 text-[13px]">
                                    <span>📍 {m.district || district} Sector {idx + 1}</span>
                                    <span className="text-[12px] text-indigo-900 font-semibold">Severity: {m.severity_score || 8.5}/10</span>
                                  </div>
                                  <p className="text-[14px] text-[#333E5D] italic leading-relaxed">
                                    &ldquo;{m.text || m.original_text || 'Water quality issue reported.'}&rdquo;
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="p-3.5 bg-[#FAF8F5] rounded-lg border border-stone-200/80 text-[#525B75] italic">
                                32 citizen voice & text notes collected across {district} primary school drinking nodes.
                              </div>
                            )}
                          </div>
                        )}

                        {evidenceTab === 'locations' && (
                          <div className="p-3.5 bg-[#FAF8F5] rounded-lg border border-stone-200/80 text-[#333E5D] space-y-1">
                            <span className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider block">
                              Geographic Clustering Details
                            </span>
                            <p className="text-[14px]">Clustered across 3 contiguous blocks and 12 villages in {district} district, Jharkhand.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 4. LOCATION & GEOGRAPHIC CONTEXT */}
                  <div className="pt-7 space-y-4">
                    <div>
                      <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                        LOCATION & GEOGRAPHIC CONTEXT
                      </div>
                      <h2 className="text-[19px] font-bold text-[#171A5A] leading-tight mt-0.5">
                        Geographic Evidence & Spatial Coverage
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch">

                      {/* REAL MAP CONTAINER */}
                      <div className="sm:col-span-7 bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs min-h-[260px] flex flex-col">
                        <div className="px-3.5 py-2.5 bg-[#FAF8F5] border-b border-stone-200/80 flex items-center justify-between text-[12.5px] font-semibold text-[#171A5A]">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base text-indigo-700">map</span>
                            <span>{district} District, Jharkhand</span>
                          </span>
                          <span className="text-[11px] font-medium text-[#525B75]">
                            {districtObj.lat.toFixed(4)}° N, {districtObj.lng.toFixed(4)}° E
                          </span>
                        </div>

                        {/* Real OpenStreetMap iFrame */}
                        <div className="relative flex-grow min-h-[220px] w-full bg-stone-100">
                          <iframe
                            title={`Map of ${district} District`}
                            width="100%"
                            height="100%"
                            className="w-full h-full min-h-[220px] border-0"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${districtObj.lng - 0.15}%2C${districtObj.lat - 0.15}%2C${districtObj.lng + 0.15}%2C${districtObj.lat + 0.15}&layer=mapnik&marker=${districtObj.lat}%2C${districtObj.lng}`}
                          />
                        </div>
                      </div>

                      {/* RIGHT-SIDE GEOGRAPHIC SUMMARY */}
                      <div className="sm:col-span-5 bg-[#FAF8F5] p-5 rounded-xl border border-stone-200/80 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="text-[11px] font-semibold text-[#525B75] uppercase tracking-wider">
                            GEOGRAPHIC SUMMARY
                          </div>

                          <div className="space-y-2 text-[14.5px] text-[#333E5D] font-medium">
                            <div className="font-bold text-[#171A5A] text-[17px]">
                              {district} District, Jharkhand
                            </div>

                            <div className="space-y-1.5 pt-1 text-[14px]">
                              <div className="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
                                <span className="text-[#525B75]">District</span>
                                <span className="font-semibold text-[#171A5A]">{district}</span>
                              </div>

                              <div className="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
                                <span className="text-[#525B75]">Coverage</span>
                                <span className="font-semibold text-[#171A5A]">{blocksText}</span>
                              </div>

                              <div className="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
                                <span className="text-[#525B75]">Community Signals</span>
                                <span className="font-semibold text-[#171A5A]">{signalCount} reports</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Geographic Pattern Statement */}
                        <div className="pt-3 border-t border-stone-200/80 space-y-1">
                          <span className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider">
                            GEOGRAPHIC PATTERN
                          </span>
                          <p className="text-[13.5px] text-[#171A5A] font-medium leading-relaxed italic">
                            &ldquo;Reports recur across multiple locations within the affected area.&rdquo;
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 5. REQUIRED EXPERTISE */}
                  <div className="pt-7 space-y-3">
                    <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                      REQUIRED EXPERTISE
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {disciplines.map((disc, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50/80 border border-indigo-100/90 text-[#171A5A] px-3.5 py-1.5 rounded-lg text-[13.5px] font-semibold"
                        >
                          {disc}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* ==================================================
                  RIGHT COLUMN: UNIVERSITY & DECISION (5 cols)
                 ================================================== */}
              <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-6">

                {/* COMPOSED DECISION SURFACE */}
                <div className="bg-white p-6 sm:p-7 rounded-xl border border-indigo-200/90 shadow-[0_4px_20px_rgba(20,24,80,0.06)] space-y-7 divide-y divide-stone-100">

                  {/* 1. WHY YOUR INSTITUTION? */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                        WHY YOUR INSTITUTION?
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        94% MATCH
                      </span>
                    </div>

                    <h2 className="text-[19px] font-bold text-[#171A5A] leading-tight">
                      Algorithm Routing Match
                    </h2>

                    <p className="text-[14.5px] leading-[1.6] text-[#333E5D] font-normal">
                      This opportunity has been routed to Ranchi University based on your academic strengths, faculty expertise and demonstrated research capabilities.
                    </p>

                    <div className="space-y-2 text-[14px] font-semibold text-[#171A5A] pt-1">
                      <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider mb-1">
                        STRONG MATCHES
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>Environmental Engineering</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>Public Health</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>Materials Science</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. UNIVERSITY FIT */}
                  <div className="pt-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                        UNIVERSITY FIT
                      </div>
                      <div className="text-[20px] font-bold text-[#171A5A]">
                        94% FIT
                      </div>
                    </div>

                    <div className="space-y-2.5 text-[13.5px] bg-[#FAF8F5] p-4 rounded-xl border border-stone-200/80">
                      <div>
                        <span className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider mb-0.5">
                          MATCHED DISCIPLINES
                        </span>
                        <span className="font-semibold text-[#171A5A]">
                          {disciplines.join(' · ')}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider mb-0.5">
                            FACULTY
                          </span>
                          <span className="font-semibold text-[#171A5A]">Prof. R. Sharma</span>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-[#525B75] uppercase block tracking-wider mb-0.5">
                            FACILITY
                          </span>
                          <span className="font-semibold text-[#171A5A]">Water Quality Lab</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. EXPECTED CONTRIBUTION */}
                  <div className="pt-7 space-y-3">
                    <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                      EXPECTED CONTRIBUTION
                    </div>
                    <h2 className="text-[19px] font-bold text-[#171A5A] leading-tight">
                      Institutional Scope
                    </h2>

                    <div className="space-y-2.5 text-[13.5px] font-medium pt-1">
                      <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-stone-200/70 space-y-0.5">
                        <strong className="text-[11px] font-bold text-[#171A5A] uppercase tracking-wider block">
                          FIELD RESEARCH
                        </strong>
                        <span className="text-[#333E5D]">Sample analysis and ground validation</span>
                      </div>

                      <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-stone-200/70 space-y-0.5">
                        <strong className="text-[11px] font-bold text-[#171A5A] uppercase tracking-wider block">
                          MENTORSHIP
                        </strong>
                        <span className="text-[#333E5D]">Faculty technical oversight</span>
                      </div>

                      <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-stone-200/70 space-y-0.5">
                        <strong className="text-[11px] font-bold text-[#171A5A] uppercase tracking-wider block">
                          STUDENT TEAM
                        </strong>
                        <span className="text-[#333E5D]">Multidisciplinary project execution</span>
                      </div>

                      <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-stone-200/70 space-y-0.5">
                        <strong className="text-[11px] font-bold text-[#171A5A] uppercase tracking-wider block">
                          PROTOTYPE
                        </strong>
                        <span className="text-[#333E5D]">Low-cost filtration unit development</span>
                      </div>

                      <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-stone-200/70 space-y-0.5">
                        <strong className="text-[11px] font-bold text-[#171A5A] uppercase tracking-wider block">
                          FIELD VALIDATION
                        </strong>
                        <span className="text-[#333E5D]">Testing in Gumla villages</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. DECISION WORKSPACE */}
                  <div className="pt-7 space-y-4">
                    <div className="space-y-1">
                      <div className="text-[12px] font-semibold text-[#525B75] uppercase tracking-wider">
                        DECISION WORKSPACE
                      </div>
                      <p className="text-[14px] text-[#333E5D] leading-relaxed">
                        Accept this opportunity to form an Innovation Challenge for student teams.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-[#171A5A] block">Target Department</label>
                      <select
                        className="w-full p-3 bg-white rounded-lg border border-stone-200 text-[14px] font-medium text-[#171A5A] focus:outline-none focus:border-indigo-600 transition-colors"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option>Environmental Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Chemistry & Material Science</option>
                        <option>Computer Science & IT</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-[#171A5A] block">Student R&D Objective</label>
                      <textarea
                        rows="3"
                        className="w-full p-3 bg-white rounded-lg border border-stone-200 text-[13.5px] text-[#171A5A] focus:outline-none focus:border-indigo-600 transition-colors leading-relaxed"
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                      />
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="button"
                        onClick={handleValidateAndCreateChallenge}
                        disabled={validating}
                        className="w-full bg-[#171A5A] text-white py-3.5 px-4 rounded-xl font-semibold text-[14px] hover:bg-indigo-900 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {validating ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                            <span>Validating...</span>
                          </>
                        ) : (
                          <>
                            <span>ACCEPT OPPORTUNITY & CREATE CHALLENGE →</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-3 text-[13.5px] text-[#525B75] font-medium pt-1">
                        <button
                          type="button"
                          onClick={handleDeclineOpportunity}
                          disabled={validating}
                          className="hover:text-red-700 cursor-pointer transition-colors"
                        >
                          Decline Opportunity
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={handleDeclineOpportunity}
                          disabled={validating}
                          className="hover:text-slate-900 cursor-pointer transition-colors"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* LIGHTBOX MODAL FOR CITIZEN EVIDENCE PHOTOS */}
      {lightboxIndex !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white text-[13.5px] font-medium pb-2">
              <span>Photo {lightboxIndex + 1} of {photos.length}</span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Photo View */}
            <div className="relative w-full flex items-center justify-center overflow-hidden rounded-lg bg-black">
              <img
                src={photos[lightboxIndex]}
                alt={`Evidence photo ${lightboxIndex + 1}`}
                className="max-h-[75vh] w-auto object-contain rounded"
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % photos.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            <div className="text-center text-stone-300 text-[12.5px] pt-2">
              Citizen Field Observation · {district}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
