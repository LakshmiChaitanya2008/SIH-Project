import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { api } from '../lib/api'

export default function CollaborationsView() {
  const navigate = useNavigate()
  const location = useLocation()
  const targetProject = location.state?.project || null

  const [activeTab, setActiveTab] = useState('partners')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [partners, setPartners] = useState([])
  const [requests, setRequests] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [requestNotes, setRequestNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successToast, setSuccessToast] = useState(null)

  const loadCollaborations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getCollaborations(filterCategory !== 'ALL' ? `category=${filterCategory}` : '')
      if (res?.partners) setPartners(res.partners)
      if (res?.requests) setRequests(res.requests)
      if (res?.metrics) setMetrics(res.metrics)
    } catch (err) {
      console.warn('[CollaborationsView Error]:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCollaborations()
  }, [filterCategory])

  const handleSendRequest = async () => {
    if (!selectedPartner) return
    setSubmitting(true)
    try {
      await api.requestCollaboration({
        partner_id: selectedPartner.id,
        partner_name: selectedPartner.organization_name,
        project_id: targetProject?.id || 'proj-water-aquasense',
        project_title: targetProject?.challenge_title || 'Drinking Water Quality & Heavy Metal Filtration',
        request_notes: requestNotes,
      })

      setSuccessToast(`Collaboration request submitted to ${selectedPartner.organization_name}!`)
      setSelectedPartner(null)
      setRequestNotes('')
      setTimeout(() => setSuccessToast(null), 4000)
      await loadCollaborations()
    } catch (err) {
      console.error('[Request Collaboration Error]:', err)
      setError(`Failed to submit request: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Success Toast */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 bg-brand-indigo text-white p-4 rounded-2xl shadow-xl border border-brand-violet/40 flex items-center gap-3 animate-fade-in-up">
            <span className="material-symbols-outlined text-emerald-400 text-2xl">check_circle</span>
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-white">Collaboration Request Sent</p>
              <p className="text-slate-200">{successToast}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="space-y-2 border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full">
                ECOSYSTEM NETWORK
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">• Ranchi University Innovation Hub</span>
            </div>
            <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight">
              Project Collaborations &amp; Partnerships
            </h1>
            <p className="text-xs text-on-surface-variant">
              Connect university engineering projects with industry leaders, CSR funds, government missions, and deep-tech startups.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-2 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'partners'
                  ? 'bg-brand-indigo text-white shadow-2xs'
                  : 'bg-surface-container-low text-brand-indigo hover:bg-white border border-outline-variant/50'
              }`}
            >
              Browse Partners ({partners.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-brand-indigo text-white shadow-2xs'
                  : 'bg-surface-container-low text-brand-indigo hover:bg-white border border-outline-variant/50'
              }`}
            >
              Active Requests ({requests.length})
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">ECOSYSTEM PARTNERS</span>
              <div className="text-2xl font-extrabold text-brand-indigo font-mono">{metrics.total_partners}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">ACTIVE COLLABORATIONS</span>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono">{metrics.active_collaborations}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">PENDING REQUESTS</span>
              <div className="text-2xl font-extrabold text-brand-violet font-mono">{metrics.pending_requests}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-outline-variant/70 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">ALLOCATED GRANT FUNDS</span>
              <div className="text-xl font-extrabold text-brand-teal font-mono">{metrics.total_funding_allocated}</div>
            </div>
          </div>
        )}

        {/* Category Pills */}
        {activeTab === 'partners' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'All Partners' },
              { id: 'GOVERNMENT', label: 'Government Missions' },
              { id: 'CSR', label: 'CSR Foundations' },
              { id: 'RESEARCH_LAB', label: 'ICAR & Research Labs' },
              { id: 'STARTUP', label: 'Hardware Startups' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-brand-violet text-white shadow-2xs'
                    : 'bg-white text-on-surface-variant border border-outline-variant/60 hover:text-brand-indigo'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-brand-indigo">progress_activity</span>
            <p className="text-sm font-bold text-brand-indigo">Loading ecosystem partners...</p>
          </div>
        )}

        {/* PARTNERS TAB GRID */}
        {!loading && activeTab === 'partners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4 hover:border-brand-violet transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-violet bg-brand-violet/10 px-3 py-1 rounded-full border border-brand-violet/20">
                      {p.badge}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {p.match_score}% Fit
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-brand-indigo text-lg font-bold leading-tight">
                    {p.organization_name}
                  </h3>

                  <p className="text-xs text-on-surface-variant font-medium">
                    👤 {p.contact_person}
                  </p>

                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1.5 text-xs">
                    <span className="text-[10px] text-on-surface-variant font-bold block uppercase">CAPABILITIES &amp; EXPERTISE</span>
                    <p className="text-brand-indigo leading-relaxed text-[11px]">{p.expertise}</p>
                  </div>

                  <div className="text-[11px] text-brand-indigo font-bold bg-brand-indigo/5 p-2.5 rounded-lg border border-brand-indigo/10">
                    🎯 {p.project_fit}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPartner(p)}
                    className="w-full bg-brand-indigo text-white py-2.5 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">handshake</span>
                    <span>Request Collaboration</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REQUESTS TAB */}
        {!loading && activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((r) => (
                <div key={r.id} className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Status: {r.status}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">• {new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-brand-indigo text-base">{r.partner_name}</h4>
                    <p className="text-xs text-on-surface-variant">Project: <strong>{r.project_title}</strong></p>
                    {r.request_notes && (
                      <p className="text-xs text-brand-indigo italic bg-surface-container-low p-2 rounded-lg mt-1">"{r.request_notes}"</p>
                    )}
                  </div>

                  <span className="text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-3 py-1.5 rounded-full border border-brand-indigo/20 shrink-0">
                    Faculty Lead: {r.faculty_lead}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-outline-variant/70 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-brand-indigo/40">handshake</span>
                <p className="text-sm font-bold text-brand-indigo">No active collaboration requests yet.</p>
                <p className="text-xs text-on-surface-variant">Select a partner above to submit a collaboration request for your university projects.</p>
              </div>
            )}
          </div>
        )}

        {/* REQUEST MODAL */}
        {selectedPartner && (
          <div className="fixed inset-0 z-50 bg-brand-indigo/40 backdrop-blur-sm flex items-center justify-center p-4 animate-overlay-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-outline-variant animate-overlay-scale-in">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                <h3 className="font-headline-sm text-brand-indigo text-lg font-bold">
                  Request Collaboration
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="w-8 h-8 rounded-full bg-surface-container-low text-brand-indigo flex items-center justify-center hover:bg-brand-indigo hover:text-white transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-on-surface-variant font-bold uppercase text-[10px] block">PARTNER ORGANIZATION</span>
                  <span className="font-bold text-brand-indigo text-sm">{selectedPartner.organization_name}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant font-bold uppercase text-[10px] block">TARGET PROJECT</span>
                  <span className="font-bold text-brand-violet text-xs">
                    {targetProject?.challenge_title || 'Drinking Water Quality & Heavy Metal Filtration'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-indigo block">
                  Collaboration Scope &amp; Resource Request
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify requested assistance (e.g., lab equipment access, field testbed authorization, CSR pilot grant)..."
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className="w-full p-3 bg-white rounded-xl border border-outline-variant/70 text-xs text-brand-indigo focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="px-4 py-2 rounded-full font-label-md text-xs font-bold text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSendRequest}
                  className="bg-brand-indigo text-white px-5 py-2 rounded-full font-label-md text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

