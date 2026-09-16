import { randomUUID } from 'crypto'

export const INITIAL_SUBMISSIONS = [
  {
    id: '00000000-0000-0000-0001-000000000001',
    ref_id: 'SS-00000001',
    raw_text: 'Borewell water in Gumla has yellow tint and foul smell. Children are falling sick after drinking it.',
    language: 'en',
    audio_url: null,
    submission_channel: 'WEB',
    status: 'CLUSTERED',
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    district: 'Gumla',
    state: 'Jharkhand',
    primary_domain: 'WATER QUALITY & SANITATION',
    severity_score: 8.5,
    ai_summary: 'Borewell Water Turbidity & Chemical Contamination',
    ai_model: 'llama-3.3-70b-versatile',
    has_embedding: true,
  },
  {
    id: '00000000-0000-0000-0001-000000000002',
    ref_id: 'SS-00000002',
    raw_text: 'हमारे गांव के नल से पानी बहुत खारा और मटमैला आ रहा है। फिल्टर की सख्त जरूरत है।',
    language: 'hi',
    audio_url: null,
    submission_channel: 'WEB',
    status: 'CLUSTERED',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    district: 'Gumla',
    state: 'Jharkhand',
    primary_domain: 'WATER QUALITY & SANITATION',
    severity_score: 8.0,
    ai_summary: 'Saline & Turbid Tap Water Supply',
    ai_model: 'llama-3.3-70b-versatile',
    has_embedding: true,
  },
  {
    id: '00000000-0000-0000-0001-000000000003',
    ref_id: 'SS-00000003',
    raw_text: 'हाथ के चापाकल का पानी पीने से पेट दर्द और दांतों में पीलापन हो रहा है। फ्लोराइड की समस्या है।',
    language: 'hi',
    audio_url: null,
    submission_channel: 'VOICE_CALL',
    status: 'CLUSTERED',
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    district: 'Gumla',
    state: 'Jharkhand',
    primary_domain: 'WATER QUALITY & SANITATION',
    severity_score: 9.0,
    ai_summary: 'Severe Fluorosis & Dental Staining from Handpumps',
    ai_model: 'llama-3.3-70b-versatile',
    has_embedding: true,
  },
  {
    id: '00000000-0000-0000-0001-000000000004',
    ref_id: 'SS-00000004',
    raw_text: 'Lack of timely canal water for potato fields in Kanke block. Soil moisture drying rapidly.',
    language: 'en',
    audio_url: null,
    submission_channel: 'WEB',
    status: 'SUBMITTED',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    district: 'Ranchi',
    state: 'Jharkhand',
    primary_domain: 'AGRICULTURE & RURAL LIVELIHOOD',
    severity_score: 6.5,
    ai_summary: 'Soil Moisture Deficit in Vegetable Fields',
    ai_model: 'llama-3.3-70b-versatile',
    has_embedding: true,
  },
]

export const INITIAL_CLUSTERS = [
  {
    id: '00000000-0000-0000-0002-000000000001',
    name: 'Drinking Water Quality & Heavy Metal Filtration',
    title: 'Drinking Water Quality & Heavy Metal Filtration',
    description: 'High levels of fluoride and heavy metals detected in village borewells affecting primary school drinking nodes across 3 blocks in Gumla district.',
    primary_domain: 'WATER & SANITATION',
    problem_count: 3,
    avg_severity: 8.5,
    emergence_score: 94,
    district: 'Gumla',
    blocks: '3 blocks · 12 villages',
    impact_level: 'HIGH IMPACT',
    match_score: 94,
    recommended_disciplines: ['Environmental Engineering', 'Water Resources', 'IoT Sensor Research'],
    why_this_matters: 'Recurring observations across 3 blocks indicate a possible regional water-quality pattern.',
    evidence_summary: '32 citizen reports · 4 field observations',
    locations: ['Gumla', 'Jharkhand'],
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    members: [
      { id: '00000000-0000-0000-0001-000000000001', text: 'Borewell water in Gumla village has yellow tint and foul smell.', district: 'Gumla', severity_score: 8.5 },
      { id: '00000000-0000-0000-0001-000000000002', text: 'Primary school water filtration system clogged with heavy sediment.', district: 'Gumla', severity_score: 8.0 },
      { id: '00000000-0000-0000-0001-000000000003', text: 'Drinking water causes stomach pain and yellow teeth.', district: 'Gumla', severity_score: 9.0 },
    ],
  },
]

export const INITIAL_CHALLENGES = [
  {
    id: '00000000-0000-0000-0003-000000000001',
    title: 'Solar-Powered Fluoride Removal System for Gumla Borewells',
    description: 'Design and prototype a scalable, low-cost gravity-fed or solar-assisted filtration unit removing excess fluoride (<1.0 mg/L) from community borewells.',
    status: 'OPEN',
    trl_stage: 1,
    domain: 'WATER & SANITATION',
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: '00000000-0000-0000-0003-000000000002',
    title: 'Smart Soil Moisture & Irrigation IoT for Ranchi Smallholders',
    description: 'Develop an affordable solar-powered IoT soil telemetry unit that automates drip valves during daylight hours.',
    status: 'MATCHING',
    trl_stage: 2,
    domain: 'AGRICULTURE',
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
  },
]

