import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { startNewReport } from '../features/app/appSlice';
import { useTranslation } from '../lib/useTranslation';

export default function CitizenSubmittedView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const reportDraft = useSelector((state) => state.app.reportDraft);
  const communitySignals = useSelector((state) => state.app.communitySignals);

  const activeRefId = reportDraft.reportId || communitySignals[0]?.id || 'SS-2026-00401';
  const locationLabel = reportDraft.location?.label || communitySignals[0]?.location || 'Gumla District, Jharkhand';

  const handleShareAnother = () => {
    dispatch(startNewReport());
    navigate('/citizen/report/method');
  };

  return (
    <main className="flex-grow py-4 sm:py-6 px-4 md:px-margin-desktop max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-on-surface space-y-4 sm:space-y-5">
      
      {/* 1. SUCCESS HERO (White Canvas Page) */}
      <div className="w-full text-center space-y-2 py-1">
        {/* a. Teal success check icon (fade in + scale 0.85 -> 1) */}
        <div 
          className="w-12 h-12 rounded-full bg-brand-teal/12 text-brand-teal flex items-center justify-center mx-auto mb-1 animate-success-icon"
          style={{ animationDelay: '0ms' }}
        >
          <span className="material-symbols-outlined text-3xl">task_alt</span>
        </div>

        {/* b. REPORT SUBMITTED SUCCESSFULLY (fade + translateY) */}
        <span 
          className="text-[10px] font-extrabold tracking-widest text-brand-teal uppercase block animate-fade-slide-up"
          style={{ animationDelay: '150ms' }}
        >
          REPORT SUBMITTED SUCCESSFULLY
        </span>

        {/* c. Main heading (fade + translateY) */}
        <h1 
          className="font-display-lg text-[#1E1B4B] text-2xl sm:text-3xl font-extrabold tracking-tight animate-fade-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          Thank you for sharing your observation.
        </h1>

        {/* d. Supporting location text (fade in slightly after heading) */}
        <p 
          className="font-body-md text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: '450ms' }}
        >
          Your report from <strong className="text-brand-indigo font-bold">{locationLabel}</strong> is now entering the SamadhanSetu civic innovation journey.
        </p>

        {/* e. Signal Reference ID (fade in last in hero) */}
        <div 
          className="pt-0.5 animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          <span className="text-[11px] text-on-surface-variant bg-surface-container-low px-3.5 py-1 rounded-full border border-outline-variant/50 inline-block font-medium shadow-2xs">
            Signal Reference ID: <strong className="font-mono text-brand-violet font-bold">{activeRefId}</strong>
          </span>
        </div>
      </div>

      {/* 2. WHAT HAPPENS NEXT (Connected Horizontal Timeline - Left-to-Right Progress Animation) */}
      <div 
        className="w-full py-3 border-y border-outline-variant/30 text-center animate-fade-in"
        style={{ animationDelay: '700ms' }}
      >
        <div className="relative w-full max-w-3xl mx-auto py-1">
          {/* Background Connecting Line */}
          <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-outline-variant/40 z-0 hidden sm:block" />
          
          {/* Active Connecting Line (Animates left-to-right from Node 1 to Node 2) */}
          <div 
            className="absolute top-4 left-[10%] h-0.5 bg-brand-teal z-0 hidden sm:block animate-timeline-progress"
            style={{ animationDelay: '800ms' }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
            
            {/* Node 1: Report submitted (Completed) */}
            <div className="flex flex-col items-center group">
              <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-2xs mb-1.5 shrink-0">
                <span className="material-symbols-outlined text-base">check</span>
              </div>
              <span className="text-[11px] font-bold text-brand-teal leading-tight">Report submitted</span>
              <span className="text-[10px] text-brand-teal/80 font-medium mt-0.5">Completed</span>
            </div>

            {/* Node 2: Community signal (Active) */}
            <div className="flex flex-col items-center group">
              <div className="w-8 h-8 rounded-full bg-brand-indigo text-white ring-3 ring-brand-violet/20 flex items-center justify-center shadow-xs mb-1.5 shrink-0">
                <span className="material-symbols-outlined text-base">cell_tower</span>
              </div>
              <span className="text-[11px] font-bold text-brand-indigo leading-tight">Community signal</span>
              <span className="text-[10px] text-brand-violet font-bold mt-0.5">Active</span>
            </div>

            {/* Node 3: Shared pattern (Visually Muted) */}
            <div className="flex flex-col items-center group opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-white text-outline border border-outline-variant flex items-center justify-center mb-1.5 shrink-0 group-hover:border-brand-violet/40">
                <span className="material-symbols-outlined text-base text-outline/70">hub</span>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant leading-tight">Shared pattern</span>
              <span className="text-[10px] text-outline font-medium mt-0.5">AI clustering</span>
            </div>

            {/* Node 4: Student solver (Visually Muted) */}
            <div className="flex flex-col items-center group opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-white text-outline border border-outline-variant flex items-center justify-center mb-1.5 shrink-0 group-hover:border-brand-violet/40">
                <span className="material-symbols-outlined text-base text-outline/70">lightbulb</span>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant leading-tight">Student solver</span>
              <span className="text-[10px] text-outline font-medium mt-0.5">Innovation team</span>
            </div>

          </div>
        </div>
      </div>

      {/* 3. AI UNDERSTANDING (Fades in after timeline settles) */}
      <div 
        className="w-full max-w-3xl mx-auto p-3.5 sm:p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left shadow-2xs animate-fade-slide-up"
        style={{ animationDelay: '950ms' }}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-brand-violet flex items-center justify-center shrink-0 shadow-2xs border border-outline-variant/40">
            <span className="material-symbols-outlined text-xl">psychology</span>
          </div>
          <div>
            <div className="font-bold text-brand-indigo text-xs sm:text-sm">
              AI Understanding Ready
            </div>
            <p className="text-[11px] text-on-surface-variant leading-snug mt-0.5">
              Your observation has been structured into domain, severity and impact signals.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/citizen/ai-understanding')}
          className="w-full sm:w-auto bg-brand-indigo hover:bg-brand-violet text-white h-[40px] px-4 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer shadow-xs hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-1.5"
        >
          <span>{t('reporting.submitted.reviewAiBtn')}</span>
        </button>
      </div>

      {/* 4. FINAL ACTION BUTTONS (Fade in last) */}
      <div 
        className="flex flex-col items-center gap-2 pt-1 animate-fade-in"
        style={{ animationDelay: '1100ms' }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-md">
          {/* Primary Action */}
          <button
            type="button"
            onClick={() => navigate('/citizen/ai-understanding')}
            className="w-full sm:flex-1 bg-brand-indigo hover:bg-brand-violet text-white h-[44px] px-5 rounded-xl font-label-md font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:scale-98"
          >
            <span>{t('reporting.submitted.reviewAiBtn')}</span>
          </button>

          {/* Secondary Action */}
          <button
            type="button"
            onClick={() => navigate('/citizen/my-problems')}
            className="w-full sm:flex-1 border border-outline-variant/80 hover:border-brand-indigo text-brand-indigo bg-white hover:bg-surface-container-low h-[44px] px-5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center hover:-translate-y-0.5"
          >
            {t('reporting.submitted.viewMyReports')}
          </button>
        </div>

        {/* Tertiary Action */}
        <button
          type="button"
          onClick={handleShareAnother}
          className="text-brand-violet font-semibold hover:underline text-xs py-1 transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>{t('reporting.submitted.shareAnother')}</span>
        </button>
      </div>

    </main>
  );
}
