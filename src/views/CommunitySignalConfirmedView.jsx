import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { startNewReport } from '../features/app/appSlice';

export default function CommunitySignalConfirmedView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const communitySignals = useSelector((s) => s.app.communitySignals);
  const activeTrackedProblemId = useSelector((s) => s.app.activeTrackedProblemId);
  const confirmedSignal = communitySignals[0] || {
    id: activeTrackedProblemId || 'SS-CURRENT',
    status: 'Confirmed community signal',
  };
  const activeTrackedId = activeTrackedProblemId || confirmedSignal.id;

  return (
    <main className="flex-grow py-4 sm:py-6 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-start text-on-surface">
      <div className="w-full max-w-[620px] mx-auto flex-grow flex flex-col items-center justify-start space-y-2.5 mt-2 sm:mt-3">
        
        {/* 1. Success Header (Moved down slightly ~16px) */}
        <div className="text-center max-w-md mx-auto space-y-1">
          {/* Subtle Centered Success Seal Icon */}
          <div
            className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto mb-2 shadow-2xs animate-overlay-scale-in"
            style={{ animationDelay: '0ms' }}
          >
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>

          <div
            className="animate-fade-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <span className="text-[10px] font-extrabold tracking-widest text-brand-teal uppercase bg-brand-teal/10 px-2.5 py-0.5 rounded-full border border-brand-teal/20">
              SIGNAL CONFIRMED BY CITIZEN
            </span>
          </div>

          <h1
            className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold tracking-tight pt-1 animate-fade-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            Your observation is now part of the bigger picture.
          </h1>

          <p
            className="font-body-md text-on-surface-variant text-xs font-medium leading-normal max-w-md mx-auto animate-fade-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            SamadhanSetu will compare this signal with other community observations to look for similar patterns. Your report helps us identify shared regional experiences.
          </p>
        </div>

        {/* 2. Compact Signal Reference Metadata Element */}
        <div
          className="inline-flex items-center gap-1.5 bg-surface-container-low/60 px-3 py-0.5 rounded-full border border-outline-variant/40 text-[11px] font-mono text-on-surface-variant animate-fade-slide-up"
          style={{ animationDelay: '400ms' }}
        >
          <span className="font-sans font-medium text-outline">Signal Reference</span>
          <span className="text-outline/40">·</span>
          <span className="font-bold text-brand-teal">{confirmedSignal.id}</span>
        </div>

        {/* 3. Cross-Report Clustering Process Lifecycle */}
        <div
          className="w-full bg-surface-container-low/60 p-3 sm:p-3.5 rounded-xl border border-outline-variant/60 text-center space-y-2.5 shadow-2xs animate-fade-slide-up"
          style={{ animationDelay: '500ms' }}
        >
          <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-widest block">
            NEXT STAGE: CROSS-REPORT CLUSTERING
          </span>

          <div className="relative w-full">
            {/* Continuous background connector line */}
            <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-outline-variant/40 -translate-y-1/2 z-0 hidden sm:block" />
            
            {/* Active progressive connector line */}
            <div className="absolute top-4 left-[10%] w-[53%] h-0.5 bg-brand-violet -translate-y-1/2 z-0 hidden sm:block animate-timeline-progress" />

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              {/* Stage 1 */}
              <div
                className="p-2.5 bg-white rounded-lg border border-outline-variant/40 flex flex-col items-center shadow-2xs text-center animate-fade-slide-up"
                style={{ animationDelay: '550ms' }}
              >
                <div className="w-7 h-7 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </div>
                <span className="text-[10px] font-bold text-brand-indigo uppercase leading-tight">YOUR OBSERVATION</span>
                <span className="text-[9px] text-brand-teal font-bold mt-0.5">✓ Complete</span>
              </div>

              {/* Stage 2 */}
              <div
                className="p-2.5 bg-white rounded-lg border border-outline-variant/40 flex flex-col items-center shadow-2xs text-center animate-fade-slide-up"
                style={{ animationDelay: '620ms' }}
              >
                <div className="w-7 h-7 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-sm">verified</span>
                </div>
                <span className="text-[10px] font-bold text-brand-indigo uppercase leading-tight">STRUCTURED SIGNAL</span>
                <span className="text-[9px] text-brand-teal font-bold mt-0.5">✓ Confirmed</span>
              </div>

              {/* Stage 3 (CURRENT ACTIVE STAGE - Softened border & background) */}
              <div
                className="p-2.5 bg-brand-violet/5 rounded-lg border border-brand-violet/30 flex flex-col items-center shadow-2xs text-center animate-fade-slide-up"
                style={{ animationDelay: '690ms' }}
              >
                <div className="w-7 h-7 rounded-full bg-brand-violet/15 text-brand-violet flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-sm">hub</span>
                </div>
                <span className="text-[10px] font-bold text-brand-indigo uppercase leading-tight">COMPARED WITH REPORTS</span>
                <span className="text-[9px] text-brand-violet font-bold mt-0.5">● In Progress</span>
              </div>

              {/* Stage 4 (MUTED FUTURE STAGE) */}
              <div
                className="p-2.5 bg-white/60 rounded-lg border border-outline-variant/40 flex flex-col items-center opacity-60 text-center animate-fade-slide-up"
                style={{ animationDelay: '760ms' }}
              >
                <div className="w-7 h-7 rounded-full bg-surface-container text-outline flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                </div>
                <span className="text-[10px] font-bold text-outline uppercase leading-tight">SHARED CHALLENGE</span>
                <span className="text-[9px] text-outline/80 font-medium mt-0.5">Phase 6+</span>
              </div>

            </div>
          </div>
        </div>

        {/* 4. Action CTA Hierarchy */}
        <div
          className="w-full pt-0.5 flex flex-col sm:flex-row items-center justify-center gap-2 animate-fade-slide-up"
          style={{ animationDelay: '830ms' }}
        >
          {/* Primary Action */}
          <button
            type="button"
            className="w-full sm:w-auto bg-brand-indigo hover:bg-brand-violet text-white h-[48px] px-6 rounded-xl font-label-md font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005] active:scale-98"
            onClick={() => navigate(`/citizen/track-problems?id=${activeTrackedId}`)}
          >
            <span className="material-symbols-outlined text-base">timeline</span>
            <span>Track Live Status &rarr;</span>
          </button>

          {/* Secondary Action */}
          <button
            type="button"
            className="w-full sm:w-auto border border-outline-variant/60 text-brand-indigo h-[48px] px-5 rounded-xl font-label-md font-bold text-xs hover:border-brand-violet hover:bg-brand-indigo/5 transition-all bg-white cursor-pointer"
            onClick={() => navigate('/citizen/my-problems')}
          >
            View My Problems
          </button>

          {/* Quiet Tertiary Action */}
          <button
            type="button"
            className="w-full sm:w-auto text-on-surface-variant hover:text-brand-violet text-xs font-semibold py-1.5 px-3 transition-colors cursor-pointer hover:underline"
            onClick={() => { dispatch(startNewReport()); navigate('/citizen/report/method'); }}
          >
            + Report Another
          </button>
        </div>

      </div>
    </main>
  );
}
