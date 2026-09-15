import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setRole } from '../features/app/appSlice';
import { useTranslation } from '../lib/useTranslation';
import LanguageSelector from '../components/LanguageSelector';

export default function RoleSelectionView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSelectRole = (role, path) => {
    dispatch(setRole(role));
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FAF8FF] via-white to-[#F6F3FB] text-on-surface overflow-x-hidden">

      {/* Minimal Transparent Header */}
      <header className="w-full pt-4 pb-2 px-6 md:px-margin-desktop max-w-container-max mx-auto bg-transparent relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Official SamadhanSetu Logo Asset */}
            <a onClick={() => navigate('/')} className="cursor-pointer group bg-transparent p-0 border-none shadow-none">
              <img
                src="/assests/logo.png"
                alt="SamadhanSetu — Civic Innovation Platform"
                className="w-[130px] sm:w-[150px] md:w-[165px] h-auto max-w-full object-contain block bg-transparent transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
              />
            </a>

            {/* Vertical Divider & Back to Home Link */}
            <div className="h-5 w-px bg-outline-variant/60 hidden sm:block"></div>

            <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs sm:text-sm font-semibold transition-colors group cursor-pointer">
              <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
              <span>{t('roleSelection.backToHome')}</span>
            </button>
          </div>

          {/* Persistent Language Switcher */}
          <div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center py-2 sm:py-4 px-6 md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">

        {/* Subtle Ecosystem Network Background Metaphor */}
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden -z-10 flex items-center justify-center">
          <svg className="w-full h-full text-brand-indigo max-w-5xl" viewBox="0 0 800 450" fill="none">
            <path d="M 200 120 Q 400 225 600 120" stroke="#159B8C" strokeDasharray="6 6" strokeWidth="1.5" strokeOpacity="0.35" className="animate-dash-flow" />
            <path d="M 200 330 Q 400 225 600 330" stroke="#5B3FD6" strokeDasharray="6 6" strokeWidth="1.5" strokeOpacity="0.35" className="animate-dash-flow" />
            <path d="M 200 120 L 200 330" stroke="#352C85" strokeDasharray="6 6" strokeWidth="1.5" strokeOpacity="0.35" className="animate-dash-flow" />
            <path d="M 600 120 L 600 330" stroke="#159B8C" strokeDasharray="6 6" strokeWidth="1.5" strokeOpacity="0.35" className="animate-dash-flow" />

            <circle cx="200" cy="120" r="5" fill="#159B8C" className="animate-node-glow" />
            <circle cx="600" cy="120" r="5" fill="#5B3FD6" className="animate-node-glow" />
            <circle cx="200" cy="330" r="5" fill="#352C85" className="animate-node-glow" />
            <circle cx="600" cy="330" r="5" fill="#159B8C" className="animate-node-glow" />
          </svg>
        </div>

        {/* Compact Hero Header with Smooth Entrance Animation */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6 space-y-1.5">
          <span className="font-label-sm text-brand-violet uppercase tracking-widest text-[11px] font-bold block animate-slide-left">
            {t('roleSelection.eyebrow')}
          </span>

          <h1 className="font-display-lg text-[#1E1B4B] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight animate-slide-left">
            {t('roleSelection.title')}
          </h1>

          <p className="font-body-md text-on-surface-variant text-xs sm:text-sm font-medium leading-relaxed max-w-lg mx-auto animate-slide-left stagger-delay-1">
            {t('roleSelection.subtitle')}
          </p>
        </div>

        {/* Role Selection 2 x 2 Grid with SamadhanSetu Indigo/Purple Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-5xl mx-auto w-full mb-4">

          {/* Actor 1: Citizen / Community */}
          <div
            onClick={() => handleSelectRole('citizen', '/citizen/access')}
            className="role-card group cursor-pointer p-5 sm:p-6 rounded-2xl bg-white border border-outline-variant/70 shadow-2xs hover:border-brand-violet/70 hover:shadow-md hover:-translate-y-1 transition-all duration-250 ease-out flex flex-col justify-between min-h-[190px] relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-teal block">{t('roleSelection.citizenTag')}</span>
                  <span className="text-[11px] font-semibold text-brand-indigo block">{t('roleSelection.citizenSubTag')}</span>
                  <h2 className="font-headline-sm text-brand-indigo text-lg sm:text-xl font-extrabold group-hover:text-brand-violet transition-colors duration-200 mt-0.5">
                    {t('roleSelection.citizenTitle')}
                  </h2>
                </div>

                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-brand-teal/20 opacity-0 group-hover:opacity-100 group-hover:animate-signal-ripple pointer-events-none transition-opacity duration-200" />
                  <div className="w-11 h-11 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center transition-all duration-250 ease-out group-hover:scale-[1.05] group-hover:bg-brand-violet group-hover:text-white shrink-0 relative z-10 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">groups</span>
                  </div>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-snug mb-3">
                {t('roleSelection.citizenSubtitle')}
              </p>
            </div>

            <div className="flex items-center text-brand-indigo font-label-md font-bold text-xs sm:text-sm pt-3 border-t border-outline-variant/30 group-hover:text-brand-violet transition-colors duration-200">
              <span>{t('roleSelection.citizenAction')}</span>
              <span className="material-symbols-outlined text-base ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200 ease-out text-brand-violet">arrow_forward</span>
            </div>
          </div>

          {/* Actor 2: Student / Innovator */}
          <div
            onClick={() => handleSelectRole('student', '/student/explorer')}
            className="role-card group cursor-pointer p-5 sm:p-6 rounded-2xl bg-white border border-outline-variant/70 shadow-2xs hover:border-brand-violet/70 hover:shadow-md hover:-translate-y-1 transition-all duration-250 ease-out flex flex-col justify-between min-h-[190px] relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-violet block">{t('roleSelection.studentTag')}</span>
                  <span className="text-[11px] font-semibold text-brand-indigo block">{t('roleSelection.studentSubTag')}</span>
                  <h2 className="font-headline-sm text-brand-indigo text-lg sm:text-xl font-extrabold group-hover:text-brand-violet transition-colors duration-200 mt-0.5">
                    {t('roleSelection.studentTitle')}
                  </h2>
                </div>

                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-brand-violet/20 opacity-0 group-hover:opacity-100 group-hover:animate-signal-ripple pointer-events-none transition-opacity duration-200" />
                  <div className="w-11 h-11 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center transition-all duration-250 ease-out group-hover:scale-[1.05] group-hover:bg-brand-violet group-hover:text-white shrink-0 relative z-10 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">lightbulb</span>
                  </div>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-snug mb-3">
                {t('roleSelection.studentSubtitle')}
              </p>
            </div>

            <div className="flex items-center text-brand-violet font-label-md font-bold text-xs sm:text-sm pt-3 border-t border-outline-variant/30 group-hover:text-brand-indigo transition-colors duration-200">
              <span>{t('roleSelection.studentAction')}</span>
              <span className="material-symbols-outlined text-base ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200 ease-out text-brand-violet">arrow_forward</span>
            </div>
          </div>

          {/* Actor 3: University / Mentor */}
          <div
            onClick={() => handleSelectRole('mentor', '/university/access')}
            className="role-card group cursor-pointer p-5 sm:p-6 rounded-2xl bg-white border border-outline-variant/70 shadow-2xs hover:border-brand-indigo/70 hover:shadow-md hover:-translate-y-1 transition-all duration-250 ease-out flex flex-col justify-between min-h-[190px] relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-indigo block">{t('roleSelection.mentorTag')}</span>
                  <span className="text-[11px] font-semibold text-brand-indigo block">{t('roleSelection.mentorSubTag')}</span>
                  <h2 className="font-headline-sm text-brand-indigo text-lg sm:text-xl font-extrabold group-hover:text-brand-violet transition-colors duration-200 mt-0.5">
                    {t('roleSelection.mentorTitle')}
                  </h2>
                </div>

                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-brand-indigo/20 opacity-0 group-hover:opacity-100 group-hover:animate-signal-ripple pointer-events-none transition-opacity duration-200" />
                  <div className="w-11 h-11 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center transition-all duration-250 ease-out group-hover:scale-[1.05] group-hover:bg-brand-indigo group-hover:text-white shrink-0 relative z-10 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-snug mb-3">
                {t('roleSelection.mentorSubtitle')}
              </p>
            </div>

            <div className="flex items-center text-brand-indigo font-label-md font-bold text-xs sm:text-sm pt-3 border-t border-outline-variant/30 group-hover:text-brand-violet transition-colors duration-200">
              <span>{t('roleSelection.mentorAction')}</span>
              <span className="material-symbols-outlined text-base ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200 ease-out text-brand-violet">arrow_forward</span>
            </div>
          </div>

          {/* Actor 4: Industry / Organization */}
          <div
            onClick={() => handleSelectRole('partner', '/partner/placeholder')}
            className="role-card group cursor-pointer p-5 sm:p-6 rounded-2xl bg-white border border-outline-variant/70 shadow-2xs hover:border-brand-violet/70 hover:shadow-md hover:-translate-y-1 transition-all duration-250 ease-out flex flex-col justify-between min-h-[190px] relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-teal block">{t('roleSelection.partnerTag')}</span>
                  <span className="text-[11px] font-semibold text-brand-indigo block">{t('roleSelection.partnerSubTag')}</span>
                  <h2 className="font-headline-sm text-brand-indigo text-lg sm:text-xl font-extrabold group-hover:text-brand-violet transition-colors duration-200 mt-0.5">
                    {t('roleSelection.partnerTitle')}
                  </h2>
                </div>

                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-brand-teal/20 opacity-0 group-hover:opacity-100 group-hover:animate-signal-ripple pointer-events-none transition-opacity duration-200" />
                  <div className="w-11 h-11 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center transition-all duration-250 ease-out group-hover:scale-[1.05] group-hover:bg-brand-violet group-hover:text-white shrink-0 relative z-10 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">handshake</span>
                  </div>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-snug mb-3">
                {t('roleSelection.partnerSubtitle')}
              </p>
            </div>

            <div className="flex items-center text-brand-indigo font-label-md font-bold text-xs sm:text-sm pt-3 border-t border-outline-variant/30 group-hover:text-brand-violet transition-colors duration-200">
              <span>{t('roleSelection.partnerAction')}</span>
              <span className="material-symbols-outlined text-base ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200 ease-out text-brand-violet">arrow_forward</span>
            </div>
          </div>

        </div>

        {/* Compact Bottom Statement */}
        <div className="text-center pt-1">
          <p className="font-body-md text-on-surface-variant text-xs font-medium">
            {t('roleSelection.bottomText')}
            <button onClick={() => navigate('/auth')} className="text-brand-violet font-semibold hover:underline inline-flex items-center cursor-pointer ml-1.5">
              {t('nav.signIn')} <span className="material-symbols-outlined text-xs ml-0.5">arrow_forward</span>
            </button>
          </p>
        </div>

      </main>
    </div>
  );
}
