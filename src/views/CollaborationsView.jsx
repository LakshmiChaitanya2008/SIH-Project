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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Success Toast */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 bg-[#26205F] text-white px-4 py-3 rounded-xl shadow-xl border border-purple-400/30 flex items-center gap-3 animate-fade-in-up">
            <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-white">Collaboration Request Sent</p>
              <p className="text-slate-200">{successToast}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#26205F] uppercase tracking-wider bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 rounded-full">
                ECOSYSTEM NETWORK
              </span>
              <span className="text-xs text-slate-500 font-medium">• Ranchi University Innovation Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26205F] tracking-tight">
              Project Collaborations &amp; Industry Partnerships
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Connect university engineering projects with industry leaders, CSR foundations, government missions, and deep-tech startups.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'partners'
                  ? 'bg-[#26205F] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Browse Partners ({partners.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-[#26205F] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Active Requests ({requests.length})
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ECOSYSTEM PARTNERS</span>
              <div className="text-2xl font-extrabold text-[#26205F] font-mono">{metrics.total_partners}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ACTIVE COLLABORATIONS</span>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono">{metrics.active_collaborations}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PENDING REQUESTS</span>
              <div className="text-2xl font-extrabold text-purple-700 font-mono">{metrics.pending_requests}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ALLOCATED GRANT FUNDS</span>
              <div className="text-xl font-extrabold text-[#26205F] font-mono">{metrics.total_funding_allocated}</div>
            </div>
          </div>
        )}

        {/* Category Pills */}
        {activeTab === 'partners' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
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
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#26205F] text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-[#26205F]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#26205F]">progress_activity</span>
            <p className="text-xs font-bold text-[#26205F]">Loading ecosystem partners...</p>
          </div>
        )}

        {/* PARTNERS TAB GRID */}
        {!loading && activeTab === 'partners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#26205F] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                      {p.badge}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {p.match_score}% Fit
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#26205F] leading-tight">
                    {p.organization_name}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium">
                    👤 {p.contact_person}
                  </p>

                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">CAPABILITIES &amp; EXPERTISE</span>
                    <p className="text-[#26205F] leading-relaxed text-[11px] font-medium">{p.expertise}</p>
                  </div>

                  <div className="text-[11px] text-[#26205F] font-semibold bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
                    🎯 {p.project_fit}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPartner(p)}
                    className="w-full bg-[#26205F] text-white py-2 rounded-xl text-xs font-semibold hover:bg-purple-900 transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
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
                <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Status: {r.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">• {new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-[#26205F] text-base">{r.partner_name}</h4>
                    <p className="text-xs text-slate-600">Project: <strong>{r.project_title}</strong></p>
                    {r.request_notes && (
                      <p className="text-xs text-[#26205F] italic bg-slate-50 p-2 rounded-lg mt-1">"{r.request_notes}"</p>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-[#26205F] bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200/60 shrink-0">
                    Faculty Lead: {r.faculty_lead}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-slate-300">handshake</span>
                <p className="text-sm font-bold text-[#26205F]">No active collaboration requests yet.</p>
                <p className="text-xs text-slate-500">Select a partner above to submit a collaboration request for your university projects.</p>
              </div>
            )}
          </div>
        )}

        {/* REQUEST MODAL */}
        {selectedPartner && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#26205F]">
                  Request Collaboration
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">PARTNER ORGANIZATION</span>
                  <span className="font-bold text-[#26205F] text-sm">{selectedPartner.organization_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">TARGET PROJECT</span>
                  <span className="font-semibold text-purple-800 text-xs">
                    {targetProject?.challenge_title || 'Drinking Water Quality & Heavy Metal Filtration'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#26205F] block">
                  Collaboration Scope &amp; Resource Request
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify requested assistance (e.g., lab equipment access, field testbed authorization, CSR pilot grant)..."
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#26205F]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSendRequest}
                  className="bg-[#26205F] text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-purple-900 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
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

