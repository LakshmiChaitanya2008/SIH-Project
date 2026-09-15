import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router'
import { useSelector } from 'react-redux'

const CHALLENGE_DATABASE = {
  'ch-water-gumla': {
    id: 'ch-water-gumla',
    title: 'Drinking Water Quality & Heavy Metal Filtration',
    domain: 'Water & Sanitation',
    location: 'Ranchi, Jharkhand',
    district: 'Ranchi & Gumla Districts',
    reportsCount: 32,
    affectedPopulation: '14,200',
    severityScore: '8.8 / 10',
    fitScore: 94,
    problemStatement: `High concentrations of iron (Fe > 3.2 mg/L) and turbidity exceed BIS drinking water limits across hand pumps in 12 villages. Local groundwater contamination causes health hazards, tooth staining, and GI distress among 14,200 residents. Standard government hand pumps lack inline filtration systems capable of running without grid power.`,
    communityEvidence: {
      reports: 32,
      villages: ['Gumla Sadar', 'Bero Block', 'Lapung Panchayat', 'Ranchi Rural'],
      evidenceList: [
        'Lab tests confirm 3.4 mg/L iron content (limit is 1.0 mg/L).',
        'Water discolors to reddish-brown within 15 minutes of pumping.',
        'Over 85% of households rely solely on hand pump groundwater.',
        'High turbidity prevents UV and chemical disinfections without pre-filtration.',
      ],
    },
    requirements: [
      'Low-cost inline physical filter fitment for standard India Mark II hand pumps.',
      'Reduces iron content below 0.3 mg/L and turbidity below 5 NTU.',
      'Operates with zero grid electrical power using gravity flow or hydraulic pressure.',
      'Integrates ESP32-based battery/solar water quality sensor telemetry (pH, Turbidity, TDS).',
      'Unit cost under ₹4,500 with filter media reusable or cleanable by community operators.',
    ],
    disciplines: [
      'Environmental & Water Engineering',
      'Chemical & Material Filtration Sciences',
      'Computer Science & IoT Sensor Systems',
      'Public Health & Community Sanitation',
    ],
    skillsNeeded: [
      'Water Testing',
      'IoT Sensors',
      'Filtration Media',
      'Embedded Computing',
      'Field Testing',
      'Community Outreach',
    ],
    activeTeam: 'Team AquaSense',
  },
  'ch-agri-blast': {
    id: 'ch-agri-blast',
    title: 'Paddy Leaf Blast & Fungal Spore Early Detection AI',
    domain: 'Agriculture & Rural Systems',
    location: 'Khunti, Jharkhand',
    district: 'Khunti & Ranchi Districts',
    reportsCount: 18,
    affectedPopulation: '8,500',
    severityScore: '7.9 / 10',
    fitScore: 91,
    problemStatement: `Magnaporthe oryzae fungal blast destroys up to 40% of smallholder paddy yield during humid monsoon months across Khunti district. Farmers lack early-stage diagnostic tools, applying broad-spectrum pesticides after severe crop damage occurs.`,
    communityEvidence: {
      reports: 18,
      villages: ['Khunti Block', 'Murhu Panchayat', 'Torpa Village'],
      evidenceList: [
        'Crop damage reported across 420 hectares of paddy fields.',
        'Humidity levels > 85% correlate with rapid spore outbreaks.',
        '92% of farmers use feature phones without high-speed internet.',
      ],
    },
    requirements: [
      'Offline edge AI computer vision model executable on low-cost smartphones or micro-cameras.',
      'Identifies leaf lesion patterns with > 88% diagnostic accuracy.',
      'Provides localized treatment advisory in Hindi and Mundari.',
    ],
    disciplines: [
      'Agronomy & Plant Pathology',
      'Computer Science & Artificial Intelligence',
      'Rural Extension & Communications',
    ],
    skillsNeeded: ['Edge AI', 'Plant Pathology', 'Computer Vision', 'Mobile App Dev'],
    activeTeam: null,
  },
  'ch-solar-meter': {
    id: 'ch-solar-meter',
    title: 'Low-Power Solar Smart Meter for Rural Micro-Grids',
    domain: 'Smart Hardware & Energy',
    location: 'Simdega, Jharkhand',
    district: 'Simdega & West Singhbhum',
    reportsCount: 14,
    affectedPopulation: '6,200',
    severityScore: '7.5 / 10',
    fitScore: 88,
    problemStatement: `Off-grid solar micro-grids in remote Simdega hamlets experience battery deep discharge due to unmonitored load spikes. Existing commercial smart meters are too expensive and require cellular network coverage not available in tribal forest areas.`,
    communityEvidence: {
      reports: 14,
      villages: ['Simdega Town', 'Bano Panchayat', 'Kolebira Village'],
      evidenceList: [
        'Micro-grid outages occur 4 times a week during peak evening loads.',
        'Cellular connectivity is absent in 6 out of 10 micro-grid locations.',
      ],
    },
    requirements: [
      'Sub-₹1,200 LoRa/RF mesh smart energy meter unit.',
      'Tracks kWh consumption, battery SOC, and automatically sheds non-essential loads.',
      'Operates reliably under harsh ambient temperatures up to 45°C.',
    ],
    disciplines: ['Electrical Engineering', 'Embedded IoT Systems', 'Renewable Energy'],
    skillsNeeded: ['Embedded Systems', 'ESP32', 'Micro-controller Assembly', 'RF Communication'],
    activeTeam: null,
  },
}

