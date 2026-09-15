import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { updateReportDraft } from '../features/app/appSlice';
import { useTranslation } from '../lib/useTranslation';

export default function ReportMethodView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSelectMethod = (method) => {
    dispatch(updateReportDraft({ method }));
    if (method === 'voice') {
      navigate('/citizen/report/voice');
    } else {
      navigate('/citizen/report/text');
    }
  };

  const handleKeyDown = (e, method) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectMethod(method);
    }
  };

  const steps = [
    { 
      num: '1', 
      key: 'step1', 
      icon: 'mic', 
      titleKey: 'step1', 
      subKey: 'step1Sub', 
      path: '/citizen/report/method', 
      active: true, 
      completed: false 
    },
    { 
      num: '2', 
      key: 'step2', 
      icon: 'photo_camera', 
      titleKey: 'step2', 
      subKey: 'step2Sub', 
      path: '/citizen/report/evidence', 
      active: false, 
      completed: false 
    },
    { 
      num: '3', 
      key: 'step3', 
      icon: 'location_on', 
      titleKey: 'step3', 
      subKey: 'step3Sub', 
      path: '/citizen/report/location', 
      active: false, 
      completed: false 
    },
    { 
      num: '4', 
      key: 'step4', 
      icon: 'fact_check', 
      titleKey: 'step4', 
      subKey: 'step4Sub', 
      path: '/citizen/report/review', 
      active: false, 
      completed: false 
    },
    { 
      num: '5', 
      key: 'step5', 
      icon: 'send', 
      titleKey: 'step5', 
      subKey: 'step5Sub', 
      path: '/citizen/report/submitted', 
      active: false, 
      completed: false 
    }
  ];

  return (
    <main className="flex-grow py-5 sm:py-7 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col justify-between relative overflow-hidden text-on-surface">
      
      {/* Background Observation Signal Motif (Subtle backdrop) */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden -z-10 flex items-center justify-center">
        <svg className="w-full h-full text-brand-indigo max-w-4xl" viewBox="0 0 800 400" fill="none">
          <circle cx="400" cy="200" r="100" stroke="#159B8C" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.25" />
          <circle cx="400" cy="200" r="160" stroke="#5B3FD6" strokeDasharray="6 6" strokeWidth="1" strokeOpacity="0.2" />
          <path d="M 400 200 Q 280 130 200 150" stroke="#159B8C" strokeDasharray="3 3" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M 400 200 Q 520 130 600 150" stroke="#5B3FD6" strokeDasharray="3 3" strokeWidth="1.2" strokeOpacity="0.3" />
          <circle cx="400" cy="200" r="5" fill="#159B8C" />
          <circle cx="200" cy="150" r="4" fill="#5B3FD6" />
          <circle cx="600" cy="150" r="4" fill="#159B8C" />
        </svg>
      </div>

      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-between space-y-5">

        {/* 1. Top Header: Back Navigation & Quiet Status Indicator */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs sm:text-sm font-semibold transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-1 px-1.5"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
            <span>{t('reporting.common.back')}</span>
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-brand-violet/90 uppercase bg-brand-violet/5 px-2.5 py-0.5 rounded-full border border-brand-violet/15">
            {t('reporting.method.stepTag')}
          </span>
        </div>

        {/* 2. Sophisticated 5-Milestone Continuous Journey Line (110–130px height) */}
        <div className="w-full py-3 border-b border-outline-variant/30 min-h-[110px]">
          <div className="relative w-full">
            
            {/* Continuous Horizontal Journey Line running behind milestones */}
            <div className="absolute top-5 left-[6%] right-[6%] h-0.5 bg-outline-variant/40 -translate-y-1/2 z-0 hidden sm:block" />
            
            {/* Active Progress Fill Line from Step 1 toward Step 2 */}
            <div className="absolute top-5 left-[6%] w-[22%] h-0.5 bg-gradient-to-r from-brand-indigo to-brand-teal -translate-y-1/2 z-0 hidden sm:block motion-reduce:animate-none animate-pulse" />

            {/* 5 Milestones */}
            <div className="relative z-10 flex items-start justify-between">
              {steps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center group max-w-[130px] w-full">
                  
                  {/* Clean Circular Milestone Icon Container */}
                  <div className="relative mb-2 shrink-0">
                    {step.active ? (
                      <div className="w-10 h-10 rounded-full bg-brand-indigo text-white shadow-sm ring-4 ring-brand-violet/15 flex items-center justify-center transition-all duration-200">
                        <span className="material-symbols-outlined text-xl">{step.icon}</span>
                      </div>
                    ) : step.completed ? (
                      <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-xl">check</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white text-outline border border-outline-variant/60 flex items-center justify-center group-hover:scale-105 group-hover:border-brand-violet/40 transition-all duration-200">
                        <span className="material-symbols-outlined text-xl text-outline/60 group-hover:text-brand-indigo transition-colors">{step.icon}</span>
                      </div>
                    )}
                  </div>

                  {/* Milestone Titles & Subtexts */}
                  <div className="flex flex-col items-center">
                    <span className={`text-xs font-bold leading-tight transition-colors ${
                      step.active ? 'text-brand-indigo font-bold' : 'text-on-surface-variant/80 font-semibold group-hover:text-brand-indigo'
                    }`}>
                      {t(`reporting.method.steps.${step.titleKey}`)}
                    </span>

                    <span className={`text-[10px] leading-tight mt-0.5 hidden sm:block ${
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

        {/* 3. Hero Section Wording */}
        <div className="text-center max-w-2xl mx-auto space-y-2 py-1">
          <span className="font-label-sm text-brand-teal uppercase tracking-widest text-[10px] sm:text-[11px] font-bold block">
            {t('reporting.method.eyebrow')}
          </span>

          <h1 className="font-display-lg text-[#1E1B4B] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {t('reporting.method.titleLine1')} <span className="text-brand-violet">{t('reporting.method.titleLine2')}</span>
          </h1>

          <p className="font-body-md text-on-surface-variant text-xs sm:text-sm font-medium leading-relaxed max-w-lg mx-auto">
            {t('reporting.method.subtitle')}
          </p>

          {/* Multilingual Support Message */}
          <div className="inline-flex items-center gap-1.5 text-[11px] text-brand-violet font-semibold bg-brand-violet/5 px-3 py-1 rounded-full border border-brand-violet/15 mt-1 shadow-2xs">
            <span className="material-symbols-outlined text-xs">translate</span>
            <span>{t('reporting.method.multilingualNotice')}</span>
          </div>
        </div>

        {/* 4. Primary Choice Cards (Speak vs. Write) — COMPLETELY UNCHANGED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto w-full">

          {/* Option 1: SPEAK (Primary Recommended) */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Speak your problem"
            onClick={() => handleSelectMethod('voice')}
            onKeyDown={(e) => handleKeyDown(e, 'voice')}
            className="group cursor-pointer p-6 sm:p-7 rounded-2xl bg-white border-2 border-brand-indigo/80 shadow-2xs hover:border-brand-violet hover:shadow-md hover:-translate-y-1 transition-all duration-250 ease-out flex flex-col justify-between relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 min-h-[240px]"
          >
            {/* Recommended Badge */}
            <div className="absolute top-4 right-4 bg-brand-teal text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-2xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>{t('reporting.method.speak.tag')}</span>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                {/* Microphone Icon with Soft Ring Aura */}
                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-2xl bg-brand-teal/20 animate-ping opacity-25 group-hover:opacity-40 transition-opacity"></span>
                  <div className="w-14 h-14 rounded-2xl bg-brand-indigo text-white flex items-center justify-center shadow-md group-hover:bg-brand-violet group-hover:scale-[1.05] transition-all duration-250 ease-out relative z-10">
                    <span className="material-symbols-outlined text-3xl">mic</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-teal block">
                    {t('reporting.method.speak.recommended')}
                  </span>
                  <h2 className="font-headline-sm text-brand-indigo text-xl sm:text-2xl font-extrabold group-hover:text-brand-violet transition-colors duration-200">
                    {t('reporting.method.speak.title')}
                  </h2>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6 text-left">
                {t('reporting.method.speak.desc')}
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="w-full bg-brand-indigo text-white py-3 rounded-full font-label-md font-bold text-xs sm:text-sm group-hover:bg-brand-violet transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs group-hover:shadow-md">
              <span>{t('reporting.method.speak.btn')}</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1.5 transition-transform duration-200 ease-out">arrow_forward</span>
            </div>
          </div>

          {/* Option 2: WRITE (Secondary Alternative) */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Write your problem"
            onClick={() => handleSelectMethod('text')}
            onKeyDown={(e) => handleKeyDown(e, 'text')}
            className="group cursor-pointer p-6 sm:p-7 rounded-2xl bg-white border border-outline-variant/80 shadow-2xs hover:border-brand-violet/70 hover:shadow-md hover:-translate-y-1 transition-all duration-250 ease-out flex flex-col justify-between relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 min-h-[240px]"
          >
            {/* Alternative Badge */}
            <div className="absolute top-4 right-4 bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-outline-variant/40">
              {t('reporting.method.write.prompt')}
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-low text-brand-indigo flex items-center justify-center border border-outline-variant/60 group-hover:scale-[1.05] group-hover:bg-brand-violet/10 group-hover:text-brand-violet transition-all duration-250 ease-out shrink-0">
                  <span className="material-symbols-outlined text-3xl">edit_note</span>
                </div>

                <div className="text-left">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-outline block">TEXT FORM</span>
                  <h2 className="font-headline-sm text-brand-indigo text-xl sm:text-2xl font-extrabold group-hover:text-brand-violet transition-colors duration-200">
                    {t('reporting.method.write.btn')}
                  </h2>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6 text-left">
                Type what you noticed using simple everyday words.
              </p>
            </div>

            {/* Secondary Action Button */}
            <div className="w-full border border-outline-variant/80 text-brand-indigo py-3 rounded-full font-label-md font-bold text-xs sm:text-sm group-hover:border-brand-violet group-hover:text-brand-violet group-hover:bg-brand-violet/5 transition-all duration-200 flex items-center justify-center gap-2">
              <span>{t('reporting.method.write.btn')}</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1.5 transition-transform duration-200 ease-out">arrow_forward</span>
            </div>
          </div>

        </div>

        {/* 5. Guidance Reassurance */}
        <div className="w-full max-w-xl mx-auto text-center pt-2">
          <p className="text-xs text-on-surface-variant font-medium">
            💡 {t('reporting.method.reassurance')}
          </p>
        </div>

      </div>
    </main>
  );
}
