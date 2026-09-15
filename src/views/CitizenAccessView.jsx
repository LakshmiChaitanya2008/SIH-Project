import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Footer from '../components/Footer';
import { useTranslation } from '../lib/useTranslation';
import LanguageSelector from '../components/LanguageSelector';

export default function CitizenAccessView() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "Citizen Access | SamadhanSetu";
  }, []);

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface overflow-x-hidden">
      
      {/* Lightweight Application Header */}
      <header className="w-full pt-4 pb-2 px-6 md:px-margin-desktop max-w-container-max mx-auto bg-transparent relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Official SamadhanSetu Logo Asset */}
            <a 
              onClick={() => navigate('/')} 
              className="cursor-pointer group bg-transparent p-0 border-none shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-lg"
            >
              <img 
                src="/assests/logo.png" 
                alt="SamadhanSetu — Civic Innovation Platform" 
                className="w-[130px] sm:w-[150px] md:w-[165px] h-auto max-w-full object-contain block bg-transparent transition-transform duration-300 ease-out group-hover:scale-[1.02]" 
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
              />
            </a>

            {/* Vertical Divider & Back to Role Selection */}
            <div className="h-5 w-px bg-outline-variant/60 hidden sm:block"></div>

            <button 
              onClick={() => navigate('/role-selection')} 
              className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs sm:text-sm font-semibold transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-1 px-1.5"
            >
              <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
              <span>{t('citizenAccess.backToRole')}</span>
            </button>
          </div>

          <div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Gateway Content */}
      <main className="flex-grow flex flex-col justify-center py-4 sm:py-6 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        
        {/* Subtle Ambient Radial Light & Connected Civic Motif */}
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden -z-10 flex items-center justify-center">
          <svg className="w-full h-full text-brand-indigo max-w-4xl" viewBox="0 0 800 400" fill="none">
            <circle cx="200" cy="200" r="120" stroke="#2C8C86" strokeDasharray="6 6" strokeWidth="1.2" strokeOpacity="0.25" className="animate-dash-flow" />
            <circle cx="600" cy="200" r="120" stroke="#3F3A8A" strokeDasharray="6 6" strokeWidth="1.2" strokeOpacity="0.25" className="animate-dash-flow" />
            <path d="M 200 200 L 600 200" stroke="#24285B" strokeDasharray="4 4" strokeWidth="1.2" strokeOpacity="0.2" className="animate-dash-flow" />
            <circle cx="200" cy="200" r="3.5" fill="#2C8C86" className="animate-node-glow" />
            <circle cx="600" cy="200" r="3.5" fill="#3F3A8A" className="animate-node-glow" />
          </svg>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-1.5">
          <span className="font-label-sm text-brand-teal uppercase tracking-widest text-[11px] font-bold block">
            {t('citizenAccess.eyebrow')}
          </span>

          <h1 className="font-display-lg text-[#1E1B4B] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight animate-slide-left">
            {t('citizenAccess.title')}
          </h1>

          <p className="font-body-md text-on-surface-variant text-xs sm:text-sm font-medium leading-relaxed max-w-lg mx-auto">
            {t('citizenAccess.subtitle')}
          </p>
        </div>

        {/* Choice Cards Grid with Soft Elevation & Purple Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto w-full mb-6">
          
          {/* Card A: Sign In (Existing Citizen) */}
          <div 
            tabIndex={0}
            role="button"
            aria-label="Sign In to Existing Citizen Account"
            onClick={() => navigate('/auth', { state: { mode: 'signin' } })} 
            onKeyDown={(e) => handleKeyDown(e, () => navigate('/auth', { state: { mode: 'signin' } }))}
            className="group cursor-pointer p-6 sm:p-7 rounded-2xl bg-white border border-outline-variant/70 shadow-2xs hover:border-brand-violet/75 hover:shadow-md sm:hover:-translate-y-1.5 transition-all duration-250 ease-out flex flex-col justify-between relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 min-h-[210px]"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-teal block">{t('citizenAccess.existingTag')}</span>
                  <span className="text-[11px] font-semibold text-brand-indigo block">{t('citizenAccess.existingSubTag')}</span>
                  <h2 className="font-headline-sm text-brand-indigo text-xl sm:text-2xl font-extrabold group-hover:text-brand-violet transition-colors duration-200 mt-0.5">
                    {t('citizenAccess.signInTitle')}
                  </h2>
                </div>

                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-brand-violet/15 opacity-0 group-hover:opacity-100 group-hover:animate-signal-ripple pointer-events-none transition-opacity duration-200" />
                  <div className="w-11 h-11 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center transition-all duration-250 ease-out group-hover:scale-[1.05] group-hover:bg-brand-violet group-hover:text-white shrink-0 relative z-10 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">login</span>
                  </div>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-4">
                {t('citizenAccess.signInDesc')}
              </p>
            </div>

            <div className="pt-3.5 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-md text-xs sm:text-sm font-bold text-brand-indigo group-hover:text-brand-violet transition-colors duration-200 flex items-center gap-1.5">
                <span>{t('citizenAccess.signInBtn')}</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1.5 transition-transform duration-200 ease-out text-brand-violet">arrow_forward</span>
              </span>
            </div>
          </div>

          {/* Card B: Create Account (New Citizen) */}
          <div 
            tabIndex={0}
            role="button"
            aria-label="Create New Citizen Account"
            onClick={() => navigate('/auth', { state: { mode: 'signup' } })} 
            onKeyDown={(e) => handleKeyDown(e, () => navigate('/auth', { state: { mode: 'signup' } }))}
            className="group cursor-pointer p-6 sm:p-7 rounded-2xl bg-white border border-outline-variant/70 shadow-2xs hover:border-brand-violet/75 hover:shadow-md sm:hover:-translate-y-1.5 transition-all duration-250 ease-out flex flex-col justify-between relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 min-h-[210px]"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-violet block">{t('citizenAccess.newTag')}</span>
                  <span className="text-[11px] font-semibold text-brand-indigo block">{t('citizenAccess.newSubTag')}</span>
                  <h2 className="font-headline-sm text-brand-indigo text-xl sm:text-2xl font-extrabold group-hover:text-brand-violet transition-colors duration-200 mt-0.5">
                    {t('citizenAccess.signUpTitle')}
                  </h2>
                </div>

                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-brand-violet/15 opacity-0 group-hover:opacity-100 group-hover:animate-signal-ripple pointer-events-none transition-opacity duration-200" />
                  <div className="w-11 h-11 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center transition-all duration-250 ease-out group-hover:scale-[1.05] group-hover:bg-brand-violet group-hover:text-white shrink-0 relative z-10 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">person_add</span>
                  </div>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-4">
                {t('citizenAccess.signUpDesc')}
              </p>
            </div>

            <div className="pt-3.5 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-md text-xs sm:text-sm font-bold text-brand-violet group-hover:text-brand-indigo transition-colors duration-200 flex items-center gap-1.5">
                <span>{t('citizenAccess.signUpBtn')}</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1.5 transition-transform duration-200 ease-out text-brand-violet">arrow_forward</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Guidance & Assistance Statement */}
        <div className="text-center pt-1 mb-2">
          <p className="font-body-md text-on-surface-variant text-xs font-medium">
            {t('citizenAccess.needHelp')}{' '}
            <button onClick={() => navigate('/how-it-works')} className="text-brand-violet font-semibold hover:underline inline-flex items-center cursor-pointer mr-2">
              {t('citizenAccess.learnHow')}
            </button>
            {t('citizenAccess.or')}
            <button onClick={() => navigate('/role-selection')} className="text-brand-indigo font-semibold hover:underline inline-flex items-center cursor-pointer ml-2">
              {t('citizenAccess.selectRole')}
            </button>
          </p>
        </div>

      </main>

      {/* Clean Premium Footer */}
      <Footer />
    </div>
  );
}
