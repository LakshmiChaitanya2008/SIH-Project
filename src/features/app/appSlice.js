import { createSlice } from '@reduxjs/toolkit'
import { demoCommunitySignals } from '../../data/demoCommunitySignals'
import { demoChallenges } from '../../data/demoChallenges'
import { PatternDetectionService } from '../../services/PatternDetectionService'

const initialReportDraft = {
  method: null,
  description: '',
  voiceRecorded: false,
  voiceDuration: '00:00',
  voiceAudioId: null,
  voiceAudioUrl: null,
  voiceTranscript: '',
  evidence: [],
  location: null,
  consentGiven: false,
  submitting: false,
  submissionError: null,
  submitted: false,
  reportId: null
}

const getInitialLanguage = () => {
  try {
    return localStorage.getItem('samadhan_selected_language') || 'en'
  } catch (e) {
    return 'en'
  }
}

const initialState = {
  currentRoute: 'intro',
  isAuthenticated: false,
  userRole: null,
  selectedLanguage: getInitialLanguage(),
  helpModalOpen: false,
  activeAIUnderstanding: null,
  activePatternDetail: null,
  activeTrackedProblemId: null,
  activeValidationPattern: null,
  activeChallengeDraft: null,
  publishedChallengeSuccess: null,
  userProfile: {
    name: 'Ramesh Sharma',
    location: 'Gumla District, Jharkhand',
    department: 'Community Member',
    roleTitle: 'Verified Citizen',
    phone: '+91 94311 88221',
    reportedCount: 3,
    resolvedCount: 1
  },
  notifications: [
    {
      id: 'notif_1',
      title: 'Report Under Review',
      message: 'Your report (SS-2026-00401) on Water Hand Pump Discoloration is being analyzed.',
      time: '10 mins ago',
      unread: true,
      route: 'track-problems'
    },
    {
      id: 'notif_2',
      title: 'Community Pattern Clustered',
      message: '3 similar observations were clustered across Gumla and Latehar.',
      time: '2 hours ago',
      unread: true,
      route: 'community-patterns'
    },
    {
      id: 'notif_3',
      title: 'Challenge Created',
      message: 'An innovation challenge was formed for rural drinking water quality.',
      time: '1 day ago',
      unread: false,
      route: 'explore-challenges'
    }
  ],
  reportDraft: { ...initialReportDraft },
  communitySignals: [
    {
      id: 'SS-2026-00401',
      title: 'Water Hand Pump Discoloration & Chemical Odor',
      description: 'The groundwater from our village hand pump has turned rusty brown after monsoon rains.',
      method: 'voice',
      voiceDuration: '00:24',
      primaryDomain: 'Water Quality & Sanitation',
      relatedDomains: ['Community Health'],
      location: 'Gumla Sector 4, Jharkhand',
      date: '2026-08-28',
      status: 'Confirmed community signal',
      evidenceCount: 2,
      evidence: [
        { name: 'pump_water.jpg', type: 'image', caption: 'Brown discolored water sample' }
      ],
      understanding: {
        primaryDomain: 'Water Quality & Sanitation',
        relatedDomains: ['Community Health'],
        issueSummary: 'Groundwater discoloration and potential public health risk.',
        affectedGroups: ['Children', 'Families'],
        possibleImpacts: ['Drinking water contamination', 'Waterborne illness risk'],
        extractedLocation: 'Gumla Sector 4, Jharkhand',
        confirmedByCitizen: true
      }
    }
  ],
  communityPatterns: [],
  challenges: [...demoChallenges],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setRole(state, action) {
      state.userRole = action.payload
    },
    setLanguage(state, action) {
      state.selectedLanguage = action.payload
      try {
        localStorage.setItem('samadhan_selected_language', action.payload)
      } catch (e) {
        // ignore storage errors
      }
    },
    setHelpModal(state, action) {
      state.helpModalOpen = action.payload
    },
    setCurrentRoute(state, action) {
      state.currentRoute = action.payload
    },
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload
    },
    setUserProfile(state, action) {
      state.userProfile = { ...state.userProfile, ...action.payload }
    },
    updateReportDraft(state, action) {
      Object.assign(state.reportDraft, action.payload)
    },
    resetReportDraft(state) {
      state.reportDraft = { ...initialReportDraft }
    },
    addEvidence(state, action) {
      state.reportDraft.evidence.push(action.payload)
    },
    removeEvidence(state, action) {
      state.reportDraft.evidence.splice(action.payload, 1)
    },
    updateEvidenceCaption(state, action) {
      const { index, caption } = action.payload
      if (state.reportDraft.evidence[index]) {
        state.reportDraft.evidence[index].caption = caption
      }
    },
    setSubmitting(state, action) {
      state.reportDraft.submitting = action.payload
      if (action.payload) state.reportDraft.submissionError = null
    },
    setSubmissionError(state, action) {
      state.reportDraft.submitting = false
      state.reportDraft.submissionError = action.payload
    },
    setSubmissionSuccess(state, action) {
      const { refId, signal } = action.payload
      state.reportDraft.submitting = false
      state.reportDraft.submitted = true
      state.reportDraft.reportId = refId
      state.reportDraft.submissionError = null
      state.activeTrackedProblemId = refId
      if (signal) {
        state.communitySignals.unshift(signal)
      }
    },
    submitReport(state) {
      const draft = state.reportDraft
      const reportId = draft.reportId || ('SS-2026-00' + Math.floor(100 + Math.random() * 900))
      const newSignal = {
        id: reportId,
        title: draft.description ? draft.description.substring(0, 50) + '...' : 'Community Civic Signal',
        description: draft.description || 'Voice Note Recorded (' + (draft.voiceDuration || '00:15') + ')',
        method: draft.method,
        voiceDuration: draft.voiceDuration,
        location: draft.location?.label || 'Gumla District, Jharkhand',
        date: new Date().toISOString().split('T')[0],
        status: 'Under Review',
        evidenceCount: draft.evidence.length,
        evidence: [...draft.evidence]
      }
      state.communitySignals.unshift(newSignal)
      state.reportDraft.submitted = true
      state.reportDraft.reportId = reportId
      state.activeTrackedProblemId = reportId
    },
    confirmAIUnderstanding(state, action) {
      const understanding = action.payload
      state.activeAIUnderstanding = { ...understanding, confirmedByCitizen: true }
      if (understanding?.id || understanding?.refId) {
        state.activeTrackedProblemId = understanding.refId || understanding.id
      }
      if (state.communitySignals[0]) {
        state.communitySignals[0].status = 'Confirmed community signal'
        state.communitySignals[0].understanding = state.activeAIUnderstanding
      }
    },
    setActiveAIUnderstanding(state, action) {
      state.activeAIUnderstanding = action.payload
    },
    setActivePatternDetail(state, action) {
      state.activePatternDetail = action.payload
    },
    setCommunityPatterns(state, action) {
      state.communityPatterns = action.payload
    },
    runPatternDetection(state) {
      const combinedSignals = [...state.communitySignals, ...demoCommunitySignals]
      state.communityPatterns = PatternDetectionService.detectPatterns(combinedSignals)
    },
    openPatternForValidation(state, action) {
      if (!state.communityPatterns.length) {
        const combinedSignals = [...state.communitySignals, ...demoCommunitySignals]
        state.communityPatterns = PatternDetectionService.detectPatterns(combinedSignals)
      }
      state.activeValidationPattern =
        state.communityPatterns.find(p => p.id === action.payload) || state.communityPatterns[0]
    },
    createChallengeDraft(state, action) {
      const pat = action.payload || state.activeValidationPattern || state.communityPatterns[0]
      if (!pat) return
      state.activeChallengeDraft = {
        id: 'CH-2026-00' + (state.challenges.length + 1),
        title: pat.title || 'Rural Water Quality & Public Health Risk',
        problemStatement: `Communities across ${pat.locations?.join(', ') || 'multiple districts'} are reporting recurring concerns about ${pat.primaryDomain?.toLowerCase() || 'drinking water conditions'} and potential health impacts.`,
        whoIsAffected: `${pat.affectedGroups?.join(' and ') || 'Families and children'} in affected rural hamlets.`,
        whyItMatters: `Multiple independent observations (${pat.signalCount || 4} signals across ${pat.locations?.length || 3} districts) suggest this represents a broader community challenge rather than an isolated incident.`,
        primaryDomain: pat.primaryDomain || 'Water Quality & Sanitation',
        relatedDomains: pat.relatedDomains || ['Healthcare & Public Health'],
        affectedGroups: pat.affectedGroups || ['Families', 'Children'],
        locations: pat.locations || ['Gumla', 'Latehar', 'Simdega'],
        signalCount: pat.signalCount || 4,
        sourcePatternId: pat.id || 'PATTERN-001',
        focusAreas: ['Water quality monitoring', 'Early detection systems', 'Community alert tools', 'Safe water access'],
        validatorNotes: '',
        status: 'Draft',
        createdAt: new Date().toISOString()
      }
    },
    updateChallengeDraft(state, action) {
      if (state.activeChallengeDraft) {
        Object.assign(state.activeChallengeDraft, action.payload)
      }
    },
    addFocusArea(state, action) {
      if (state.activeChallengeDraft) {
        state.activeChallengeDraft.focusAreas.push(action.payload)
      }
    },
    removeFocusArea(state, action) {
      if (state.activeChallengeDraft) {
        state.activeChallengeDraft.focusAreas.splice(action.payload, 1)
      }
    },
    publishChallenge(state) {
      const draft = state.activeChallengeDraft
      if (!draft) return
      const challengeObj = {
        ...draft,
        status: 'Open',
        publishedAt: new Date().toISOString()
      }
      state.challenges.unshift(challengeObj)
      if (state.activeValidationPattern) {
        state.activeValidationPattern.status = 'Validated'
        state.activeValidationPattern.createdChallengeId = challengeObj.id
      }
      state.publishedChallengeSuccess = challengeObj
    },
    startNewReport(state) {
      state.reportDraft = { ...initialReportDraft }
    }
  }
})

export const {
  setRole,
  setLanguage,
  setHelpModal,
  setCurrentRoute,
  setAuthenticated,
  updateReportDraft,
  resetReportDraft,
  addEvidence,
  removeEvidence,
  updateEvidenceCaption,
  submitReport,
  confirmAIUnderstanding,
  setActiveAIUnderstanding,
  setActivePatternDetail,
  setCommunityPatterns,
  runPatternDetection,
  openPatternForValidation,
  createChallengeDraft,
  updateChallengeDraft,
  addFocusArea,
  removeFocusArea,
  publishChallenge,
  startNewReport,
  setUserProfile,
  setSubmitting,
  setSubmissionError,
  setSubmissionSuccess
} = appSlice.actions

export default appSlice.reducer
