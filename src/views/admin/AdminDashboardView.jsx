import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../../lib/api'

export default function AdminDashboardView() {
  const navigate = useNavigate()
  
  const [metrics, setMetrics] = useState({
    communityReports: 1248,
    aiPatterns: 86,
    validatedPatterns: 42,
    activeChallenges: 24,
    universities: 18,
    activeProjects: 31,
    solutionsDeployed: 7,
  })

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await api.getDashboard()
        if (res && res.metrics) {
          setMetrics((prev) => ({
            ...prev,
            communityReports: res.metrics.totalSubmissions || 1248,
            aiPatterns: res.metrics.pending || 86,
            activeChallenges: res.metrics.active || 24,
            activeProjects: res.metrics.activeProjects || 31,
            solutionsDeployed: res.metrics.deployed || 7,
          }))
        }
      } catch (err) {
        console.warn('[Admin Dashboard API Fallback]: Using deterministic ecosystem metrics:', err.message)
      }
    }
    loadAdminData()
  }, [])

  // Action Required Rows
  const actionRequiredItems = [
    {
      id: 'act-1',
      count: 12,
      label: 'Community patterns awaiting validation',
      route: '/validation/queue',
    },
    {
      id: 'act-2',
      count: 4,
      label: 'Challenges awaiting publication',
      route: '/challenge/formation',
    },
    {
      id: 'act-3',
      count: 7,
      label: 'Proposals awaiting decision',
      route: '/student/proposals',
    },
    {
      id: 'act-4',
      count: 3,
      label: 'Projects requiring milestone review',
      route: '/university/projects',
    },
  ]

  // Ecosystem Operational Health Indicators
  const ecosystemHealth = [
    { label: 'Community signal processing', percent: 86, width: 'w-[86%]' },
    { label: 'Challenge pipeline', percent: 92, width: 'w-[92%]' },
    { label: 'University participation', percent: 78, width: 'w-[78%]' },
    { label: 'Project progression', percent: 74, width: 'w-[74%]' },
    { label: 'Deployment conversion', percent: 41, width: 'w-[41%]' },
  ]

  // Problem to Impact Pipeline Steps
  const pipelineSteps = [
    { count: '1,248', label: 'COMMUNITY REPORTS', note: 'Citizen observations' },
    { count: '86', label: 'AI PATTERNS', note: 'Clustered signals' },
    { count: '42', label: 'VALIDATED PATTERNS', note: 'Mentor verified' },
    { count: '24', label: 'ACTIVE CHALLENGES', note: 'Open innovation' },
    { count: '31', label: 'PROJECTS', note: 'R&D student teams' },
    { count: '7', label: 'DEPLOYED', note: 'Field verified' },
  ]

  // Priority Problems Table
  const priorityProblems = [
    {
      id: 'SS-2026-00871',
      title: 'Unsafe Drinking Water in Gumla',
      domain: 'Water & Sanitation',
      location: 'Gumla District',
      severity: 'High',
      reports: 4,
      route: '/validation/queue',
    },
    {
      id: 'SS-2026-00872',
      title: 'Rice Disease Affecting Farmers',
      domain: 'Agriculture',
      location: 'Khunti District',
      severity: 'Medium',
      reports: 8,
      route: '/validation/queue',
    },
    {
      id: 'SS-2026-00873',
      title: 'Community Sanitation Issues',
      domain: 'Public Health',
      location: 'Ranchi Rural',
      severity: 'High',
      reports: 11,
      route: '/validation/queue',
    },
    {
      id: 'SS-2026-00874',
      title: 'Off-Grid Micro-Grid Battery Failure',
      domain: 'Energy & Hardware',
      location: 'Simdega District',
      severity: 'Medium',
      reports: 6,
      route: '/validation/queue',
    },
  ]

  // Recent Activity Feed
  const recentActivities = [
    { time: '2 min ago', text: 'New community problem submitted from Gumla district' },
    { time: '12 min ago', text: 'AI engine detected duplicate pattern cluster' },
    { time: '1 hour ago', text: 'Community signal validated by mentor Dr. Anjali Kumar' },
    { time: '3 hours ago', text: 'Ranchi University accepted Water Quality challenge' },
    { time: 'Today', text: 'Proposal approved for TRL 4 prototype development' },
  ]

  // Domain Overview Matrix
  const domainData = [
    { domain: 'Water & Sanitation', challenges: 7, projects: 9, deployed: 2 },
    { domain: 'Agriculture', challenges: 5, projects: 7, deployed: 1 },
    { domain: 'Healthcare', challenges: 4, projects: 5, deployed: 1 },
    { domain: 'Infrastructure', challenges: 3, projects: 4, deployed: 1 },
    { domain: 'Environment', challenges: 3, projects: 3, deployed: 1 },
    { domain: 'Livelihoods', challenges: 2, projects: 2, deployed: 1 },
    { domain: 'Accessibility', challenges: 1, projects: 1, deployed: 0 },
  ]

  return (
    <div className="space-y-6 text-on-surface">
      
      {/* 1. ADMIN HEADER */}
      <div className="border-b border-outline-variant/50 pb-4 space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
          SamadhanSetu Administration
        </h1>
        <p className="text-xs text-slate-600 font-normal">
          Jharkhand Civic Innovation Network • Monitor community signals, innovation challenges, institutional participation and solution delivery.
        </p>
      </div>

      {/* 2. ECOSYSTEM OVERVIEW (Horizontal Metrics Strip) */}
      <div className="bg-white rounded-xl border border-outline-variant/60 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-outline-variant/40 text-center">
          <div className="p-3.5 space-y-0.5">
            <div className="text-2xl font-extrabold text-on-surface font-mono">{metrics.communityReports.toLocaleString()}</div>
            <span className="text-[11px] font-medium text-slate-500 block">Community Reports</span>
          </div>

          <div className="p-3.5 space-y-0.5">
            <div className="text-2xl font-extrabold text-on-surface font-mono">{metrics.aiPatterns}</div>
            <span className="text-[11px] font-medium text-slate-500 block">AI Patterns</span>
          </div>

          <div className="p-3.5 space-y-0.5">
            <div className="text-2xl font-extrabold text-on-surface font-mono">{metrics.activeChallenges}</div>
            <span className="text-[11px] font-medium text-slate-500 block">Active Challenges</span>
          </div>

          <div className="p-3.5 space-y-0.5">
            <div className="text-2xl font-extrabold text-on-surface font-mono">{metrics.universities}</div>
            <span className="text-[11px] font-medium text-slate-500 block">Universities</span>
          </div>

          <div className="p-3.5 space-y-0.5">
            <div className="text-2xl font-extrabold text-on-surface font-mono">{metrics.activeProjects}</div>
            <span className="text-[11px] font-medium text-slate-500 block">Active Projects</span>
          </div>

          <div className="p-3.5 space-y-0.5 bg-emerald-50/40">
            <div className="text-2xl font-extrabold text-emerald-800 font-mono">{metrics.solutionsDeployed}</div>
            <span className="text-[11px] font-medium text-emerald-900 block">Solutions Deployed</span>
          </div>
        </div>
      </div>

      {/* 3. ACTION REQUIRED + ECOSYSTEM HEALTH (2-Column Upper Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Action Required (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-outline-variant/60 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="border-b border-outline-variant/40 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface">Action required</h2>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              26 Pending
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {actionRequiredItems.map((act) => (
              <div
                key={act.id}
                onClick={() => navigate(act.route)}
                className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/40 hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-brand-indigo font-bold shrink-0">{act.count}</span>
                  <span className="text-slate-800 font-medium">{act.label}</span>
                </div>
                <span className="text-brand-indigo font-semibold hover:underline shrink-0">Review &rarr;</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ecosystem Health (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-outline-variant/60 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="border-b border-outline-variant/40 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface">Ecosystem health</h2>
            <span className="text-[11px] text-slate-500 font-medium">Operational ratios</span>
          </div>

          <div className="space-y-2 text-xs">
            {ecosystemHealth.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>{item.label}</span>
                  <span className="font-mono text-on-surface font-semibold">{item.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.width} bg-brand-indigo rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. PROBLEM → IMPACT PIPELINE (Wide Process Flow) */}
      <div className="bg-white p-5 rounded-xl border border-outline-variant/60 shadow-2xs space-y-3">
        <div className="border-b border-outline-variant/40 pb-2">
          <h2 className="text-sm font-bold text-on-surface">Problem → Impact Pipeline</h2>
          <p className="text-xs text-slate-500 font-normal">
            How community observations move through validation, innovation and implementation.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-0.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">{step.label}</span>
              <div className="text-xl font-bold text-on-surface font-mono">{step.count}</div>
              <span className="text-[10px] text-slate-500 block">{step.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 2-COLUMN GRID: PRIORITY PROBLEMS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Priority Problems Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-outline-variant/60 shadow-2xs space-y-3">
          <div className="border-b border-outline-variant/40 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface">Priority problems</h2>
            <button
              type="button"
              onClick={() => navigate('/validation/queue')}
              className="text-xs font-semibold text-brand-indigo hover:underline cursor-pointer"
            >
              View all &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/40 text-slate-500 font-semibold text-[11px]">
                  <th className="pb-2">ID / Problem</th>
                  <th className="pb-2">Domain / Location</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2">Reports</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-slate-700">
                {priorityProblems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 pr-2 font-medium text-on-surface">
                      <span className="font-mono text-[11px] text-slate-500 block">{p.id}</span>
                      <span>{p.title}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="font-semibold block">{p.domain}</span>
                      <span className="text-[11px] text-slate-500">{p.location}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.severity === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono">{p.reports}</td>
                    <td className="py-2.5 pl-2 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(p.route)}
                        className="text-brand-indigo font-semibold hover:underline cursor-pointer"
                      >
                        Review &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-outline-variant/60 shadow-2xs space-y-3">
          <div className="border-b border-outline-variant/40 pb-2">
            <h2 className="text-sm font-bold text-on-surface">Recent activity</h2>
          </div>

          <div className="space-y-3 text-xs">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0 mt-1.5"></span>
                <div>
                  <span className="font-mono text-[11px] text-slate-500 block">{act.time}</span>
                  <p className="text-slate-800 font-medium leading-snug">{act.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. DOMAIN OVERVIEW TABLE (Lower Page Viewport Utilization) */}
      <div className="bg-white p-5 rounded-xl border border-outline-variant/60 shadow-2xs space-y-3">
        <div className="border-b border-outline-variant/40 pb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-on-surface">Domain overview</h2>
          <span className="text-xs text-slate-500 font-normal">Statewide innovation breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/40 text-slate-500 font-semibold text-[11px]">
                <th className="pb-2">Domain</th>
                <th className="pb-2 text-center">Active Challenges</th>
                <th className="pb-2 text-center">Active Projects</th>
                <th className="pb-2 text-right">Solutions Deployed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-slate-700 font-medium">
              {domainData.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 pr-2 font-semibold text-on-surface">{d.domain}</td>
                  <td className="py-2 px-2 text-center font-mono">{d.challenges}</td>
                  <td className="py-2 px-2 text-center font-mono">{d.projects}</td>
                  <td className="py-2 pl-2 text-right font-mono text-emerald-800 font-bold">{d.deployed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
