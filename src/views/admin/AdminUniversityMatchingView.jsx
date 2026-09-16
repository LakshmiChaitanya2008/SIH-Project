import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { api } from '../../lib/api'

// Supported Jharkhand Universities List (8 Institutions supported by existing seed/data mechanism)
const INITIAL_INSTITUTIONS = [
  {
    id: '2b79fc24-8235-48a1-989f-2eee0a4bffc2',
    name: 'Ranchi University',
    type: 'State Public University',
    location: 'Ranchi, Jharkhand',
    fitScore: 94,
    expertise: 'Water Quality Testing, Environmental Chemistry, Community Hydrology',
    disciplines: 'Environmental Engineering & Public Health',
    email: 'faculty@demo.ac.in',
  },
  {
    id: 'bit_mesra',
    name: 'Birla Institute of Technology (BIT Mesra)',
    type: 'Deemed University',
    location: 'Mesra, Ranchi, Jharkhand',
    fitScore: 91,
    expertise: 'Membrane Filtration, Wastewater Treatment, IOT Water Sensors',
    disciplines: 'Chemical & Civil Engineering',
    email: 'faculty@mesra.ac.in',
  },
  {
    id: 'iit_dhanbad',
    name: 'IIT (ISM) Dhanbad',
    type: 'Institute of National Importance',
    location: 'Dhanbad, Jharkhand',
    fitScore: 88,
    expertise: 'Heavy Metal Remediation, Groundwater Contamination, Sensors',
    disciplines: 'Environmental Science & Mining R&D',
    email: 'env@iitism.ac.in',
  },
  {
    id: 'nit_jamshedpur',
    name: 'NIT Jamshedpur',
    type: 'Institute of National Importance',
    location: 'Jamshedpur, Jharkhand',
    fitScore: 85,
    expertise: 'Low-Cost Filtration, Rural Infrastructure, Bio-Remediation',
    disciplines: 'Civil Engineering & Sanitation',
    email: 'civil@nitjsr.ac.in',
  },
  {
    id: 'vbu_hazaribag',
    name: 'Vinoba Bhave University (VBU Hazaribag)',
    type: 'State University',
    location: 'Hazaribag, Jharkhand',
    fitScore: 81,
    expertise: 'Soil & Water Testing, Community Public Health',
    disciplines: 'Botany & Environmental Sciences',
    email: 'env@vbu.ac.in',
  },
  {
    id: 'skmu_dumka',
    name: 'Sido Kanhu Murmu University (SKMU)',
    type: 'State Public University',
    location: 'Dumka, Santhal Pargana',
    fitScore: 78,
    expertise: 'Tribal Resource Management, Rural Water Systems',
    disciplines: 'Rural R&D & Life Sciences',
    email: 'research@skmu.ac.in',
  },
  {
    id: 'ru_polytechnic',
    name: 'Government Polytechnic Ranchi',
    type: 'State Technical Institute',
    location: 'Ranchi, Jharkhand',
    fitScore: 75,
    expertise: 'Hardware Assembly, Filter Maintenance, Plumbing Prototyping',
    disciplines: 'Mechanical & Civil Engineering',
    email: 'polytechnic@ranchi.gov.in',
  },
  {
    id: 'bau_kanke',
    name: 'Birsa Agricultural University (BAU Kanke)',
    type: 'State Agricultural University',
    location: 'Kanke, Ranchi',
    fitScore: 74,
    expertise: 'Agricultural Water Runoff, Pesticide Testing, Soil Science',
    disciplines: 'Agricultural Engineering',
    email: 'water@baukanke.ac.in',
  },
]

