import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../../lib/api'

export default function AdminDashboardView() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState({
    communityReports: 1284,
    validatedPatterns: 86,
    activeChallenges: 24,
    participatingUniversities: 18,
    activeProjects: 31,
    solutionsDeployed: 7,
  })

  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString())

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true)
      try {
        const res = await api.getDashboard()
        if (res && res.metrics) {
          setMetrics((prev) => ({
            ...prev,
            communityReports: res.metrics.totalSubmissions || 1284,
            validatedPatterns: res.metrics.pending || 86,
            activeChallenges: res.metrics.active || 24,
            activeProjects: res.metrics.activeProjects || 31,
            solutionsDeployed: res.metrics.deployed || 7,
          }))
        }
      } catch (err) {
        console.warn('[Admin Dashboard API Fallback]: Using deterministic ecosystem metrics:', err.message)
      } finally {
        setLoading(false)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    }
    loadAdminData()
  }, [])

  // Action Required Items
  const actionRequiredItems = [
    {
      id: 'act-1',
      title: '12 Community patterns awaiting validation',
      count: 12,
      tag: 'Validation Queue',
      route: '/validation/queue',
    },
    {
      id: 'act-2',
      title: '4 Challenges awaiting publication',
      count: 4,
      tag: 'Challenge Formation',
      route: '/challenge/formation',
    },
    {
      id: 'act-3',
      title: '7 Proposals awaiting decision',
      count: 7,
      tag: 'Proposal Review',
      route: '/student/proposals',
    },
    {
      id: 'act-4',
      title: '3 Projects requiring milestone review',
      count: 3,
      tag: 'Project Milestones',
      route: '/university/projects',
    },
  ]

  // Pipeline Steps
  const pipelineSteps = [
    { count: '1,284', label: 'Community Reports' },
    { count: '86', label: 'AI Clusters' },
    { count: '42', label: 'Validated Patterns' },
    { count: '24', label: 'Active Challenges' },
    { count: '31', label: 'Active Projects' },
    { count: '7', label: 'Deployed Solutions' },
  ]

  // Recent Ecosystem Activity
  const recentActivities = [
    {
      id: 1,
      time: 'Today',
      text: 'Ranchi University accepted Drinking Water Quality & Heavy Metal Filtration',
      type: 'ACCEPTANCE',
    },
    {
      id: 2,
      time: 'Today',
      text: 'Team AquaSense submitted proposal for Bio-Char Alumina Filtration System',
      type: 'PROPOSAL',
    },
    {
      id: 3,
      time: 'Today',
      text: 'Faculty mentor Dr. Anjali Kumar approved proposal for TRL 4 development',
      type: 'APPROVAL',
    },
    {
      id: 4,
      time: 'Today',
      text: 'Jharkhand State Water Mission collaboration requested for field testbed',
      type: 'COLLABORATION',
    },
    {
      id: 5,
      time: 'Today',
      text: 'Field-testing milestone completed in Gumla district hand pumps',
      type: 'MILESTONE',
    },
  ]

  // Domain Overview Breakdown
  const domainOverview = [
    { domain: 'Water & Sanitation', challenges: 8, projects: 11, width: 'w-[85%]' },
    { domain: 'Agriculture', challenges: 6, projects: 8, width: 'w-[70%]' },
    { domain: 'Healthcare', challenges: 4, projects: 5, width: 'w-[55%]' },
    { domain: 'Infrastructure', challenges: 3, projects: 4, width: 'w-[45%]' },
    { domain: 'Environment', challenges: 2, projects: 2, width: 'w-[30%]' },
    { domain: 'Livelihoods', challenges: 1, projects: 1, width: 'w-[20%]' },
  ]

  return (
    <div className="space-y-8">
      {/* 1. DASHBOARD HEADER */}
      <div className="border-b border-outline-variant/50 pb-6 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              GOVERNANCE CONTROL TOWER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-indigo tracking-tight">
              SamadhanSetu Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Jharkhand Civic Innovation Network • Monitor community signals, innovation challenges, institutional participation and solution delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-outline-variant/60 text-xs font-mono text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* 2. ECOSYSTEM OVERVIEW (6 Institutional Metrics Cards) */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Ecosystem overview</span>
        <div className="bg-white rounded-xl border border-outline-variant/60 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-outline-variant/40 text-center">
            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">COMMUNITY REPORTS</span>
              <div className="text-2xl font-extrabold text-brand-indigo font-mono">{metrics.communityReports.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 block">Citizen signals</span>
            </div>

            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">VALIDATED PATTERNS</span>
              <div className="text-2xl font-extrabold text-brand-indigo font-mono">{metrics.validatedPatterns}</div>
              <span className="text-[11px] text-slate-500 block">Clustered issues</span>
            </div>

            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">ACTIVE CHALLENGES</span>
              <div className="text-2xl font-extrabold text-brand-indigo font-mono">{metrics.activeChallenges}</div>
              <span className="text-[11px] text-slate-500 block">Open innovation</span>
            </div>

            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">UNIVERSITIES</span>
              <div className="text-2xl font-extrabold text-brand-indigo font-mono">{metrics.participatingUniversities}</div>
              <span className="text-[11px] text-slate-500 block">Participating hubs</span>
            </div>

            <div className="p-4 space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-500 block">ACTIVE PROJECTS</span>
              <div className="text-2xl font-extrabold text-brand-indigo font-mono">{metrics.activeProjects}</div>
              <span className="text-[11px] text-slate-500 block">R&amp;D teams</span>
            </div>

            <div className="p-4 space-y-0.5 bg-emerald-50/50">
              <span className="text-[10px] font-semibold uppercase text-emerald-900 block">SOLUTIONS DEPLOYED</span>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono">{metrics.solutionsDeployed}</div>
              <span className="text-[11px] text-emerald-800 font-medium block">Field-verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACTION REQUIRED (MOST IMPORTANT SECTION) */}
      <div className="bg-white p-6 rounded-xl border border-brand-indigo/30 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
          <div>
            <h2 className="text-base font-bold text-brand-indigo uppercase tracking-wide">Action required</h2>
            <p className="text-xs text-slate-600 font-normal">Tasks awaiting administrative review or governance decision</p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            26 Pending Actions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionRequiredItems.map((act) => (
            <div
              key={act.id}
              onClick={() => navigate(act.route)}
              className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/50 hover:border-brand-indigo transition-all cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{act.tag}</span>
                <h3 className="font-bold text-brand-indigo text-sm leading-snug">
                  {act.title}
                </h3>
              </div>

              <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="font-mono text-brand-violet font-bold">{act.count} items</span>
                <span className="text-brand-indigo font-bold hover:underline">Review &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PROBLEM → IMPACT PIPELINE VISUALIZATION */}
      <div className="bg-white p-6 rounded-xl border border-outline-variant/60 shadow-2xs space-y-4">
        <div className="border-b border-outline-variant/40 pb-2.5">
          <h2 className="text-base font-bold text-brand-indigo uppercase tracking-wide">Problem to Impact Pipeline</h2>
          <p className="text-xs text-slate-600 font-normal">
            End-to-end platform transformation from citizen observations into implemented field solutions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-1 relative">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">STEP {idx + 1}</span>
              <div className="text-xl font-extrabold text-brand-indigo font-mono">{step.count}</div>
              <span className="text-xs font-semibold text-slate-700 block leading-tight">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 2-COLUMN GRID: RECENT ECOSYSTEM ACTIVITY & DOMAIN OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Ecosystem Activity (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-outline-variant/60 shadow-2xs space-y-4">
          <div className="border-b border-outline-variant/40 pb-2.5 flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-indigo">Recent ecosystem activity</h2>
            <span className="text-xs text-slate-500 font-normal">Live platform event stream</span>
          </div>

          <div className="space-y-3 text-xs">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 flex items-start gap-3">
                <span className="text-[10px] font-bold text-brand-violet bg-brand-violet/10 px-2 py-0.5 rounded shrink-0 mt-0.5">
                  {act.time}
                </span>
                <p className="text-slate-800 font-medium leading-snug flex-1">{act.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Overview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-outline-variant/60 shadow-2xs space-y-4">
          <div className="border-b border-outline-variant/40 pb-2.5 flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-indigo">Domain overview</h2>
            <span className="text-xs text-slate-500 font-normal">Active tracks</span>
          </div>

          <div className="space-y-3 text-xs">
            {domainOverview.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{item.domain}</span>
                  <span className="text-slate-500 text-[11px]">
                    {item.challenges} Challenges • {item.projects} Projects
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.width} bg-brand-indigo rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
