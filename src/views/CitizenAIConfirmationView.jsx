import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { confirmAIUnderstanding } from '../features/app/appSlice';
import { api } from '../lib/api';

export default function CitizenAIConfirmationView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storeUnderstanding = useSelector((s) => s.app.activeAIUnderstanding);
  const reportDraft = useSelector((s) => s.app.reportDraft);
  const trackedId = useSelector((s) => s.app.activeTrackedProblemId);

  const defaults = {
    primaryDomain: 'Water Quality & Sanitation',
    relatedDomains: ['Community Health'],
    issueSummary: 'Groundwater discoloration and potential public health risk.',
    affectedGroups: ['Children and Local Families'],
    possibleImpacts: ['Drinking water contamination', 'Waterborne illness risk'],
    extractedLocation: 'Gumla District, Jharkhand',
  };
  const base = storeUnderstanding || defaults;

  const [domain, setDomain] = useState(base.primaryDomain);
  const [impact, setImpact] = useState((base.possibleImpacts || []).join(', '));
  const [groups, setGroups] = useState((base.affectedGroups || []).join(', '));
  const [location, setLocation] = useState(base.extractedLocation || 'Gumla District, Jharkhand');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const domainInputRef = useRef(null);
  const impactInputRef = useRef(null);
  const groupsInputRef = useRef(null);
  const locationInputRef = useRef(null);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);

    const submissionId = base.id || trackedId || reportDraft?.reportId || 'SS-CURRENT';
    const hasCorrections = (
      domain !== base.primaryDomain ||
      impact !== (base.possibleImpacts || []).join(', ') ||
      groups !== (base.affectedGroups || []).join(', ') ||
      location !== base.extractedLocation
    );

    try {
      // Call backend /api/submissions/confirm
      const result = await api.confirmSubmission({
        submission_id: submissionId,
        confirmed_domain: domain,
        confirmed_impacts: impact.split(',').map((s) => s.trim()).filter(Boolean),
        confirmed_groups: groups.split(',').map((s) => s.trim()).filter(Boolean),
        confirmed_location: location,
        has_corrections: hasCorrections,
      });

      // Update Redux state
      dispatch(confirmAIUnderstanding({
        ...base,
        id: result.submission?.id || submissionId,
        refId: result.submission?.ref_id || submissionId,
        primaryDomain: domain,
        possibleImpacts: impact.split(',').map((s) => s.trim()).filter(Boolean),
        affectedGroups: groups.split(',').map((s) => s.trim()).filter(Boolean),
        extractedLocation: location,
        confirmedByCitizen: true,
      }));

      navigate('/community/signal-confirmed');
    } catch (err) {
      console.warn('[Confirmation API Warning]:', err.message);
      // If serverless is offline, persist in local Redux and continue
      dispatch(confirmAIUnderstanding({
        ...base,
        id: submissionId,
        refId: submissionId,
        primaryDomain: domain,
        possibleImpacts: impact.split(',').map((s) => s.trim()).filter(Boolean),
        affectedGroups: groups.split(',').map((s) => s.trim()).filter(Boolean),
        extractedLocation: location,
        confirmedByCitizen: true,
      }));
      navigate('/community/signal-confirmed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow py-3 sm:py-4 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-start text-on-surface">
      <div className="w-full max-w-[620px] mx-auto flex-grow flex flex-col items-center justify-start space-y-3">

        {/* 1. Header & Back Navigation */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => navigate('/citizen/ai-understanding')}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-semibold transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-0.5 px-1 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
            <span>Back</span>
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-brand-violet uppercase bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            CITIZEN CONFIRMATION
          </span>
        </div>

        {/* Header Title & Subtitle */}
        <div className="text-center max-w-md mx-auto space-y-0.5 py-0.5">
          <h1 className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold tracking-tight">
            Did we understand this correctly?
          </h1>
          <p className="font-body-md text-on-surface-variant text-xs font-medium leading-normal max-w-md mx-auto">
            Please check the information below. You can correct anything that doesn&apos;t look right.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-sm shrink-0">info</span>
            <span>{error}</span>
          </div>
        )}

        {/* 2. 4 Compact Information / Confirmation Rows */}
        <div className="w-full space-y-2">
          
          {/* Row 1: Problem Category */}
          <div
            className="p-3 rounded-xl bg-white border border-outline-variant/60 flex items-start justify-between gap-3 shadow-2xs text-left animate-fade-slide-up"
            style={{ animationDelay: '0ms' }}
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base">water_drop</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider block">PROBLEM CATEGORY</span>
                  <button
                    type="button"
                    onClick={() => domainInputRef.current?.focus()}
                    disabled={submitting}
                    className="text-[11px] font-semibold text-brand-violet hover:underline flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Edit</span>
                    <span className="material-symbols-outlined text-xs">edit</span>
                  </button>
                </div>
                <input
                  ref={domainInputRef}
                  type="text"
                  className="w-full font-bold text-brand-indigo text-xs sm:text-sm bg-transparent border-b border-transparent focus:border-brand-violet focus:outline-none py-0.5 transition-colors"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={submitting}
                />
                {base.issueSummary && (
                  <p className="text-[11px] text-on-surface-variant/80 italic mt-0.5 line-clamp-1">
                    {base.issueSummary}
                  </p>
                )}
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-teal text-base shrink-0 mt-1">check_circle</span>
          </div>

          {/* Row 2: Possible Impact Signals */}
          <div
            className="p-3 rounded-xl bg-white border border-outline-variant/60 flex items-start justify-between gap-3 shadow-2xs text-left animate-fade-slide-up"
            style={{ animationDelay: '140ms' }}
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-brand-violet/10 text-brand-violet flex items-center justify-center font-bold shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base">health_and_safety</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-violet uppercase tracking-wider block">POSSIBLE IMPACT SIGNALS</span>
                  <button
                    type="button"
                    onClick={() => impactInputRef.current?.focus()}
                    disabled={submitting}
                    className="text-[11px] font-semibold text-brand-violet hover:underline flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Edit</span>
                    <span className="material-symbols-outlined text-xs">edit</span>
                  </button>
                </div>
                <input
                  ref={impactInputRef}
                  type="text"
                  className="w-full font-bold text-brand-indigo text-xs sm:text-sm bg-transparent border-b border-transparent focus:border-brand-violet focus:outline-none py-0.5 transition-colors"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  placeholder="Comma-separated impacts"
                  disabled={submitting}
                />
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-teal text-base shrink-0 mt-1">check_circle</span>
          </div>

          {/* Row 3: Who May Be Affected? */}
          <div
            className="p-3 rounded-xl bg-white border border-outline-variant/60 flex items-start justify-between gap-3 shadow-2xs text-left animate-fade-slide-up"
            style={{ animationDelay: '280ms' }}
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base">groups</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider block">WHO MAY BE AFFECTED?</span>
                  <button
                    type="button"
                    onClick={() => groupsInputRef.current?.focus()}
                    disabled={submitting}
                    className="text-[11px] font-semibold text-brand-violet hover:underline flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Edit</span>
                    <span className="material-symbols-outlined text-xs">edit</span>
                  </button>
                </div>
                <input
                  ref={groupsInputRef}
                  type="text"
                  className="w-full font-bold text-brand-indigo text-xs sm:text-sm bg-transparent border-b border-transparent focus:border-brand-violet focus:outline-none py-0.5 transition-colors"
                  value={groups}
                  onChange={(e) => setGroups(e.target.value)}
                  placeholder="Comma-separated affected groups"
                  disabled={submitting}
                />
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-teal text-base shrink-0 mt-1">check_circle</span>
          </div>

          {/* Row 4: Location / District */}
          <div
            className="p-3 rounded-xl bg-white border border-outline-variant/60 flex items-start justify-between gap-3 shadow-2xs text-left animate-fade-slide-up"
            style={{ animationDelay: '420ms' }}
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base">location_on</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">LOCATION / DISTRICT</span>
                  <button
                    type="button"
                    onClick={() => locationInputRef.current?.focus()}
                    disabled={submitting}
                    className="text-[11px] font-semibold text-brand-violet hover:underline flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Edit</span>
                    <span className="material-symbols-outlined text-xs">edit</span>
                  </button>
                </div>
                <input
                  ref={locationInputRef}
                  type="text"
                  className="w-full font-bold text-brand-indigo text-xs sm:text-sm bg-transparent border-b border-transparent focus:border-brand-violet focus:outline-none py-0.5 transition-colors"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-teal text-base shrink-0 mt-1">check_circle</span>
          </div>

        </div>

        {/* 3. "Why are we asking?" Note */}
        <div className="w-full p-2.5 bg-surface-container-low/60 rounded-xl border border-outline-variant/40 text-[11px] text-on-surface-variant flex items-center gap-2 text-left">
          <span className="material-symbols-outlined text-brand-teal text-base shrink-0">info</span>
          <span>
            <strong>Why are we asking?</strong> SamadhanSetu uses your confirmed description to organize community observations and detect shared regional patterns. Checking this ensures genuine local ground truth.
          </span>
        </div>

        {/* 4. Confirmation CTA Area */}
        <div className="w-full pt-1 space-y-2 animate-fade-slide-up" style={{ animationDelay: '560ms' }}>
          <div className="text-center">
            <span className="text-xs font-bold text-brand-indigo">
              Everything looks correct?
            </span>
          </div>

          <button
            type="button"
            className="w-full bg-brand-indigo hover:bg-brand-violet text-white h-[54px] rounded-xl font-label-md font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.005] active:scale-98"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                <span>Confirming signal with database...</span>
              </>
            ) : (
              <>
                <span>Yes, this looks correct</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </>
            )}
          </button>
        </div>

      </div>
    </main>
  );
}
