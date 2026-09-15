import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { updateReportDraft, setSubmissionSuccess, setSubmissionError, setActiveAIUnderstanding } from '../features/app/appSlice';
import { api } from '../lib/api';
import { evidenceStore } from '../lib/evidenceStore';
import { useTranslation } from '../lib/useTranslation';

export default function CitizenFinalReviewView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const draft = useSelector((state) => state.app.reportDraft);
  const isVoice = draft.method === 'voice' || draft.voiceRecorded;
  const evidenceList = draft.evidence || [];
  const locationLabel = draft.location?.label || 'Gumla District, Jharkhand';
  const district = draft.location?.district || 'Gumla';
  const stateName = draft.location?.state || 'Jharkhand';

  const [consentGiven, setConsentGiven] = useState(draft.consentGiven || false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { num: '1', key: 'step1', icon: 'check', titleKey: 'step1', subKey: 'step1Sub', active: false, completed: true },
    { num: '2', key: 'step2', icon: 'check', titleKey: 'step2', subKey: 'step2Sub', active: false, completed: true },
    { num: '3', key: 'step3', icon: 'check', titleKey: 'step3', subKey: 'step3Sub', active: false, completed: true },
    { num: '4', key: 'step4', icon: 'fact_check', titleKey: 'step4', subKey: 'step4Sub', active: true, completed: false },
    { num: '5', key: 'step5', icon: 'task_alt', titleKey: 'step5', subKey: 'step5Sub', active: false, completed: false }
  ];

  const handleConsentToggle = () => {
    setConsentGiven(!consentGiven);
    dispatch(updateReportDraft({ consentGiven: !consentGiven }));
  };

  const handleSubmit = async () => {
    if (!consentGiven || submitting || showSuccessOverlay) return;

    setError('');
    setSubmitting(true);
    setSubmitStatus('Submitting report…');

    try {
      const uploadedEvidence = [];
      let finalVoiceAudioUrl = draft.voiceAudioUrl || null;

      if (draft.voiceAudioId || draft.voiceAudioUrl) {
        if (finalVoiceAudioUrl || draft.voiceAudioId) {
          uploadedEvidence.push({
            storage_path: finalVoiceAudioUrl || 'local_voice_note.webm',
            file_type: 'audio',
            caption: `Voice Note (${draft.voiceDuration || '00:15'})`,
          });
        }
      }

      if (evidenceList.length > 0) {
        for (const item of evidenceList) {
          uploadedEvidence.push({
            storage_path: item.previewUrl || item.name || '',
            file_type: item.type || 'image',
            caption: item.caption || '',
          });
        }
      }

      let createdRefId = 'SS-2026-00' + Math.floor(100 + Math.random() * 900);
      let response = null;

      try {
        response = await api.createSubmission({
          method: draft.method || (isVoice ? 'voice' : 'text'),
          raw_text: draft.description || (isVoice ? 'Community voice report recorded.' : 'Community civic report.'),
          transcription: draft.voiceTranscript || draft.description || null,
          voice_audio_url: finalVoiceAudioUrl,
          location_label: locationLabel,
          district: district,
          state: stateName,
          latitude: draft.location?.latitude || null,
          longitude: draft.location?.longitude || null,
          language: 'en',
          evidence: uploadedEvidence,
        });

        if (response?.submission?.ref_id) {
          createdRefId = response.submission.ref_id;

          if (response.submission.primary_domain) {
            dispatch(setActiveAIUnderstanding({
              primaryDomain: response.submission.primary_domain,
              relatedDomains: response.submission.related_domains || [],
              issueSummary: response.submission.ai_summary || draft.description,
              affectedGroups: response.submission.affected_groups || ['Local Community'],
              possibleImpacts: response.submission.possible_impacts || ['Community impact requiring inspection'],
              severity: response.submission.severity || 'medium',
              entities: response.submission.entities || {},
              extractedLocation: locationLabel,
              hasEmbedding: !!response.submission.embedding,
              provider: response.submission.ai_provider || 'groq',
              model: response.submission.ai_model || 'llama-3.3-70b-versatile',
              confirmedByCitizen: false,
              processedAt: response.submission.created_at || new Date().toISOString(),
            }));
          }
        }
      } catch (apiErr) {
        console.warn('[API Submission Warning]:', apiErr.message);
        setError(`Note: Submission saved in local offline mode (${apiErr.message}).`);
      }

      evidenceStore.clear();

      const newSignal = {
        id: createdRefId,
        title: draft.description ? draft.description.substring(0, 50) + '...' : 'Community Civic Signal',
        description: draft.description || 'Voice Note Recorded (' + (draft.voiceDuration || '00:15') + ')',
        method: draft.method || (isVoice ? 'voice' : 'text'),
        voiceDuration: draft.voiceDuration || '00:15',
        voiceAudioUrl: finalVoiceAudioUrl,
        location: locationLabel,
        district: district,
        date: new Date().toISOString().split('T')[0],
        status: 'Under Review',
        evidenceCount: uploadedEvidence.length,
        evidence: uploadedEvidence,
      };

      dispatch(setSubmissionSuccess({
        refId: createdRefId,
        signal: newSignal,
      }));

      // Trigger pre-navigation success animation overlay
      setShowSuccessOverlay(true);

      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const navDelay = prefersReducedMotion ? 700 : 1500;

      setTimeout(() => {
        navigate('/citizen/report/submitted');
      }, navDelay);

    } catch (err) {
      setError(err.message || 'Submission failed. Please check your connection and try again.');
      dispatch(setSubmissionError(err.message));
      setSubmitting(false);
      setSubmitStatus('');
    }
  };

  return (
    <main className="flex-grow py-3 sm:py-4 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-between relative text-on-surface">
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-start space-y-3">

        {/* 1. Header: Back Navigation & Step Tag */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => navigate('/citizen/report/location')}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-semibold transition-colors group cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-0.5 px-1"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
            <span>{t('reporting.common.back')}</span>
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-brand-violet uppercase bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            {t('reporting.review.stepTag')}
          </span>
        </div>

        {/* 2. Compact 5-Milestone Journey Line */}
        <div className="w-full py-1.5 border-b border-outline-variant/30 min-h-[75px]">
          <div className="relative w-full">
            {/* Background Line */}
            <div className="absolute top-4 left-[6%] right-[6%] h-0.5 bg-outline-variant/40 -translate-y-1/2 z-0 hidden sm:block" />
            
            {/* Active Step Line (Step 1 -> Step 2 -> Step 3 -> Step 4) */}
            <div className="absolute top-4 left-[6%] w-[72%] h-0.5 bg-brand-indigo -translate-y-1/2 z-0 hidden sm:block" />

            <div className="relative z-10 flex items-start justify-between">
              {steps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center group max-w-[120px] w-full">
                  
                  {/* Milestone Badge */}
                  <div className="relative mb-1 shrink-0">
                    {step.active ? (
                      <div className="w-8 h-8 rounded-full bg-brand-indigo text-white shadow-xs ring-3 ring-brand-violet/15 flex items-center justify-center transition-all duration-200">
                        <span className="material-symbols-outlined text-base">{step.icon}</span>
                      </div>
                    ) : step.completed ? (
                      <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-2xs">
                        <span className="material-symbols-outlined text-base">check</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white text-outline border border-outline-variant/60 flex items-center justify-center group-hover:scale-105 group-hover:border-brand-violet/40 transition-all duration-200">
                        <span className="material-symbols-outlined text-base text-outline/60">{step.icon}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col items-center">
                    <span className={`text-[11px] font-bold leading-tight ${
                      step.active ? 'text-brand-indigo font-bold' : step.completed ? 'text-brand-teal font-semibold' : 'text-on-surface-variant/80 font-semibold'
                    }`}>
                      {t(`reporting.method.steps.${step.titleKey}`)}
                    </span>
                    <span className={`text-[9px] leading-tight mt-0.5 hidden sm:block ${
                      step.active ? 'text-brand-teal font-semibold' : 'text-outline/70'
                    }`}>
                      {t(`reporting.method.steps.${step.subKey}`)}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Page Intro Section */}
        <div className="text-center max-w-xl mx-auto space-y-0.5 py-0.5">
          <span className="text-[9px] font-bold text-brand-teal uppercase tracking-widest block">
            {t('reporting.review.eyebrow')}
          </span>

          <h1 className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold tracking-tight">
            {t('reporting.review.title')}
          </h1>

          <p className="font-body-md text-on-surface-variant text-xs font-medium leading-normal max-w-md mx-auto">
            {t('reporting.review.subtitle')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full max-w-[620px] mx-auto p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-sm shrink-0">info</span>
            <span>{error}</span>
          </div>
        )}

        {/* 4. Open Summary Workspace (2-Column Desktop Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full max-w-[620px] mx-auto">

          {/* LEFT COLUMN: WHAT YOU TOLD US */}
          <div className="p-3.5 rounded-xl border border-outline-variant/60 bg-white space-y-2 shadow-2xs text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
                {t('reporting.review.whatYouToldUs')}
              </span>
              <button
                type="button"
                onClick={() => navigate(isVoice ? '/citizen/report/voice' : '/citizen/report/text')}
                disabled={submitting}
                className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>{t('reporting.review.editLink')}</span>
              </button>
            </div>

            <div className="p-2.5 bg-surface-container-low/60 rounded-lg border border-outline-variant/40 text-xs text-on-surface">
              {isVoice ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-violet text-lg shrink-0">graphic_eq</span>
                    <span className="font-bold text-brand-indigo text-xs">
                      Voice Note ({draft.voiceDuration || '00:15'})
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant italic line-clamp-3 leading-snug">
                    &quot;{draft.voiceTranscript || draft.description || 'Voice note recorded'}&quot;
                  </p>
                </div>
              ) : (
                <p className="italic text-on-surface-variant text-xs leading-relaxed line-clamp-4">
                  &quot;{draft.description || 'No description provided.'}&quot;
                </p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: WHERE IT HAPPENED */}
          <div className="p-3.5 rounded-xl border border-outline-variant/60 bg-white space-y-2 shadow-2xs text-left flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
                  {t('reporting.review.whereItHappened')}
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/citizen/report/location')}
                  disabled={submitting}
                  className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <span>{t('reporting.review.changeLink')}</span>
                </button>
              </div>

              <div className="p-2.5 bg-surface-container-low/60 rounded-lg border border-outline-variant/40 text-xs font-bold text-brand-indigo flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-teal text-base shrink-0">location_on</span>
                <span className="truncate">{locationLabel}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. Evidence Section Block */}
        <div className="w-full max-w-[620px] mx-auto p-3.5 rounded-xl border border-outline-variant/60 bg-white space-y-2 shadow-2xs text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
              {t('reporting.review.evidence')}
            </span>
            <button
              type="button"
              onClick={() => navigate('/citizen/report/evidence')}
              disabled={submitting}
              className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span>{t('reporting.review.addChangeLink')}</span>
            </button>
          </div>

          {evidenceList.length > 0 ? (
            <div className="space-y-2 pt-0.5">
              {evidenceList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/50 border border-outline-variant/30">
                  <div className="w-8 h-8 rounded-md bg-white border border-outline-variant/40 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.previewUrl ? (
                      <img src={item.previewUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="material-symbols-outlined text-brand-teal text-base">attachment</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-xs text-brand-indigo truncate block">{item.name}</span>
                    {item.caption && <span className="text-[10px] text-on-surface-variant italic truncate block">— {item.caption}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 bg-surface-container-low/50 rounded-lg border border-outline-variant/30 text-left">
              <span className="text-xs font-semibold text-on-surface-variant block">
                {t('reporting.review.noEvidence')}
              </span>
              <span className="text-[10px] text-outline block">
                {t('reporting.review.noEvidenceSub')}
              </span>
            </div>
          )}
        </div>

        {/* 6. Civic Sharing Notice & Consent Checkbox */}
        <div className="w-full max-w-[620px] mx-auto space-y-2 text-left">
          {/* Civic notice */}
          <div className="p-2.5 bg-surface-container-low/60 rounded-lg border border-outline-variant/40 text-[10px] sm:text-[11px] text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-teal text-base shrink-0">info</span>
            <span>{t('reporting.review.noticeText')}</span>
          </div>

          {/* Consent Checkbox */}
          <div className="p-3 bg-white rounded-xl border border-outline-variant/60 shadow-2xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded text-brand-indigo focus:ring-brand-violet cursor-pointer shrink-0"
                checked={consentGiven}
                disabled={submitting}
                onChange={handleConsentToggle}
              />
              <span className="text-xs text-on-surface font-medium leading-snug">
                {t('reporting.review.consent')}
              </span>
            </label>
          </div>
        </div>

        {/* 7. Primary Action CTA */}
        <div className="w-full max-w-[620px] mx-auto pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!consentGiven || submitting}
            className="w-full bg-brand-indigo hover:bg-brand-violet text-white h-[48px] rounded-xl font-label-md font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.005] active:scale-98"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                <span>{submitStatus || 'Registering report...'}</span>
              </>
            ) : (
              <>
                <span>{t('reporting.review.submitBtn')}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Pre-navigation Submission Success Overlay */}
      {showSuccessOverlay && (
        <div
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-overlay-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-teal-50 flex items-center justify-center mb-5 ring-8 ring-teal-500/10 shadow-sm animate-overlay-scale-in">
            <svg className="w-12 h-12 text-brand-teal" viewBox="0 0 52 52" fill="none" aria-hidden="true">
              <circle
                className="animate-svg-circle"
                cx="26"
                cy="26"
                r="23"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="146"
                strokeDashoffset="146"
              />
              <path
                className="animate-svg-check"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="36"
                strokeDashoffset="36"
                d="M14 27l8 8 16-16"
              />
            </svg>
          </div>

          <h2
            className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold tracking-tight mb-1.5 animate-fade-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            Report submitted successfully
          </h2>

          <p
            className="font-body-md text-on-surface-variant text-xs sm:text-sm font-medium leading-normal animate-fade-slide-up"
            style={{ animationDelay: '450ms' }}
          >
            Your community signal has been recorded.
          </p>
        </div>
      )}
    </main>
  );
}
