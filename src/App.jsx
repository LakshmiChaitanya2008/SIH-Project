import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { AuthProvider, ProtectedRoute } from './lib/auth'
import Layout from './components/Layout'

import IntroView from './views/IntroView'
import RoleSelectionView from './views/RoleSelectionView'
import HowItWorksView from './views/HowItWorksView'
import AuthView from './views/AuthView'
import CitizenAccessView from './views/CitizenAccessView'

import CitizenWelcomeView from './views/CitizenWelcomeView'
import ReportMethodView from './views/ReportMethodView'
import VoiceReportView from './views/VoiceReportView'
import TextReportView from './views/TextReportView'
import ReportReviewView from './views/ReportReviewView'
import CitizenEvidenceView from './views/CitizenEvidenceView'
import CitizenLocationView from './views/CitizenLocationView'
import CitizenFinalReviewView from './views/CitizenFinalReviewView'
import CitizenSubmittedView from './views/CitizenSubmittedView'
import MyReportsView from './views/MyReportsView'
import MyProblemsView from './views/MyProblemsView'
import TrackProblemsView from './views/TrackProblemsView'
import CitizenProfileView from './views/CitizenProfileView'
import CitizenAIUnderstandingView from './views/CitizenAIUnderstandingView'
import CitizenAIConfirmationView from './views/CitizenAIConfirmationView'
import CommunitySignalConfirmedView from './views/CommunitySignalConfirmedView'
import CommunityPatternsView from './views/CommunityPatternsView'
import CommunityPatternDetailView from './views/CommunityPatternDetailView'
import MentorDashboardView from './views/MentorDashboardView'
import ValidationQueueView from './views/ValidationQueueView'
import PatternValidationView from './views/PatternValidationView'
import ChallengeFormationView from './views/ChallengeFormationView'
import ChallengePublishedView from './views/ChallengePublishedView'
import PublishedChallengesView from './views/PublishedChallengesView'
import StudentProposalsView from './views/StudentProposalsView'
import ProposalDetailView from './views/ProposalDetailView'
import TeamFormationView from './views/TeamFormationView'
import ProjectDetailView from './views/ProjectDetailView'
import MilestoneDetailView from './views/MilestoneDetailView'
import CollaborationsView from './views/CollaborationsView'
import UniversityProfileView from './views/UniversityProfileView'
import ProjectsView from './views/ProjectsView'
import CompletedSolutionView from './views/CompletedSolutionView'
import UniversityAccessView from './views/UniversityAccessView'
import StudentExplorerView from './views/StudentExplorerView'
import PartnerPlaceholderView from './views/PartnerPlaceholderView'
import StudentDashboardView from './views/StudentDashboardView'
import StudentChallengeDetailView from './views/StudentChallengeDetailView'
import StudentProfileView from './views/StudentProfileView'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/" element={<IntroView />} />
              <Route path="/role-selection" element={<RoleSelectionView />} />
              <Route path="/how-it-works" element={<HowItWorksView />} />
              <Route path="/auth" element={<AuthView />} />

              {/* Citizen Access & Auth */}
              <Route path="/citizen/access" element={<CitizenAccessView />} />
              <Route path="/citizen/signin" element={<Navigate to="/auth" replace />} />
              <Route path="/citizen/signup" element={<Navigate to="/auth" replace />} />

              {/* Citizen Protected Routes */}
              <Route path="/citizen/home" element={<ProtectedRoute><CitizenWelcomeView /></ProtectedRoute>} />
              <Route path="/citizen/report/method" element={<ReportMethodView />} />
              <Route path="/citizen/report/voice" element={<VoiceReportView />} />
              <Route path="/citizen/report/text" element={<TextReportView />} />
              <Route path="/citizen/report/review" element={<ReportReviewView />} />
              <Route path="/citizen/report/evidence" element={<CitizenEvidenceView />} />
              <Route path="/citizen/report/location" element={<CitizenLocationView />} />
              <Route path="/citizen/report/final-review" element={<CitizenFinalReviewView />} />
              <Route path="/citizen/report/submitted" element={<CitizenSubmittedView />} />

              <Route path="/citizen/my-reports" element={<ProtectedRoute><MyReportsView /></ProtectedRoute>} />
              <Route path="/citizen/my-problems" element={<ProtectedRoute><MyProblemsView /></ProtectedRoute>} />
              <Route path="/citizen/track-problems" element={<TrackProblemsView />} />
              <Route path="/citizen/track/:id" element={<TrackProblemsView />} />
              <Route path="/citizen/profile" element={<ProtectedRoute><CitizenProfileView /></ProtectedRoute>} />

              {/* AI Understanding & Verification Pipeline */}
              <Route path="/citizen/ai-understanding" element={<CitizenAIUnderstandingView />} />
              <Route path="/citizen/ai-confirmation" element={<CitizenAIConfirmationView />} />
              <Route path="/community/signal-confirmed" element={<CommunitySignalConfirmedView />} />

              {/* Community Patterns & Clusters */}
              <Route path="/community/patterns" element={<CommunityPatternsView />} />
              <Route path="/community/pattern/:id" element={<CommunityPatternDetailView />} />

              {/* University Mentor / Admin Protected Routes */}
              <Route path="/mentor/dashboard" element={<ProtectedRoute requiredRole="mentor"><MentorDashboardView /></ProtectedRoute>} />
              <Route path="/validation/queue" element={<ProtectedRoute requiredRole="mentor"><ValidationQueueView /></ProtectedRoute>} />
              <Route path="/validation/pattern" element={<ProtectedRoute requiredRole="mentor"><PatternValidationView /></ProtectedRoute>} />
              <Route path="/challenge/formation" element={<ProtectedRoute requiredRole="mentor"><ChallengeFormationView /></ProtectedRoute>} />
              <Route path="/challenge/published" element={<ProtectedRoute requiredRole="mentor"><ChallengePublishedView /></ProtectedRoute>} />
              
              {/* Student Innovation Portal Routes */}
              <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboardView /></ProtectedRoute>} />
              <Route path="/challenges" element={<PublishedChallengesView />} />
              <Route path="/explore-challenges" element={<PublishedChallengesView />} />
              <Route path="/student/explorer" element={<StudentExplorerView />} />
              <Route path="/student/challenge/:id" element={<ProtectedRoute><StudentChallengeDetailView /></ProtectedRoute>} />
              <Route path="/student/profile" element={<ProtectedRoute><StudentProfileView /></ProtectedRoute>} />

              {/* Student Proposal & Project Routes */}
              <Route path="/student/proposals" element={<ProtectedRoute><StudentProposalsView /></ProtectedRoute>} />
              <Route path="/student/proposal/:id" element={<ProtectedRoute><ProposalDetailView /></ProtectedRoute>} />
              <Route path="/student/team-formation" element={<ProtectedRoute><TeamFormationView /></ProtectedRoute>} />
              <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailView /></ProtectedRoute>} />
              <Route path="/project/milestone/:id" element={<ProtectedRoute><MilestoneDetailView /></ProtectedRoute>} />

              {/* University Workspace */}
              <Route path="/university/access" element={<UniversityAccessView />} />
              <Route path="/university/dashboard" element={<ProtectedRoute requiredRole="mentor"><MentorDashboardView /></ProtectedRoute>} />
              <Route path="/university/profile" element={<ProtectedRoute requiredRole="mentor"><UniversityProfileView /></ProtectedRoute>} />
              <Route path="/university/projects" element={<ProtectedRoute requiredRole="mentor"><ProjectsView /></ProtectedRoute>} />
              <Route path="/university/collaborations" element={<ProtectedRoute requiredRole="mentor"><CollaborationsView /></ProtectedRoute>} />
              <Route path="/completed-solution" element={<CompletedSolutionView />} />
              <Route path="/completed-solution/:id" element={<CompletedSolutionView />} />

              {/* Partner Placeholders */}
              <Route path="/partner/placeholder" element={<PartnerPlaceholderView />} />
              <Route path="/partner/dashboard" element={<PartnerPlaceholderView />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}