export default function StudentChallengeDetailView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const challenge = CHALLENGE_DATABASE[id] || CHALLENGE_DATABASE['ch-water-gumla']
  const [hasTeam, setHasTeam] = useState(true) // Demo state showing student is part of Team AquaSense

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface">
      <main className="flex-grow pt-8 pb-20 px-6 md:px-margin-desktop max-w-[1240px] mx-auto w-full space-y-8">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/student/explorer')}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span> Back to Explore Challenges
          </button>
        </div>

        {/* 1. TOP HEADER & INSTITUTIONAL FIT */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 border border-brand-teal/20 px-3 py-1 rounded-full">
                COMMUNITY INNOVATION CHALLENGE
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">• {challenge.domain}</span>
              <span className="text-xs text-on-surface-variant font-semibold">• {challenge.location}</span>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span>
              {challenge.fitScore}% Ranchi University Fit
            </span>
          </div>

          <h1 className="font-display-lg text-brand-indigo text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {challenge.title}
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Target District: <strong className="text-brand-indigo">{challenge.district}</strong> — Validated civic challenge sourced from recurring community reports.
          </p>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50 space-y-1">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">COMMUNITY REPORTS</span>
              <div className="text-2xl font-extrabold text-brand-indigo font-mono">{challenge.reportsCount} Verified</div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50 space-y-1">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">POTENTIALLY AFFECTED</span>
              <div className="text-2xl font-extrabold text-brand-violet font-mono">{challenge.affectedPopulation} Citizens</div>
            </div>

            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 space-y-1">
              <span className="text-[10px] text-rose-900 font-bold uppercase tracking-wider block">SEVERITY SCORE</span>
              <div className="text-2xl font-extrabold text-rose-700 font-mono">{challenge.severityScore}</div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] text-emerald-900 font-bold uppercase tracking-wider block">INSTITUTIONAL FIT</span>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono">{challenge.fitScore}% Match</div>
            </div>
          </div>
        </div>

        {/* 2. PROBLEM STATEMENT & COMMUNITY EVIDENCE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-6">
            {/* Problem Statement */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-brand-indigo font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base text-brand-violet">report_problem</span>
                PROBLEM STATEMENT
              </div>
              <p className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {challenge.problemStatement}
              </p>
            </div>

            {/* What Needs To Be Solved */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-brand-indigo font-bold text-xs uppercase tracking-wider border-b border-outline-variant/40 pb-2">
                <span className="material-symbols-outlined text-base text-brand-violet">check_circle</span>
                WHAT NEEDS TO BE SOLVED (SOLUTION REQUIREMENTS)
              </div>
              <ul className="space-y-2 text-xs text-on-surface">
                {challenge.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-emerald-600 shrink-0 mt-0.5">task_alt</span>
                    <span className="leading-snug">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Community Evidence Side Panel (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-brand-indigo font-bold text-xs uppercase tracking-wider border-b border-outline-variant/40 pb-2">
                <span className="material-symbols-outlined text-base text-brand-violet">analytics</span>
                COMMUNITY EVIDENCE &amp; LOCATIONS
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-on-surface-variant">
                  <span>Affected Villages:</span>
                  <span className="text-brand-indigo font-bold">{challenge.communityEvidence.villages.join(', ')}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-outline-variant/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">RECURRING OBSERVATIONS</span>
                <div className="space-y-2">
                  {challenge.communityEvidence.evidenceList.map((ev, idx) => (
                    <div key={idx} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs text-brand-indigo leading-snug">
                      • {ev}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Disciplines & Skills Needed */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/70 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-brand-indigo font-bold text-xs uppercase tracking-wider border-b border-outline-variant/40 pb-2">
                <span className="material-symbols-outlined text-base text-brand-violet">school</span>
                RECOMMENDED DISCIPLINES &amp; SKILLS
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant block uppercase mb-1">Target Academic Departments</span>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.disciplines.map((d, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-violet/10 text-brand-violet font-semibold border border-brand-violet/20">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/40">
                  <span className="text-[10px] font-bold text-on-surface-variant block uppercase mb-1">Skills Needed for Prototype</span>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.skillsNeeded.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-surface-container-low text-brand-indigo font-medium border border-outline-variant/50">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. READY TO WORK ON THIS CHALLENGE? CTA BAR */}
        <div className="bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-indigo p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-950/40 border border-emerald-400/30 px-3 py-1 rounded-full">
              JOIN THE INNOVATION PIPELINE
            </span>
            <h3 className="font-headline-md text-2xl font-bold text-white">
              READY TO WORK ON THIS CHALLENGE?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Form a multidisciplinary student team, submit your technical proposal to Ranchi University faculty mentors, and start building your field prototype.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => navigate('/student/team-formation', { state: { challenge } })}
              className="w-full sm:w-auto bg-white text-brand-indigo hover:bg-slate-100 px-6 py-3 rounded-full font-label-md text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">groups</span>
              <span>{challenge.activeTeam ? 'Continue With Team AquaSense' : 'Create / Join Team'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/student/proposals', { state: { challenge } })}
              className="w-full sm:w-auto border border-white/50 text-white hover:bg-white/10 px-6 py-3 rounded-full font-label-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">description</span>
              <span>Submit Proposal</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
