import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { startNewReport } from '../features/app/appSlice';
import { useTranslation } from '../lib/useTranslation';

export default function CitizenWelcomeView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const user = useSelector((state) => state.app.userProfile) || { name: 'Ramesh Sharma' };
  const communitySignals = useSelector((state) => state.app.communitySignals) || [];

  // --- 1. PERSONAL DATA DERIVATION ---
  const userReportCount = communitySignals.length > 0 ? communitySignals.length : 1;
  const userUnderReviewCount = communitySignals.filter(s => 
    (s.status || '').toLowerCase().includes('review') || (s.status || '').toLowerCase().includes('signal')
  ).length || 1;
  const userClusteredCount = communitySignals.filter(s => 
    (s.status || '').toLowerCase().includes('signal') || (s.status || '').toLowerCase().includes('pattern')
  ).length || 1;

  const recentProblems = communitySignals.length > 0 ? communitySignals : [
    {
      id: 'SS-2026-00401',
      title: 'Water Hand Pump Discoloration & Chemical Odor',
      status: 'Confirmed Community Signal',
      location: 'Gumla Sector 4, Jharkhand',
      date: '2026-08-28',
      stageIndex: 2,
      clusterCount: 3,
      locations: ['Gumla', 'Latehar']
    }
  ];

  const primaryProblem = recentProblems[0];
  const activeStageIdx = primaryProblem.stageIndex !== undefined ? primaryProblem.stageIndex : 2;

  const handleStartReport = () => {
    dispatch(startNewReport());
    navigate('/citizen/report/method');
  };

  const ecosystemStages = [
    { key: 'reported', label: t('stages.reported'), icon: 'edit_note' },
    { key: 'ai', label: t('stages.ai'), icon: 'psychology' },
    { key: 'pattern', label: t('stages.pattern'), icon: 'hub' },
    { key: 'challenge', label: t('stages.challenge'), icon: 'school' },
    { key: 'solution', label: t('stages.solution'), icon: 'lightbulb' },
    { key: 'impact', label: t('stages.impact'), icon: 'volunteer_activism' },
  ];

  const getPersonalStageNarrative = (idx) => {
    switch(idx) {
      case 0:
        return {
          whatHappened: t('citizen.dashboard.stageNarratives.0.happened'),
          whatNext: t('citizen.dashboard.stageNarratives.0.next'),
        };
      case 1:
        return {
          whatHappened: t('citizen.dashboard.stageNarratives.1.happened'),
          whatNext: t('citizen.dashboard.stageNarratives.1.next'),
        };
      case 2:
        return {
          whatHappened: t('citizen.dashboard.stageNarratives.2.happened'),
          whatNext: t('citizen.dashboard.stageNarratives.2.next'),
        };
      case 3:
        return {
          whatHappened: t('citizen.dashboard.stageNarratives.3.happened'),
          whatNext: t('citizen.dashboard.stageNarratives.3.next'),
        };
      case 4:
        return {
          whatHappened: t('citizen.dashboard.stageNarratives.4.happened'),
          whatNext: t('citizen.dashboard.stageNarratives.4.next'),
        };
      case 5:
        return {
          whatHappened: t('citizen.dashboard.stageNarratives.5.happened'),
          whatNext: t('citizen.dashboard.stageNarratives.5.next'),
        };
      default:
        return {
          whatHappened: t('citizen.dashboard.stageNarratives.default.happened'),
          whatNext: t('citizen.dashboard.stageNarratives.default.next'),
        };
    }
  };

  const personalNarrative = getPersonalStageNarrative(activeStageIdx);

  const domainThemes = [
    { 
      name: t('categories.water'), 
      detail: t('citizen.dashboard.themeDetails.water'),
      icon: 'water_drop',
      color: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    { 
      name: t('categories.agriculture'), 
      detail: t('citizen.dashboard.themeDetails.agriculture'),
      icon: 'agriculture',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    { 
      name: t('categories.infrastructure'), 
      detail: t('citizen.dashboard.themeDetails.infrastructure'),
      icon: 'route',
      color: 'text-brand-indigo bg-indigo-50 border-indigo-200'
    },
    { 
      name: t('categories.healthcare'), 
      detail: t('citizen.dashboard.themeDetails.healthcare'),
      icon: 'health_and_safety',
      color: 'text-brand-violet bg-purple-50 border-purple-200'
    },
  ];

  return (
    <main className="flex-grow pt-6 sm:pt-8 pb-20 px-4 sm:px-6 md:px-margin-desktop max-w-[1080px] mx-auto w-full space-y-8 text-on-surface">
      
      {/* 1. WELCOME SECTION */}
      <section className="bg-gradient-to-br from-[#F5F2FF] via-[#FAF8FF] to-[#ECE7FE] border border-brand-indigo/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-widest block font-mono">
              {t('citizen.dashboard.tag')}
            </span>
            
            <h1 className="font-display-lg text-[#1E1B4B] text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {t('citizen.dashboard.welcome', { name: user.name })} 👋
            </h1>

            <p className="font-body-md text-on-surface-variant text-xs sm:text-sm font-medium leading-relaxed">
              {t('citizen.dashboard.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={handleStartReport}
              className="bg-brand-indigo hover:bg-brand-violet text-white px-6 py-3 rounded-full font-label-md text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>+ {t('citizen.dashboard.reportProblem')}</span>
            </button>

            <button 
              onClick={() => navigate('/explore-challenges')}
              className="border border-brand-indigo/30 bg-white/80 hover:bg-white text-brand-indigo px-5 py-3 rounded-full font-label-md text-xs sm:text-sm font-semibold transition-all hover:shadow-2xs cursor-pointer"
            >
              {t('citizen.dashboard.exploreCommunity')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. PERSONAL REPORTS SUMMARY */}
      <section className="bg-white border border-outline-variant/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
          <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider font-mono">
            {t('citizen.dashboard.summaryTitle')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-[#1E1B4B] font-bold border border-slate-200">
            {t('citizen.dashboard.reportsSubmitted', { count: userReportCount })}
          </span>
          <span className="text-outline-variant">·</span>
          <span className="px-3 py-1 rounded-lg bg-indigo-50 text-brand-indigo font-bold border border-indigo-200">
            {t('citizen.dashboard.underReview', { count: userUnderReviewCount })}
          </span>
          <span className="text-outline-variant">·</span>
          <span className="px-3 py-1 rounded-lg bg-teal-50 text-brand-teal font-bold border border-teal-200">
            {t('citizen.dashboard.connectedToPattern', { count: userClusteredCount })}
          </span>
        </div>
      </section>

      {/* 3. MY LATEST REPORT JOURNEY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* LEFT COLUMN: MY LATEST REPORT */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-widest font-mono block">
                  {t('citizen.dashboard.personalLayerTag')}
                </span>
                <h2 className="font-headline-sm text-[#1E1B4B] text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
                  {t('citizen.dashboard.myLatestReport')}
                </h2>
              </div>
              
              <button 
                onClick={() => navigate('/citizen/my-problems')} 
                className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t('citizen.dashboard.viewAllReports')} →</span>
              </button>
            </div>

            {/* MAIN PERSONAL PROBLEM CARD */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/80 shadow-xs space-y-6 relative overflow-hidden">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-brand-teal px-2.5 py-1 bg-brand-teal/10 rounded-md border border-brand-teal/20">
                    {primaryProblem.id}
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                    <span>📍</span>
                    <span>{primaryProblem.location}</span>
                  </span>
                </div>

                <h3 className="font-headline-sm text-[#1E1B4B] text-base sm:text-lg font-extrabold leading-snug">
                  {primaryProblem.title}
                </h3>
              </div>

              {/* ECOSYSTEM STAGE TRACK */}
              <div className="pt-2 pb-1">
                <div className="relative flex items-center justify-between overflow-x-auto pb-3 pt-1 scrollbar-none gap-2">
                  <div className="absolute top-5 left-5 right-5 h-1 bg-slate-200 rounded-full -z-0" />

                  {ecosystemStages.map((st, idx) => {
                    const isDone = idx < activeStageIdx;
                    const isCurrent = idx === activeStageIdx;
                    const isNext = idx === activeStageIdx + 1;

                    return (
                      <div key={st.key} className="relative z-10 flex flex-col items-center min-w-[76px] text-center space-y-2 shrink-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 font-mono ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-2xs border-2 border-emerald-600'
                            : isCurrent
                            ? 'bg-brand-indigo text-white ring-4 ring-brand-indigo/25 shadow-md scale-110'
                            : isNext
                            ? 'bg-white text-brand-indigo border-2 border-brand-indigo/50'
                            : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                        }`}>
                          {isDone ? (
                            <span className="material-symbols-outlined text-base">check</span>
                          ) : isCurrent ? (
                            <span className="text-xs">●</span>
                          ) : isNext ? (
                            <span className="text-xs">○</span>
                          ) : (
                            <span className="text-xs">—</span>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block leading-tight ${
                            isDone
                              ? 'text-emerald-700'
                              : isCurrent
                              ? 'text-brand-indigo font-extrabold'
                              : isNext
                              ? 'text-brand-indigo/70 font-semibold'
                              : 'text-slate-400'
                          }`}>
                            {st.label}
                          </span>
                          <span className="text-[9px] font-mono block text-on-surface-variant/70">
                            {isDone ? `✓ ${t('status.done')}` : isCurrent ? `● ${t('status.current')}` : isNext ? `○ ${t('status.next')}` : `— ${t('status.future')}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HUMAN STORY & WHAT HAPPENS NEXT PANEL */}
              <div className="bg-gradient-to-br from-[#F5F2FF] to-[#FAF8FF] border border-brand-indigo/20 rounded-xl p-5 space-y-4">
                
                <div className="space-y-1 border-b border-brand-indigo/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-indigo animate-pulse" />
                    <span className="text-[10px] font-bold text-brand-indigo font-mono uppercase tracking-widest">
                      {t('citizen.dashboard.whatHappened')}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E1B4B] font-extrabold leading-relaxed text-sm sm:text-base">
                    "{personalNarrative.whatHappened}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[10px] font-bold text-brand-teal font-mono uppercase tracking-widest block">
                      {t('citizen.dashboard.whatHappensNext')}
                    </span>
                    <p className="text-xs text-on-surface-variant leading-snug">
                      {personalNarrative.whatNext}
                    </p>
                  </div>

                  <button 
                    onClick={() => navigate(`/citizen/track-problems?id=${primaryProblem.id}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-indigo text-white text-xs font-bold hover:bg-brand-violet transition-all cursor-pointer shadow-2xs shrink-0 group"
                  >
                    <span>{t('citizen.dashboard.trackJourney')}</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* 4. AROUND YOUR COMMUNITY */}
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest font-mono block">
                  {t('citizen.dashboard.communityLayerTag')}
                </span>
                <h3 className="font-headline-sm text-[#1E1B4B] text-lg font-bold mt-0.5">
                  {t('citizen.dashboard.aroundCommunity')}
                </h3>
              </div>

              <button 
                onClick={() => navigate('/explore-challenges')}
                className="text-xs font-bold text-brand-violet hover:underline cursor-pointer"
              >
                {t('citizen.dashboard.exploreCommunity')} →
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t('citizen.dashboard.aroundCommunityDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {domainThemes.map((dom, i) => (
                <div 
                  key={i}
                  onClick={() => navigate('/explore-challenges')}
                  className="p-4 rounded-xl bg-white border border-outline-variant/60 hover:border-brand-violet/40 hover:shadow-2xs transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${dom.color} flex items-center justify-center shrink-0 border`}>
                        <span className="material-symbols-outlined text-base">{dom.icon}</span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1E1B4B] leading-tight">
                        {dom.name}
                      </h4>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-brand-indigo text-base transition-colors">
                      arrow_forward
                    </span>
                  </div>

                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {dom.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 5. RECENT ACTIVITY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-widest font-mono block">
                  {t('citizen.dashboard.activityTimelineTag')}
                </span>
                <h2 className="font-headline-sm text-[#1E1B4B] text-base sm:text-lg font-bold mt-0.5">
                  {t('citizen.dashboard.recentActivity')}
                </h2>
              </div>

              <button 
                onClick={() => navigate('/citizen/track-problems')}
                className="text-xs font-bold text-brand-violet hover:underline cursor-pointer"
              >
                {t('citizen.dashboard.viewAll')}
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-5">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/40">
                
                <div className="relative space-y-1">
                  <span className="absolute -left-6 top-0.5 px-1.5 py-0.5 bg-brand-indigo text-white text-[9px] font-mono font-bold rounded">
                    {t('citizen.dashboard.yourReportTag')}
                  </span>
                  <div className="pt-5 flex items-center justify-between text-xs">
                    <strong className="text-[#1E1B4B] font-bold">{t('citizen.dashboard.recentActivities.0.title')}</strong>
                    <span className="text-[10px] font-mono text-on-surface-variant">10m ago</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-snug">
                    {t('citizen.dashboard.recentActivities.0.desc')}
                  </p>
                </div>

                <div className="relative space-y-1 pt-1">
                  <span className="absolute -left-6 top-0.5 px-1.5 py-0.5 bg-brand-teal text-white text-[9px] font-mono font-bold rounded">
                    {t('citizen.dashboard.communityTag')}
                  </span>
                  <div className="pt-5 flex items-center justify-between text-xs">
                    <strong className="text-[#1E1B4B] font-bold">{t('citizen.dashboard.recentActivities.1.title')}</strong>
                    <span className="text-[10px] font-mono text-on-surface-variant">2h ago</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-snug">
                    {t('citizen.dashboard.recentActivities.1.desc')}
                  </p>
                </div>

                <div className="relative space-y-1 pt-1">
                  <span className="absolute -left-6 top-0.5 px-1.5 py-0.5 bg-purple-700 text-white text-[9px] font-mono font-bold rounded">
                    {t('citizen.dashboard.ecosystemTag')}
                  </span>
                  <div className="pt-5 flex items-center justify-between text-xs">
                    <strong className="text-[#1E1B4B] font-bold">{t('citizen.dashboard.recentActivities.2.title')}</strong>
                    <span className="text-[10px] font-mono text-on-surface-variant">1d ago</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-snug">
                    {t('citizen.dashboard.recentActivities.2.desc')}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* 6. EDITORIAL SPOTLIGHT */}
          <div className="bg-white border border-outline-variant/70 rounded-2xl overflow-hidden shadow-xs space-y-3">
            <div className="relative h-36 w-full overflow-hidden">
              <img 
                src="/images/hero-community.jpg" 
                alt="Community Collaboration in Jharkhand" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/85 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-mono font-bold text-white bg-brand-indigo/80 px-2.5 py-1 rounded-md">
                  📍 Gumla & Latehar Field Signal
                </span>
              </div>
            </div>

            <div className="p-4 space-y-1.5">
              <h4 className="font-bold text-sm text-[#1E1B4B]">
                {t('citizen.dashboard.spotlightTitle')}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('citizen.dashboard.spotlightDesc')}
              </p>
            </div>
          </div>

          {/* 7. HOW SAMADHANSETU WORKS */}
          <div className="bg-gradient-to-br from-[#FAF9FE] to-[#F4F1FF] border border-brand-indigo/20 p-6 rounded-2xl space-y-4 shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-widest font-mono block">
                {t('citizen.dashboard.architectureTag')}
              </span>
              <h3 className="font-headline-sm text-[#1E1B4B] text-base font-extrabold mt-0.5">
                {t('citizen.dashboard.howItWorks')}
              </h3>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed italic">
              "{t('citizen.dashboard.philosophyQuote')}"
            </p>

            <div className="relative pl-6 space-y-3.5 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-brand-indigo before:via-brand-teal before:to-purple-600 text-xs">
              
              <div className="relative p-2.5 bg-white rounded-lg border border-brand-indigo/15 space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-brand-indigo">
                  <span className="material-symbols-outlined text-base">edit_note</span>
                  <span>1. {t('citizen.dashboard.workflowSteps.0.title')}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant pl-6">
                  {t('citizen.dashboard.workflowSteps.0.desc')}
                </p>
              </div>

              <div className="relative p-2.5 bg-white rounded-lg border border-brand-teal/20 space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-brand-teal">
                  <span className="material-symbols-outlined text-base">hub</span>
                  <span>2. {t('citizen.dashboard.workflowSteps.1.title')}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant pl-6">
                  {t('citizen.dashboard.workflowSteps.1.desc')}
                </p>
              </div>

              <div className="relative p-2.5 bg-white rounded-lg border border-brand-violet/20 space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-brand-violet">
                  <span className="material-symbols-outlined text-base">school</span>
                  <span>3. {t('citizen.dashboard.workflowSteps.2.title')}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant pl-6">
                  {t('citizen.dashboard.workflowSteps.2.desc')}
                </p>
              </div>

              <div className="relative p-2.5 bg-white rounded-lg border border-indigo-200 space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-indigo-700">
                  <span className="material-symbols-outlined text-base">lightbulb</span>
                  <span>4. {t('citizen.dashboard.workflowSteps.3.title')}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant pl-6">
                  {t('citizen.dashboard.workflowSteps.3.desc')}
                </p>
              </div>

              <div className="relative p-2.5 bg-white rounded-lg border border-purple-200 space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-purple-800">
                  <span className="material-symbols-outlined text-base">volunteer_activism</span>
                  <span>5. {t('citizen.dashboard.workflowSteps.4.title')}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant pl-6">
                  {t('citizen.dashboard.workflowSteps.4.desc')}
                </p>
              </div>

            </div>

            <div className="pt-1 text-center">
              <button 
                onClick={() => navigate('/citizen/track-problems')}
                className="text-xs font-bold text-brand-violet hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{t('citizen.dashboard.followObservations')} →</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