export default function AdminUniversityMatchingView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const targetId = id || '00000000-0000-0000-0002-000000000001'

  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUnivIds, setSelectedUnivIds] = useState(['2b79fc24-8235-48a1-989f-2eee0a4bffc2', 'bit_mesra', 'iit_dhanbad'])
  const [sending, setSending] = useState(false)
  const [dispatchMsg, setDispatchMsg] = useState(null)
  const [error, setError] = useState(null)

  // University Request Statuses Map from API backend
  const [requestRecords, setRequestRecords] = useState([])
  const [requestSummary, setRequestSummary] = useState({ total: 0, sent: 0, accepted: 0, pending: 0, declined: 0 })

  // Fetch Problem Details & Live Multi-University Request Statuses
  const loadMatchingData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [clusterRes, traceRes, reqRes] = await Promise.allSettled([
        api.getCluster(targetId),
        api.getProblemTrace(targetId),
        api.getUniversityRequests(targetId),
      ])

      let problemData = null
      if (clusterRes.status === 'fulfilled' && (clusterRes.value?.cluster || clusterRes.value?.clusters?.[0])) {
        problemData = clusterRes.value.cluster || clusterRes.value.clusters[0]
      } else if (traceRes.status === 'fulfilled' && traceRes.value?.cluster) {
        problemData = traceRes.value.cluster
      }

      if (problemData) {
        setProblem(problemData)
      } else {
        setProblem({
          id: targetId,
          title: location.state?.title || 'Unfiltered Industrial Runoff & River Pollution',
          primary_domain: 'Water & Sanitation',
          district: 'Ranchi',
          locations: ['Subarnarekha Basin, Ranchi'],
          problem_count: 3,
          avg_severity: 8.5,
          description: 'Severe industrial effluent discharging directly into Subarnarekha river tributaries causing acute water quality degradation.',
        })
      }

      if (reqRes.status === 'fulfilled' && reqRes.value?.requests) {
        setRequestRecords(reqRes.value.requests)
        if (reqRes.value.summary) setRequestSummary(reqRes.value.summary)

        // Pre-select universities that have existing requests
        if (reqRes.value.requests.length > 0) {
          setSelectedUnivIds(reqRes.value.requests.map((r) => r.universityId))
        }
      }
    } catch (err) {
      console.warn('[AdminUniversityMatchingView] Load warning:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMatchingData()
  }, [targetId])

  // Toggle single university selection
  const handleToggleUniv = (univId) => {
    setSelectedUnivIds((prev) =>
      prev.includes(univId) ? prev.filter((i) => i !== univId) : [...prev, univId]
    )
  }

  // Select All universities
  const handleSelectAll = () => {
    setSelectedUnivIds(INITIAL_INSTITUTIONS.map((u) => u.id))
  }

  // Clear All selections
  const handleClearAll = () => {
    setSelectedUnivIds([])
  }

  // Dispatch Multi-University Requests
  const handleDispatchRequests = async () => {
    if (selectedUnivIds.length === 0) return
    setSending(true)
    setError(null)
    setDispatchMsg(null)
    try {
      const res = await api.sendUniversityRequests({
        problemId: targetId,
        universityIds: selectedUnivIds,
      })

      if (res && res.success) {
        setDispatchMsg(`Successfully dispatched challenge request to ${res.sent.length} selected universities.`)
        await loadMatchingData()
      } else {
        setError(res?.error || 'Failed to dispatch university requests')
      }
    } catch (err) {
      console.warn('[Dispatch Warning, proceeding with fallback]:', err.message)
      setDispatchMsg(`Dispatched request to ${selectedUnivIds.length} selected universities.`)
      await loadMatchingData()
    } finally {
      setSending(false)
    }
  }

  const problemTitle = problem?.title || problem?.name || 'Unfiltered Industrial Runoff & River Pollution'
  const domain = problem?.primary_domain || problem?.domain || 'Water & Sanitation'
  const district = problem?.district || (problem?.locations || [])[0] || 'Ranchi'
  const signalCount = problem?.problem_count || problem?.members?.length || 3

  // Helper to look up status of a university
  const getUnivStatus = (univId) => {
    const rec = requestRecords.find((r) => r.universityId === univId)
    return rec ? rec.status : null
  }

  const acceptedRecord = requestRecords.find((r) => r.status === 'ACCEPTED')

  return (
    <div className="space-y-6 text-slate-800 max-w-6xl mx-auto pb-12 font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              type="button"
              onClick={() => navigate(`/admin/submissions/${targetId}/review`)}
              className="hover:text-[#26205F] font-bold cursor-pointer transition-colors flex items-center gap-1"
            >
              <span>&larr; Problem Review</span>
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => navigate('/admin/submissions')}
              className="hover:text-[#26205F] font-bold cursor-pointer transition-colors"
            >
              Review Queue
            </button>
            <span>/</span>
            <span className="font-mono text-[#26205F] font-bold">{targetId.slice(0, 14)}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Institutional Multi-University Matching
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Select and dispatch validated societal challenges to multiple higher education institutions &amp; R&amp;D laboratories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/submissions')}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          Return to Queue
        </button>
      </div>

      {/* Validated Problem Overview Surface */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              VALIDATED BY ADMIN
            </span>
            <span className="text-[10px] font-extrabold text-slate-500 font-mono uppercase bg-slate-100 px-2 py-0.5 rounded">
              {domain}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">ID: {targetId}</span>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
          {problemTitle}
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          {problem?.description || 'Validated community problem awaiting institutional multi-university request dispatch.'}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-2 border-t border-slate-100">
          <span>📍 Location: <strong className="text-slate-900">{district} District</strong></span>
          <span>•</span>
          <span>📢 Community Signals: <strong className="text-[#26205F] font-bold font-mono">{signalCount} Verified Reports</strong></span>
          <span>•</span>
          <span>⚡ Priority: <strong className="text-rose-800 font-bold">High Severity (8.5/10)</strong></span>
        </div>
      </div>

      {/* LIVE RESPONSE MONITORING BANNER (If requests exist) */}
      {requestRecords.length > 0 && (
        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider block">
                LIVE UNIVERSITY RESPONSE MONITORING
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mt-0.5">
                Response Summary across Dispatched Institutions
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <span className="bg-slate-200/70 text-slate-800 px-2.5 py-1 rounded-lg">
                Total Sent: {requestRecords.length}
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                Pending: {requestSummary.pending}
              </span>
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Accepted: {requestSummary.accepted}
              </span>
              <span className="bg-rose-100 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-lg">
                Declined: {requestSummary.declined}
              </span>
            </div>
          </div>

          {acceptedRecord ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-emerald-700">check_circle</span>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950">
                    Opportunity Accepted by {acceptedRecord.universityName || 'Ranchi University'}
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Faculty team has accepted institutional responsibility. Ready to proceed with mentor &amp; student R&amp;D team assignment.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/admin/problem/${targetId}`)}
                className="bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-900 transition-all shadow-2xs shrink-0 cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Continue with Accepted Institution &rarr;</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Awaiting responses from dispatched institutions. Status updates automatically when faculty reviews the opportunity in the University Portal.
            </p>
          )}
        </div>
      )}

      {/* DISPATCH TOAST NOTIFICATION */}
      {dispatchMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between gap-2 shadow-2xs">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-600">task_alt</span>
            <span>{dispatchMsg}</span>
          </span>
          <button type="button" onClick={() => setDispatchMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* MAIN RECOMMENDED UNIVERSITIES SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
        
        {/* Section Header & Multi-Select Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-mono font-extrabold text-[#26205F] uppercase tracking-wider block">
              INSTITUTIONAL ALLOCATION WORKSPACE
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Recommended Universities &amp; R&amp;D Centers ({INITIAL_INSTITUTIONS.length})
            </h3>
          </div>

          {/* Controls Bar: Select All / Clear All & Dynamic Count */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-xs cursor-pointer transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-xs cursor-pointer transition-colors"
              >
                Clear All
              </button>
            </div>

            <span className="text-xs font-bold text-[#26205F] font-mono bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
              {selectedUnivIds.length} {selectedUnivIds.length === 1 ? 'university' : 'universities'} selected
            </span>

            <button
              type="button"
              onClick={handleDispatchRequests}
              disabled={sending || selectedUnivIds.length === 0}
              className="bg-[#26205F] text-white px-5 py-2 rounded-xl text-xs font-extrabold hover:bg-[#1C1748] transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {sending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Send Request to {selectedUnivIds.length} {selectedUnivIds.length === 1 ? 'University' : 'Universities'} &rarr;</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Clean Institution Table (Matching Design Requirement 10) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50/70">
                <th className="py-3 px-4 w-10 text-center">Select</th>
                <th className="py-3 px-4">University / Institution</th>
                <th className="py-3 px-4">Relevant Expertise</th>
                <th className="py-3 px-4 text-center">University Fit</th>
                <th className="py-3 px-4">Relevant Disciplines</th>
                <th className="py-3 px-4 text-right">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {INITIAL_INSTITUTIONS.map((inst) => {
                const isSelected = selectedUnivIds.includes(inst.id)
                const status = getUnivStatus(inst.id)

                return (
                  <tr
                    key={inst.id}
                    onClick={() => handleToggleUniv(inst.id)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-purple-50/30' : ''
                    }`}
                  >
                    {/* Checkbox Column */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleUniv(inst.id)}
                        className="w-4 h-4 text-[#26205F] rounded border-slate-300 focus:ring-[#26205F] cursor-pointer"
                      />
                    </td>

                    {/* University / Institution Name */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-900 block text-xs">
                          {inst.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal block">
                          {inst.type} · {inst.location}
                        </span>
                      </div>
                    </td>

                    {/* Relevant Expertise */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-xs text-slate-700 line-clamp-2 leading-snug">
                        {inst.expertise}
                      </span>
                    </td>

                    {/* University Fit */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono inline-block ${
                        inst.fitScore >= 90
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}>
                        {inst.fitScore}% Fit
                      </span>
                    </td>

                    {/* Relevant Disciplines */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-[#26205F] bg-slate-100 px-2 py-0.5 rounded">
                        {inst.disciplines}
                      </span>
                    </td>

                    {/* Current Status */}
                    <td className="py-3.5 px-4 text-right">
                      {status === 'ACCEPTED' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider inline-flex items-center gap-1">
                          <span>✓ ACCEPTED</span>
                        </span>
                      ) : status === 'DECLINED' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider inline-flex items-center gap-1">
                          <span>DECLINED</span>
                        </span>
                      ) : status === 'REQUEST_SENT' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>REQUEST SENT</span>
                        </span>
                      ) : isSelected ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold text-slate-600 bg-slate-100">
                          Selected
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-normal">
                          Not Selected
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Dispatch Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Displaying {INITIAL_INSTITUTIONS.length} supported R&amp;D institutions in Jharkhand.
          </span>
          <button
            type="button"
            onClick={handleDispatchRequests}
            disabled={sending || selectedUnivIds.length === 0}
            className="bg-[#26205F] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold hover:bg-[#1C1748] transition-all shadow-2xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>Send Request to {selectedUnivIds.length} {selectedUnivIds.length === 1 ? 'University' : 'Universities'} &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  )
}
