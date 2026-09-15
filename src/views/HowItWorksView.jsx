import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from '../lib/useTranslation';

export default function HowItWorksView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -35% 0px',
      threshold: 0.2,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stageNum = parseInt(entry.target.getAttribute('data-stage'), 10);
          if (stageNum) {
            setActiveStage(stageNum);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const stageElements = document.querySelectorAll('[data-stage]');
    stageElements.forEach((el) => observer.observe(el));

    return () => {
      stageElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const getRailProgress = () => {
    switch (activeStage) {
      case 1:
        return '18%';
      case 2:
        return '44%';
      case 3:
        return '72%';
      case 4:
        return '100%';
      default:
        return '18%';
    }
  };

  return (
    <main className="flex-grow py-8 sm:py-12 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full text-on-surface">
      
      {/* 1. HERO — "FROM VOICE TO IMPACT" */}
      <section className="max-w-3xl mx-auto text-center mb-12">
        <span className="text-brand-violet font-label-sm text-xs font-bold tracking-widest uppercase mb-2 block animate-fade-slide-up">
          {t('howItWorksPage.eyebrow')}
        </span>

        <h1 className="font-display-lg text-[#1E1B4B] text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 tracking-tight animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
          {t('howItWorksPage.heroTitle')}
        </h1>

        <p className="font-body-lg text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
          {t('howItWorksPage.heroDesc')}
        </p>

        <button
          onClick={() => navigate('/role-selection')}
          className="group bg-brand-indigo hover:bg-brand-violet text-white px-8 py-3.5 rounded-full font-label-md font-bold text-xs sm:text-sm transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-98 animate-fade-slide-up mb-8"
          style={{ animationDelay: '300ms' }}
        >
          <span>{t('howItWorksPage.getStartedBtn')}</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
        </button>

        {/* Wayfinding Journey Index */}
        <div className="w-full max-w-xl mx-auto py-2.5 px-4 sm:px-6 bg-surface-container-low/60 rounded-full border border-outline-variant/40 flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold text-on-surface-variant shadow-2xs">
          <button
            onClick={() => document.querySelector('[data-stage="1"]')?.scrollIntoView({ behavior: 'smooth' })}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${activeStage === 1 ? 'text-brand-teal font-extrabold' : 'hover:text-brand-teal'}`}
          >
            <span className="text-brand-teal">01</span>
            <span>VOICE</span>
          </button>
          <span className="text-outline/30">•</span>
          <button
            onClick={() => document.querySelector('[data-stage="2"]')?.scrollIntoView({ behavior: 'smooth' })}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${activeStage === 2 ? 'text-brand-violet font-extrabold' : 'hover:text-brand-violet'}`}
          >
            <span className="text-brand-violet">02</span>
            <span>UNDERSTAND</span>
          </button>
          <span className="text-outline/30">•</span>
          <button
            onClick={() => document.querySelector('[data-stage="3"]')?.scrollIntoView({ behavior: 'smooth' })}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${activeStage === 3 ? 'text-brand-indigo font-extrabold' : 'hover:text-brand-indigo'}`}
          >
            <span className="text-brand-indigo">03</span>
            <span>BUILD</span>
          </button>
          <span className="text-outline/30">•</span>
          <button
            onClick={() => document.querySelector('[data-stage="4"]')?.scrollIntoView({ behavior: 'smooth' })}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${activeStage === 4 ? 'text-brand-teal font-extrabold' : 'hover:text-brand-teal'}`}
          >
            <span className="text-brand-teal">04</span>
            <span>IMPACT</span>
          </button>
        </div>
      </section>

      {/* 2. LIVING JOURNEY RAIL & STORYTELLING STAGES */}
      <section className="relative max-w-5xl mx-auto my-8 py-4">
        
        {/* Desktop Centered Vertical Rail Line */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-outline-variant/30 z-0" />
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 w-0.5 bg-gradient-to-b from-brand-teal via-brand-violet to-brand-teal z-0 transition-all duration-500 ease-out"
          style={{ height: getRailProgress() }}
        />

        {/* Mobile Left Vertical Rail Line */}
        <div className="md:hidden absolute left-5 top-4 bottom-4 w-0.5 bg-outline-variant/30 z-0" />
        <div
          className="md:hidden absolute left-5 top-4 w-0.5 bg-gradient-to-b from-brand-teal via-brand-violet to-brand-teal z-0 transition-all duration-500 ease-out"
          style={{ height: getRailProgress() }}
        />

        {/* STAGE 01: REAL HUMAN SIGNAL */}
        <div data-stage="1" className="relative z-10 my-12 sm:my-20 flex flex-col md:flex-row items-start md:items-center w-full">
          <div className="hidden md:block w-1/2 pr-12 text-right" />

          {/* Node 01 */}
          <div className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-20">
            <div className={`w-9 h-9 rounded-full font-mono font-bold text-xs flex items-center justify-center transition-all duration-400 ${
              activeStage > 1
                ? 'bg-brand-teal text-white shadow-2xs'
                : activeStage === 1
                ? 'bg-brand-teal text-white ring-4 ring-brand-teal/20 shadow-xs scale-110'
                : 'bg-white text-outline border border-outline-variant'
            }`}>
              {activeStage > 1 ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                '01'
              )}
            </div>
          </div>

          {/* Stage 01 Content (Right Column) */}
          <div className="w-full md:w-1/2 pl-12 md:pl-12 text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-teal uppercase bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                SIGNAL RECEIVED
              </span>
              <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                {t('howItWorksPage.stage1Tag')}
              </span>
            </div>

            <h3 className="font-headline-md text-brand-indigo text-xl sm:text-2xl font-extrabold">
              {t('howItWorksPage.stage1Title')}
            </h3>

            <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              {t('howItWorksPage.stage1Desc')}
            </p>

            {/* Editorial Field Observation Quote */}
            <div className="mt-3 relative pl-4 border-l-2 border-brand-teal space-y-1 text-xs text-brand-indigo">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-brand-teal uppercase tracking-wider">
                <span className="material-symbols-outlined text-xs">graphic_eq</span>
                <span>CITIZEN VOICE · GUMLA DISTRICT</span>
              </div>
              <p className="font-body-md text-on-surface text-xs italic font-medium leading-relaxed">
                &quot;The groundwater from our village hand pump has turned rusty brown after the monsoon rains.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* STAGE 02: INTELLIGENCE CONVERGENCE */}
        <div data-stage="2" className="relative z-10 my-12 sm:my-20 flex flex-col md:flex-row items-start md:items-center w-full">
          {/* Node 02 */}
          <div className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-20">
            <div className={`w-9 h-9 rounded-full font-mono font-bold text-xs flex items-center justify-center transition-all duration-400 ${
              activeStage > 2
                ? 'bg-brand-teal text-white shadow-2xs'
                : activeStage === 2
                ? 'bg-brand-violet text-white ring-4 ring-brand-violet/20 shadow-xs scale-110'
                : 'bg-white text-outline border border-outline-variant'
            }`}>
              {activeStage > 2 ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                '02'
              )}
            </div>
          </div>

          {/* Stage 02 Content (Left Column on Desktop, Right Column on Mobile) */}
          <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 text-left md:text-right space-y-2 order-2 md:order-1">
            <div className="flex items-center gap-2 md:justify-end">
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-violet uppercase bg-brand-violet/10 px-2 py-0.5 rounded border border-brand-violet/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse" />
                AI SYNTHESIS IN PROGRESS
              </span>
              <span className="text-xs font-bold text-brand-violet uppercase tracking-wider">
                {t('howItWorksPage.stage2Tag')}
              </span>
            </div>

            <h3 className="font-headline-md text-brand-indigo text-xl sm:text-2xl font-extrabold">
              {t('howItWorksPage.stage2Title')}
            </h3>

            <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              {t('howItWorksPage.stage2Desc')}
            </p>

            {/* Convergence Visualization */}
            <div className="mt-3 p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/40 inline-flex flex-col space-y-2 text-xs text-left max-w-[320px]">
              <div className="text-[10px] font-mono font-bold text-brand-violet uppercase tracking-wider flex items-center justify-between">
                <span>CONVERGENCE MATRIX</span>
                <span>47 REPORTS → 1 CHALLENGE</span>
              </div>

              {/* Graphic Flow Line */}
              <div className="relative h-12 bg-white rounded-lg border border-outline-variant/30 flex items-center justify-between px-3">
                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-indigo">
                  <div className="flex items-center -space-x-1">
                    <span className="w-2 h-2 rounded-full bg-brand-violet" />
                    <span className="w-2 h-2 rounded-full bg-brand-teal" />
                    <span className="w-2 h-2 rounded-full bg-brand-indigo" />
                  </div>
                  <span>47 Reports</span>
                </div>

                <div className="flex items-center gap-1 text-brand-violet font-mono text-[10px]">
                  <span>→ AI Synthesis →</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/20">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>1 Challenge</span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded w-fit border border-brand-teal/20">
                Ready for Innovators
              </span>
            </div>
          </div>

          <div className="hidden md:block w-1/2 pl-12 text-left order-2" />
        </div>

        {/* STAGE 03: COLLABORATION CONSTELLATION */}
        <div data-stage="3" className="relative z-10 my-12 sm:my-20 flex flex-col md:flex-row items-start md:items-center w-full">
          <div className="hidden md:block w-1/2 pr-12 text-right" />

          {/* Node 03 */}
          <div className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-20">
            <div className={`w-9 h-9 rounded-full font-mono font-bold text-xs flex items-center justify-center transition-all duration-400 ${
              activeStage > 3
                ? 'bg-brand-teal text-white shadow-2xs'
                : activeStage === 3
                ? 'bg-brand-indigo text-white ring-4 ring-brand-indigo/20 shadow-xs scale-110'
                : 'bg-white text-outline border border-outline-variant'
            }`}>
              {activeStage > 3 ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                '03'
              )}
            </div>
          </div>

          {/* Stage 03 Content (Right Column) */}
          <div className="w-full md:w-1/2 pl-12 md:pl-12 text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-indigo uppercase bg-brand-indigo/10 px-2 py-0.5 rounded border border-brand-indigo/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse" />
                SOLUTION BUILDING
              </span>
              <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
                {t('howItWorksPage.stage3Tag')}
              </span>
            </div>

            <h3 className="font-headline-md text-brand-indigo text-xl sm:text-2xl font-extrabold">
              {t('howItWorksPage.stage3Title')}
            </h3>

            <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              {t('howItWorksPage.stage3Desc')}
            </p>

            {/* Collaboration Constellation Diagram */}
            <div className="mt-3 p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/40 max-w-[340px] space-y-2">
              <div className="text-[10px] font-mono font-bold text-brand-indigo uppercase tracking-wider">
                MULTIDISCIPLINARY CONSTELLATION
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-lg border border-outline-variant/30 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xs">school</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-indigo block leading-none">STUDENTS</span>
                    <span className="text-[9px] text-on-surface-variant">Proposals &amp; Code</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-lg border border-outline-variant/30 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xs">supervisor_account</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-violet block leading-none">MENTORS</span>
                    <span className="text-[9px] text-on-surface-variant">Faculty Guidance</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-lg border border-outline-variant/30 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xs">sensors</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-teal block leading-none">HARDWARE/IoT</span>
                    <span className="text-[9px] text-on-surface-variant">Sensors &amp; Research</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-lg border border-outline-variant/30 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xs">handshake</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 block leading-none">COMMUNITY</span>
                    <span className="text-[9px] text-on-surface-variant">Ground Testing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 04: RETURN TO COMMUNITY IMPACT */}
        <div data-stage="4" className="relative z-10 my-12 sm:my-20 flex flex-col md:flex-row items-start md:items-center w-full">
          {/* Node 04 */}
          <div className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-20">
            <div className={`w-9 h-9 rounded-full font-mono font-bold text-xs flex items-center justify-center transition-all duration-400 ${
              activeStage === 4
                ? 'bg-brand-teal text-white ring-4 ring-brand-teal/20 shadow-xs scale-110'
                : 'bg-white text-outline border border-outline-variant'
            }`}>
              04
            </div>
          </div>

          {/* Stage 04 Content (Left Column on Desktop, Right Column on Mobile) */}
          <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 text-left md:text-right space-y-2 order-2 md:order-1">
            <div className="flex items-center gap-2 md:justify-end">
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-teal uppercase bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                RETURNING TO COMMUNITY IMPACT
              </span>
              <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                {t('howItWorksPage.stage4Tag')}
              </span>
            </div>

            <h3 className="font-headline-md text-brand-indigo text-xl sm:text-2xl font-extrabold">
              {t('howItWorksPage.stage4Title')}
            </h3>

            <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              {t('howItWorksPage.stage4Desc')}
            </p>

            {/* Full Circle Return Loop */}
            <div className="mt-3 p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/40 max-w-[320px] space-y-1.5 text-left md:ml-auto">
              <div className="text-[10px] font-mono font-bold text-brand-teal uppercase tracking-wider flex items-center justify-between">
                <span>FULL-CIRCLE RETURN</span>
                <span className="material-symbols-outlined text-sm text-brand-teal">sync</span>
              </div>

              <div className="p-2 bg-white rounded-lg border border-brand-teal/30 flex items-center justify-between text-[11px] text-brand-indigo font-bold">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-brand-teal text-xs">hardware</span>
                  <span>Prototype</span>
                </div>
                <span className="text-outline-variant">→</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-brand-violet text-xs">domain</span>
                  <span>Partners</span>
                </div>
                <span className="text-outline-variant">→</span>
                <div className="flex items-center gap-1 text-brand-teal">
                  <span className="material-symbols-outlined text-xs">public</span>
                  <span>Impact</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-1/2 pl-12 text-left order-2" />
        </div>

      </section>

      {/* 3. ELEGANT JOURNEY RESOLUTION CTA */}
      <section className="max-w-xl mx-auto mt-20 pt-10 border-t border-outline-variant/40 text-center space-y-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-brand-violet uppercase bg-brand-violet/10 px-3 py-1 rounded-full border border-brand-violet/20 inline-block">
          THE JOURNEY CONTINUES
        </span>

        <h2 className="font-headline-md text-[#1E1B4B] text-2xl sm:text-3xl font-extrabold">
          {t('howItWorksPage.readyTitle')}
        </h2>

        <p className="font-body-md text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          {t('howItWorksPage.readyDesc')}
        </p>

        <button
          onClick={() => navigate('/role-selection')}
          className="group bg-brand-indigo hover:bg-brand-violet text-white px-8 py-3.5 rounded-full font-label-md font-bold text-xs sm:text-sm transition-all shadow-md inline-flex items-center justify-center gap-2 mx-auto cursor-pointer hover:scale-[1.01] active:scale-98"
        >
          <span>{t('howItWorksPage.choosePathwayBtn')}</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
        </button>
      </section>

    </main>
  );
}
