import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { api } from '../../lib/api'

export default function AdminProblemTraceView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [traceData, setTraceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // University Assignment Workspace state
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState('ranchi_univ')
  const [assigning, setAssigning] = useState(false)
  const [assignStatus, setAssignStatus] = useState('IDLE') // 'IDLE' | 'REQUEST_SENT' | 'ACCEPTED'
  const [assignMsg, setAssignMsg] = useState(null)

  useEffect(() => {
    async function loadTrace() {
      try {
        setLoading(true)
        setError(null)
        const targetId = id || '00000000-0000-0000-0002-000000000001'
        const res = await api.getProblemTrace(targetId)
        if (res && res.success) {
          setTraceData(res)
          const specStatus = res?.specification?.status || res?.specification?.human_verification_status
          if (specStatus === 'REQUEST_SENT') setAssignStatus('REQUEST_SENT')
          else if (specStatus === 'ACCEPTED' || res?.challenge?.status === 'ADOPTED') setAssignStatus('ACCEPTED')
        } else {
          setError(res?.error || 'Failed to fetch problem lifecycle trace')
        }
      } catch (err) {
        console.error('[Admin Problem Trace Error]:', err)
        setError(err.message || 'Error loading problem trace')
      } finally {
        setLoading(false)
      }
    }
    loadTrace()
  }, [id])

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    setAssigning(true)
    try {
      const res = await api.assignUniversity({
        action: 'ASSIGN',
        cluster_id: id || '00000000-0000-0000-0002-000000000001',
        university_id: '2b79fc24-8235-48a1-989f-2eee0a4bffc2',
        faculty_email: 'faculty@demo.ac.in',
      })
      if (res && res.success) {
        setAssignStatus('REQUEST_SENT')
        setAssignMsg('University request created. Opportunity is now available in University Portal.')
        setShowAssignModal(false)
      }
    } catch (err) {
      console.error('[Assign Error]:', err)
    } finally {
      setAssigning(false)
    }
  }

  const traceList = traceData?.trace || []
  const cluster = traceData?.cluster
  const spec = traceData?.specification
  const challenge = traceData?.challenge

  return (
    <div className="space-y-6 text-slate-800 max-w-5xl mx-auto pb-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="hover:text-[#26205F] font-bold cursor-pointer transition-colors"
            >
              &larr; Admin Dashboard
            </button>
            <span>/</span>
            <span className="font-mono text-[#26205F] font-bold">{id ? id.slice(0, 18) : 'Trace'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Problem Lifecycle Audit Trace
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            End-to-end institutional provenance log tracking community observations through AI understanding, mentor validation, student R&amp;D, and Panchayat deployment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          Return to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs text-slate-500 font-medium space-y-3">
          <div className="font-mono text-[#26205F] font-extrabold text-sm">Querying Supabase Ecosystem Graph...</div>
          <p>Resolving upstream citizen submissions, AI embeddings, cluster members, TRL gates and deployment milestones.</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-extrabold text-[#26205F] uppercase tracking-wider block">
                  TARGET PROBLEM PATTERN &amp; ECOSYSTEM TRACE
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {cluster?.name || cluster?.title || 'Unsafe Drinking Water in Gumla'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {assignStatus === 'ACCEPTED' ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    ✓ UNIVERSITY ACCEPTED
                  </span>
                ) : assignStatus === 'REQUEST_SENT' ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                    REQUEST SENT (Multi-University)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/problem/${targetId}/matching`)}
                    className="px-4 py-1.5 bg-[#26205F] text-white text-xs font-bold rounded-xl hover:bg-[#1C1748] transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Institutional University Matching &rarr;</span>
                  </button>
                )}

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {spec?.status || 'VERIFIED'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  Severity: {cluster?.avg_severity || 8.5} / 10
                </span>
              </div>
            </div>

            {assignMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-emerald-700">info</span>
                <span>{assignMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Domain</span>
                <span className="text-slate-900 font-bold">{cluster?.primary_domain || 'WATER QUALITY & SANITATION'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Location</span>
                <span className="text-slate-900 font-bold">Gumla District, Jharkhand</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Signal Count</span>
                <span className="font-mono text-slate-900 font-bold">{cluster?.problem_count || traceData?.submissions?.length || 3} Verified Reports</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">University Allocation</span>
                <span className="font-bold text-[#26205F] block">
                  {assignStatus === 'ACCEPTED'
                    ? 'Ranchi University (ACCEPTED)'
                    : assignStatus === 'REQUEST_SENT'
                    ? 'Multi-University (Dispatched)'
                    : 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Lifecycle Timeline */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Ecosystem Journey Timeline</h2>
                <p className="text-xs text-slate-500 font-normal">
                  12-stage provenance trail starting from real upstream citizen reports and resolving through deployment.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#26205F] bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                12 Stages
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {traceList.map((step) => {
                const isCompleted = step.status === 'COMPLETED'
                const isPending = step.status === 'PENDING' || step.status === 'IN_PROGRESS'

                return (
                  <div key={step.stage_number} className="relative group">
                    {/* Stage Indicator Node */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : isPending
                          ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                          : 'bg-slate-100 text-slate-400 border-slate-300'
                      }`}
                    >
                      {step.stage_number}
                    </div>

                    {/* Stage Card */}
                    <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/70 space-y-3 hover:border-slate-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isPending
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-200 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {isCompleted ? 'COMPLETED' : isPending ? 'IN PROGRESS' : 'NOT YET REACHED'}
                          </span>
                        </div>

                        {step.timestamp && (
                          <span className="font-mono text-[10px] text-slate-400 font-medium">
                            {new Date(step.timestamp).toLocaleDateString()} {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div className="text-xs space-y-2">
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          Stakeholder: <strong className="text-slate-900">{step.stakeholder}</strong>
                        </span>

                        {/* STAGE 1: CITIZEN REPORT CUSTOM EVIDENCE LIST */}
                        {step.stage_number === 1 && step.data?.submissions && (
                          <div className="space-y-2">
                            <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                              COMMUNITY OBSERVATIONS ({step.data.report_count} REPORTS VERIFIED)
                            </div>
                            <div className="space-y-2">
                              {step.data.submissions.map((sub, idx) => (
                                <div key={sub.id || idx} className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs space-y-1.5 shadow-2xs">
                                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                    <span className="font-bold text-[#26205F]">Report #{idx + 1} ({sub.channel})</span>
                                    <span>Lang: {sub.language || 'hi'}</span>
                                  </div>
                                  <p className="text-slate-800 font-medium italic">"{sub.text}"</p>
                                  {sub.translated && sub.translated !== sub.text && (
                                    <p className="text-[11px] text-slate-600 font-normal">
                                      <strong className="text-slate-400">Translation:</strong> "{sub.translated}"
                                    </p>
                                  )}
                                  {sub.audio_url && (
                                    <div className="pt-1 flex items-center gap-2">
                                      <audio controls src={sub.audio_url} className="h-7 w-full max-w-xs" />
                                      <span className="text-[10px] font-mono text-purple-700 font-bold">Voice Note Recording</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* STAGE 2: AI UNDERSTANDING CUSTOM DISPLAY */}
                        {step.stage_number === 2 && step.data && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1 text-xs shadow-2xs">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                              <div><span className="text-slate-400 font-bold">DOMAIN:</span> <span className="text-slate-900 font-bold">{step.data.primary_domain}</span></div>
                              <div><span className="text-slate-400 font-bold">SEVERITY:</span> <span className="text-amber-800 font-bold">{step.data.severity_score} / 10</span></div>
                              <div><span className="text-slate-400 font-bold">CONFIDENCE:</span> <span className="text-emerald-800 font-bold">{Math.round((step.data.confidence || 0.96) * 100)}%</span></div>
                            </div>
                            {step.data.transcribed_text && (
                              <div className="pt-2 border-t border-slate-100 text-[11px]">
                                <span className="text-slate-400 font-bold block">AI VOICE TRANSCRIPTION (HINDI):</span>
                                <p className="text-slate-800 italic font-medium">"{step.data.transcribed_text}"</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* STAGE 3: VECTOR SIMILARITY CUSTOM DISPLAY */}
                        {step.stage_number === 3 && step.data && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1 text-xs shadow-2xs">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                              <div><span className="text-slate-400 font-bold">MODEL:</span> <span className="text-slate-900 font-bold">{step.data.model_name}</span></div>
                              <div><span className="text-slate-400 font-bold">VECTORS:</span> <span className="text-[#26205F] font-bold">{step.data.embeddings_generated} (768-dim)</span></div>
                              <div><span className="text-slate-400 font-bold">SIMILARITY:</span> <span className="text-emerald-800 font-bold">{step.data.similarity_range || '0.94'}</span></div>
                            </div>
                          </div>
                        )}

                        {/* STAGE 6: UNIVERSITY ASSIGNMENT & MATCH CUSTOM DISPLAY */}
                        {step.stage_number === 6 && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-2 text-xs shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">Target University Hub: Ranchi University / BIT Mesra</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                assignStatus === 'ACCEPTED'
                                  ? 'bg-teal-100 text-teal-900 border border-teal-300'
                                  : assignStatus === 'REQUEST_SENT'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {assignStatus === 'ACCEPTED' ? '✓ ACCEPTED' : assignStatus === 'REQUEST_SENT' ? 'REQUEST SENT (Pending Response)' : 'READY FOR ASSIGNMENT'}
                              </span>
                            </div>

                            {assignStatus === 'IDLE' && (
                              <button
                                type="button"
                                onClick={() => setShowAssignModal(true)}
                                className="px-3.5 py-1.5 bg-[#26205F] text-white font-bold text-xs rounded-xl hover:bg-[#1C1748] transition-colors cursor-pointer shadow-2xs"
                              >
                                Assign to University &rarr;
                              </button>
                            )}

                            {assignStatus === 'REQUEST_SENT' && (
                              <p className="text-[11px] text-amber-900 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                                University request created. Request is now available in University Portal for faculty review and acceptance.
                              </p>
                            )}
                          </div>
                        )}

                        {/* GENERIC STAGE DATA DISPLAY FOR DOWNSTREAM STAGES */}
                        {step.stage_number > 3 && step.stage_number !== 6 && step.data && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1 text-[11px] font-mono text-slate-700 shadow-2xs">
                            {Object.entries(step.data).map(([k, v]) => (
                              <div key={k} className="flex flex-wrap items-baseline gap-2">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">{k.replace(/_/g, ' ')}:</span>
                                <span className="font-bold text-slate-900 break-all">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Jump Links */}
                      {step.stage_number === 7 && challenge && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => navigate('/admin/challenges')}
                            className="text-[11px] font-bold text-[#26205F] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>Inspect Challenge Details</span>
                            <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </button>
                        </div>
                      )}

                      {step.stage_number === 10 && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => navigate('/admin/projects')}
                            className="text-[11px] font-bold text-[#26205F] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>View Project Milestones</span>
                            <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* COMPACT UNIVERSITY ASSIGNMENT WORKSPACE MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-extrabold text-[#26205F] uppercase tracking-wider">INSTITUTIONAL HANDOFF</span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Assign Problem to University</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Problem Attributes Summary */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs font-medium">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500 font-normal">Problem Title:</span>
                <span className="text-slate-900 font-extrabold">{cluster?.name || 'Unsafe Drinking Water in Gumla'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Domain:</span>
                <span className="font-bold text-[#26205F]">{cluster?.primary_domain || 'WATER QUALITY & SANITATION'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-800">Gumla District, Jharkhand</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Signal Count / Severity:</span>
                <span className="font-mono font-bold text-slate-900">{cluster?.problem_count || 3} Reports &bull; {cluster?.avg_severity || 8.5}/10</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Select University Hub:</label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#26205F]"
                >
                  <option value="ranchi_univ">Ranchi University — Dept of Environmental Engineering (94% Fit Score)</option>
                  <option value="bit_mesra">BIT Mesra — Center for Water Resources (88% Fit Score)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed font-medium">
                <strong>Handoff Notice:</strong> Submitting will create an assignment request and make the opportunity instantly available in the Ranchi University Portal for faculty review.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-4 py-2 bg-[#26205F] text-white rounded-xl text-xs font-bold hover:bg-[#1C1748] transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  {assigning ? 'Creating Request...' : 'Submit Assignment Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