export const INITIAL_TEAMS = [
  {
    id: '00000000-0000-0000-0004-000000000001',
    name: 'KisanTech Innovators',
    challenge_id: '00000000-0000-0000-0003-000000000002',
    lead_user_id: '11111111-1111-1111-1111-111111111111',
    members_count: 2,
    members: [
      { id: 'mem-1', user_id: '11111111-1111-1111-1111-111111111111', email: 'student@demo.ac.in', role: 'Lead IoT Architect' },
      { id: 'mem-2', user_id: 'user-2', email: 'agro.eng@bitmesra.ac.in', role: 'Soil Science Lead' },
    ],
  },
]

export const INITIAL_PROJECTS = [
  {
    id: '00000000-0000-0000-0005-000000000001',
    challenge_id: '00000000-0000-0000-0003-000000000002',
    challenge_title: 'Smart Soil Moisture & Irrigation IoT for Ranchi Smallholders',
    team_id: '00000000-0000-0000-0004-000000000001',
    team_name: 'KisanTech Innovators',
    status: 'ACTIVE',
    trl_stage: 2,
    stage_label: 'LAB VALIDATION',
    progress_percent: 25,
    milestones_count: 4,
    completed_milestones_count: 1,
    milestones: [
      {
        id: '00000000-0000-0000-0006-000000000001',
        title: 'Phase 1: Field Research & Problem Specification',
        description: 'Survey 25 vegetable plots in Kanke block to map soil moisture profiles and irrigation timing.',
        status: 'COMPLETED',
        due_date: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: '00000000-0000-0000-0006-000000000002',
        title: 'Phase 2: MVP Prototype Design & Lab Assembly',
        description: 'Assemble ESP32 capacitive probe circuit with LoRa telemetry transmission.',
        status: 'IN_PROGRESS',
        due_date: new Date(Date.now() + 15 * 86400000).toISOString(),
      },
      {
        id: '00000000-0000-0000-0006-000000000003',
        title: 'Phase 3: Field Pilot Testing in Rural Community',
        description: 'Install 5 pilot sensor nodes on potato cultivation plots.',
        status: 'PENDING',
        due_date: new Date(Date.now() + 35 * 86400000).toISOString(),
      },
      {
        id: '00000000-0000-0000-0006-000000000004',
        title: 'Phase 4: Community Deployment & Handover',
        description: 'Handover farmer telemetry app to Kanke Krishi Vigyan Kendra.',
        status: 'PENDING',
        due_date: new Date(Date.now() + 60 * 86400000).toISOString(),
      },
    ],
  },
]

export const INITIAL_PROPOSALS = [
  {
    id: 'prop-001',
    challenge_id: '00000000-0000-0000-0003-000000000001',
    challenge_title: 'Solar-Powered Fluoride Removal System for Gumla Borewells',
    challenge_status: 'OPEN',
    team_id: '00000000-0000-0000-0004-000000000001',
    team_name: 'AquaInnovate Tech Team',
    title: 'Multi-Stage Activated Zeolite Filtration & IoT Telemetry',
    description: 'Construct a 50L/hr physical water purification unit utilizing natural zeolite substrate coupled with ESP32 sensor telemetry.',
    technical_approach: 'ICP-MS spectrometry validation, dual-chamber filter vessel, real-time pH & fluoride micro-controller telemetry.',
    expected_impact: 'Provide clean drinking water for 14,200 citizens across 3 blocks in Gumla district.',
    trl_stage: 1,
    status: 'Approved',
    raw_status: 'ACTIVE',
    decision: 'APPROVED',
    decision_reason: 'Strong sensor architecture and clear community impact plan.',
    rubric: {
      score_feasibility: 14,
      score_impact: 14,
      score_innovation: 9,
      score_team: 9,
      total_score: 46,
      max_score: 50,
    },
    members_count: 2,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
]

export const INITIAL_PARTNERS = [
  {
    id: 'partner-water-mission',
    organization_name: 'Jharkhand State Water Mission',
    category: 'GOVERNMENT',
    badge: 'Govt Mission',
    contact_person: 'Er. Rajesh Varma (Director of Rural Water Ops)',
    email: 'watermission.jh@gov.in',
    location: 'Ranchi, Jharkhand',
    focus_domains: ['Water Purification', 'Fluoride Filtration', 'Rural IoT Monitoring'],
    expertise: 'Statewide water infrastructure funding, Panchayat permissions, field pilot testbeds.',
    project_fit: '98% Match for Drinking Water Quality & Heavy Metal Filtration',
    active_projects_count: 2,
    status: 'ACTIVE',
    match_score: 98,
  },
]

// State store
class DataStore {
  constructor() {
    this.reset()
  }

  reset() {
    this.submissions = JSON.parse(JSON.stringify(INITIAL_SUBMISSIONS))
    this.clusters = JSON.parse(JSON.stringify(INITIAL_CLUSTERS))
    this.challenges = JSON.parse(JSON.stringify(INITIAL_CHALLENGES))
    this.teams = JSON.parse(JSON.stringify(INITIAL_TEAMS))
    this.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS))
    this.proposals = JSON.parse(JSON.stringify(INITIAL_PROPOSALS))
    this.partners = JSON.parse(JSON.stringify(INITIAL_PARTNERS))
    this.users = new Map()
    this.evidenceFiles = new Map()
  }
}

export const store = new DataStore()
export { randomUUID }
