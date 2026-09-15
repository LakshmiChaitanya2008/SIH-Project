import { useNavigate } from 'react-router';
import { useTranslation } from '../lib/useTranslation';

export default function IntroView() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="flex-grow w-full bg-[#FAFAF8] text-[#1D1B20]">
      
      {/* 1. HERO SECTION: Narrative & Primary Real-World Photograph */}
      <section id="hero-section" className="relative py-10 md:py-14 lg:py-16 px-6 md:px-margin-desktop max-w-container-max mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Main Narrative & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            
            {/* Eyebrow Tag */}
            <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-outline-variant/60 shadow-2xs mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-node-glow"></span>
              <span className="font-label-sm text-brand-violet uppercase tracking-widest text-[11px] font-bold">
                {t('landingPage.heroTag')}
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="hero-title-responsive font-display-lg text-brand-indigo mb-6 font-black tracking-tight leading-[1.1] max-w-2xl">
              <span className="block text-[#1E1B4B]">{t('landingPage.heroTitleLine1')}</span>
              <span className="block mt-1 text-gradient-shimmer">{t('landingPage.heroTitleLine2')}</span>
            </h1>

            {/* Ecosystem Supporting Text */}
            <p className="animate-fade-in-up stagger-4 font-body-lg text-on-surface-variant max-w-xl mb-8 text-base md:text-lg leading-relaxed">
              {t('landingPage.heroSubtitle')}
            </p>

            {/* Dual CTAs */}
            <div className="animate-fade-in-up stagger-5 flex flex-wrap items-center gap-4 w-full mb-8">
              <button 
                onClick={() => navigate('/citizen/report/method')} 
                className="bg-brand-indigo text-white px-7 py-3.5 rounded-full font-label-md text-sm font-bold hover:bg-brand-violet transition-all duration-300 shadow-md flex items-center gap-2 group/primary hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{t('landingPage.shareProblemBtn')}</span>
                <span className="material-symbols-outlined text-lg group-hover/primary:translate-x-1.5 transition-transform duration-200">arrow_forward</span>
              </button>

              <button 
                onClick={() => navigate('/explore-challenges')} 
                className="bg-white border border-outline-variant text-brand-indigo px-6 py-3.5 rounded-full font-label-md text-sm font-bold hover:border-brand-violet hover:text-brand-violet hover:bg-brand-indigo/5 transition-all duration-300 shadow-2xs flex items-center gap-2 group/secondary hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{t('landingPage.exploreChallengesBtn')}</span>
                <span className="material-symbols-outlined text-lg group-hover/secondary:translate-x-1.5 transition-transform duration-200">east</span>
              </button>
            </div>

            {/* Integrated Search Bar */}
            <div className="animate-fade-in-up stagger-5 w-full max-w-xl relative mb-6 group">
              <div className="relative flex items-center bg-white border border-outline-variant/80 rounded-full p-1 shadow-2xs hover:border-brand-violet/60 focus-within:border-brand-violet focus-within:ring-2 focus-within:ring-brand-violet/15 transition-all duration-300">
                <span className="material-symbols-outlined pl-4 text-outline text-lg group-focus-within:text-brand-violet transition-colors">search</span>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-none py-2 pl-3 pr-4 font-body-md text-on-surface focus:outline-none placeholder:text-outline text-xs" 
                  placeholder={t('landingPage.searchPlaceholder')}
                />
                <button 
                  onClick={() => navigate('/explore-challenges')} 
                  className="bg-brand-indigo text-white px-5 py-2 rounded-full font-label-md text-xs font-semibold hover:bg-brand-violet transition-all duration-200 shrink-0 cursor-pointer"
                >
                  {t('landingPage.searchBtn')}
                </button>
              </div>
            </div>

            {/* Quick Domain Filter Pills */}
            <div className="animate-fade-in-up stagger-6 flex flex-wrap gap-2 items-center text-xs font-label-md text-on-surface-variant mb-6">
              <span className="font-bold text-brand-indigo mr-1">{t('landingPage.domainsLabel')}</span>
              <button onClick={() => navigate('/explore-challenges')} className="px-3.5 py-1.5 border border-outline-variant/60 rounded-full bg-white text-on-surface-variant hover:bg-surface-container-low hover:border-brand-violet hover:text-brand-indigo transition-all duration-200 shadow-2xs cursor-pointer">{t('categories.water')}</button>
              <button onClick={() => navigate('/explore-challenges')} className="px-3.5 py-1.5 border border-outline-variant/60 rounded-full bg-white text-on-surface-variant hover:bg-surface-container-low hover:border-brand-violet hover:text-brand-indigo transition-all duration-200 shadow-2xs cursor-pointer">{t('categories.healthcare')}</button>
              <button onClick={() => navigate('/explore-challenges')} className="px-3.5 py-1.5 border border-outline-variant/60 rounded-full bg-white text-on-surface-variant hover:bg-surface-container-low hover:border-brand-violet hover:text-brand-indigo transition-all duration-200 shadow-2xs cursor-pointer">{t('categories.agriculture')}</button>
              <button onClick={() => navigate('/explore-challenges')} className="px-3.5 py-1.5 border border-outline-variant/60 rounded-full bg-white text-on-surface-variant hover:bg-surface-container-low hover:border-brand-violet hover:text-brand-indigo transition-all duration-200 shadow-2xs cursor-pointer">{t('categories.education')}</button>
              <button onClick={() => navigate('/explore-challenges')} className="px-3 py-1.5 font-bold text-brand-violet hover:text-brand-indigo transition-colors flex items-center gap-1 group/more cursor-pointer">
                <span>{t('landingPage.moreBtn')}</span>
                <span className="material-symbols-outlined text-xs group-hover/more:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* Micro-Statement */}
            <div className="animate-fade-in-up stagger-6 flex items-center gap-2 text-[11px] font-medium text-outline pt-3 border-t border-outline-variant/40 w-full max-w-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
              <span>{t('landingPage.heroStatement')}</span>
            </div>

          </div>

          {/* RIGHT COLUMN: Primary Real-World Editorial Photograph */}
          <div className="lg:col-span-6 relative w-full h-[330px] sm:h-[380px] lg:h-[420px] rounded-3xl overflow-hidden shadow-md border border-outline-variant/60 bg-white group lg:self-start lg:mt-2">
            <img 
              src="/images/hero-community.jpg" 
              alt="Gram Sabha Civic Consultation, Gumla District" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>

        </div>
      </section>

      {/* 2. FEATURED COMMUNITY BRIEF SECTION */}
      <section className="reveal-on-scroll py-12 px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-white rounded-3xl border border-outline-variant/80 p-6 lg:p-10 shadow-xs hover:border-brand-violet/60 hover:shadow-md transition-all duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Brief Content */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/30">
                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></span>
                <span className="font-label-sm text-brand-teal font-bold uppercase tracking-widest text-[11px]">{t('landingPage.validatedBriefTag')}</span>
              </div>

              <h2 className="font-headline-md text-brand-indigo text-2xl sm:text-3xl font-extrabold leading-tight">
                {t('landingPage.featuredTitle')}
              </h2>

              <p className="font-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">
                {t('landingPage.featuredDesc')}
              </p>

              {/* Metric Pills */}
              <div className="flex flex-wrap items-center gap-3 py-2 text-xs font-semibold text-brand-indigo">
                <div className="flex items-center gap-2 bg-[#FAFAF8] px-3.5 py-2 rounded-xl border border-outline-variant/40">
                  <span className="material-symbols-outlined text-brand-teal text-base">assignment</span>
                  <span>47 Reports</span>
                </div>
                <div className="flex items-center gap-2 bg-[#FAFAF8] px-3.5 py-2 rounded-xl border border-outline-variant/40">
                  <span className="material-symbols-outlined text-brand-teal text-base">location_on</span>
                  <span>12 Villages</span>
                </div>
                <div className="flex items-center gap-2 bg-[#FAFAF8] px-3.5 py-2 rounded-xl border border-outline-variant/40">
                  <span className="material-symbols-outlined text-brand-teal text-base">groups</span>
                  <span>2 Teams Exploring</span>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => navigate('/explore-challenges')} 
                  className="inline-flex items-center gap-2 font-label-md text-brand-violet text-sm font-bold hover:text-brand-indigo transition-colors border-b-2 border-brand-violet hover:border-brand-indigo pb-0.5 group/cta cursor-pointer"
                >
                  <span>{t('landingPage.exploreBriefBtn')}</span>
                  <span className="material-symbols-outlined text-base group-hover/cta:translate-x-1.5 transition-transform duration-200">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Right Documentary Water Photo Card */}
            <div className="lg:col-span-6 relative h-72 sm:h-80 w-full rounded-2xl border border-outline-variant/60 overflow-hidden shadow-sm group/card">
              <img 
                src="/images/water-challenge.jpg" 
                alt="Community Water Station Inspection" 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-white/60 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-brand-indigo uppercase tracking-wider">EASTERN DISTRICT WATER BRIEF</div>
                  <div className="text-[11px] text-on-surface-variant">Hand Pump Quality Signal Cluster • PAT-2026-08</div>
                </div>
                <span className="material-symbols-outlined text-brand-violet">water_drop</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. PROBLEM EXPLORER: DOMAIN CARDS */}
      <section className="reveal-on-scroll py-14 px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-bold text-brand-teal uppercase tracking-widest block mb-1">{t('landingPage.problemExplorerTag')}</span>
            <h3 className="font-headline-md text-brand-indigo text-2xl md:text-3xl font-extrabold">{t('landingPage.problemExplorerTitle')}</h3>
          </div>

          <button 
            onClick={() => navigate('/explore-challenges')} 
            className="hidden md:flex items-center gap-2 font-label-md text-sm font-bold text-brand-violet hover:text-brand-indigo transition-colors group/all cursor-pointer"
          >
            <span>{t('landingPage.viewAllDomains')}</span>
            <span className="material-symbols-outlined text-base group-hover/all:translate-x-1.5 transition-transform duration-200">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Healthcare Card */}
          <div 
            onClick={() => navigate('/explore-challenges')} 
            className="domain-card flex flex-col bg-white p-7 rounded-2xl border border-outline-variant/70 shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] text-brand-indigo flex items-center justify-center group-hover:bg-brand-indigo group-hover:text-white transition-all duration-300 border border-outline-variant/50">
                <span className="material-symbols-outlined text-2xl">local_hospital</span>
              </div>
              <span className="text-[10px] font-bold text-brand-violet uppercase tracking-wider bg-[#FAFAF8] px-2.5 py-1 rounded-full border border-outline-variant/40">14 Challenges</span>
            </div>
            
            <h4 className="font-headline-sm text-brand-indigo font-bold text-xl mb-3 group-hover:text-brand-violet transition-colors">{t('categories.healthcare')}</h4>
            <p className="font-body-sm text-on-surface-variant text-xs mb-6 leading-relaxed flex-grow">Addressing last-mile delivery of medical supplies and remote diagnostic challenges in tribal blocks.</p>
            
            <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs font-bold text-brand-indigo mt-auto">
              <span>Explore Domain</span>
              <span className="material-symbols-outlined text-base text-brand-violet group-hover:translate-x-1.5 transition-transform">east</span>
            </div>
          </div>

          {/* Agriculture Card (Featured) */}
          <div 
            onClick={() => navigate('/explore-challenges')} 
            className="domain-card flex flex-col bg-white p-7 rounded-2xl border-2 border-brand-violet/50 shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group relative"
          >
            <span className="absolute top-4 right-4 bg-brand-violet text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">Featured</span>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] text-brand-teal flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-all duration-300 border border-outline-variant/50">
                <span className="material-symbols-outlined text-2xl">agriculture</span>
              </div>
            </div>
            
            <h4 className="font-headline-sm text-brand-indigo font-bold text-xl mb-3 group-hover:text-brand-violet transition-colors">{t('categories.agriculture')}</h4>
            <p className="font-body-sm text-on-surface-variant text-xs mb-6 leading-relaxed flex-grow">Solutions for unpredictable monsoon cycles, soil degradation, and market linkage for smallholder farmers.</p>
            
            <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs font-bold text-brand-indigo mt-auto">
              <span>8 Challenges</span>
              <span className="material-symbols-outlined text-base text-brand-violet group-hover:translate-x-1.5 transition-transform">east</span>
            </div>
          </div>

          {/* Education Card */}
          <div 
            onClick={() => navigate('/explore-challenges')} 
            className="domain-card flex flex-col bg-white p-7 rounded-2xl border border-outline-variant/70 shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] text-brand-indigo flex items-center justify-center group-hover:bg-brand-indigo group-hover:text-white transition-all duration-300 border border-outline-variant/50">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <span className="text-[10px] font-bold text-brand-violet uppercase tracking-wider bg-[#FAFAF8] px-2.5 py-1 rounded-full border border-outline-variant/40">22 Challenges</span>
            </div>
            
            <h4 className="font-headline-sm text-brand-indigo font-bold text-xl mb-3 group-hover:text-brand-violet transition-colors">{t('categories.education')}</h4>
            <p className="font-body-sm text-on-surface-variant text-xs mb-6 leading-relaxed flex-grow">Bridging the digital divide with low-bandwidth learning tools and vernacular language resources.</p>
            
            <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs font-bold text-brand-indigo mt-auto">
              <span>Explore Domain</span>
              <span className="material-symbols-outlined text-base text-brand-violet group-hover:translate-x-1.5 transition-transform">east</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. HOW SAMADHANSETU WORKS: 6-STAGE ECOSYSTEM JOURNEY */}
      <section id="how-it-works" className="reveal-on-scroll py-16 bg-white border-t border-outline-variant/60">
        <div className="px-6 md:px-margin-desktop max-w-container-max mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-brand-violet uppercase tracking-widest">{t('landingPage.howItWorksTag')}</span>
            <h3 className="font-headline-md text-brand-indigo text-2xl md:text-3xl font-extrabold">{t('landingPage.howItWorksTitle')}</h3>
            <p className="text-xs text-on-surface-variant">{t('landingPage.howItWorksSub')}</p>
          </div>

          {/* 6 Connected Journey Stages */}
          <div className="relative mb-14">
            <div className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 bg-outline-variant/50"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
              
              {/* Stage 01: OBSERVE */}
              <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-outline-variant/50 flex flex-col items-center text-center group hover:-translate-y-1 hover:border-brand-indigo/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-white text-brand-indigo border border-outline-variant/60 flex items-center justify-center font-label-md text-xs font-bold mb-3 shadow-2xs group-hover:bg-brand-indigo group-hover:text-white transition-colors">01</div>
                <h4 className="font-label-md text-brand-indigo font-bold text-xs mb-1 uppercase tracking-wider">OBSERVE</h4>
                <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed">Citizens share what they experience in daily life.</p>
              </div>

              {/* Stage 02: SIGNAL */}
              <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-outline-variant/50 flex flex-col items-center text-center group hover:-translate-y-1 hover:border-brand-indigo/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-white text-brand-indigo border border-outline-variant/60 flex items-center justify-center font-label-md text-xs font-bold mb-3 shadow-2xs group-hover:bg-brand-indigo group-hover:text-white transition-colors">02</div>
                <h4 className="font-label-md text-brand-indigo font-bold text-xs mb-1 uppercase tracking-wider">SIGNAL</h4>
                <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed">AI structures and contextualizes raw reports.</p>
              </div>

              {/* Stage 03: PATTERN */}
              <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-outline-variant/50 flex flex-col items-center text-center group hover:-translate-y-1 hover:border-brand-indigo/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-white text-brand-indigo border border-outline-variant/60 flex items-center justify-center font-label-md text-xs font-bold mb-3 shadow-2xs group-hover:bg-brand-indigo group-hover:text-white transition-colors">03</div>
                <h4 className="font-label-md text-brand-indigo font-bold text-xs mb-1 uppercase tracking-wider">PATTERN</h4>
                <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed">Similar signals reveal broader community trends.</p>
              </div>

              {/* Stage 04: VALIDATE */}
              <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-outline-variant/50 flex flex-col items-center text-center group hover:-translate-y-1 hover:border-brand-teal/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-white text-brand-teal border border-outline-variant/60 flex items-center justify-center font-label-md text-xs font-bold mb-3 shadow-2xs group-hover:bg-brand-teal group-hover:text-white transition-colors">04</div>
                <h4 className="font-label-md text-brand-teal font-bold text-xs mb-1 uppercase tracking-wider">VALIDATE</h4>
                <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed">Mentors & experts confirm problem severity.</p>
              </div>

              {/* Stage 05: CHALLENGE */}
              <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-brand-violet/40 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-brand-violet text-white flex items-center justify-center font-label-md text-xs font-bold mb-3 shadow-2xs">05</div>
                <h4 className="font-label-md text-brand-violet font-bold text-xs mb-1 uppercase tracking-wider">CHALLENGE</h4>
                <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed font-semibold">Formulated into open research briefs.</p>
              </div>

              {/* Stage 06: SOLVE & IMPACT */}
              <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-outline-variant/50 flex flex-col items-center text-center group hover:-translate-y-1 hover:border-brand-teal/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-white text-brand-teal border border-outline-variant/60 flex items-center justify-center font-label-md text-xs font-bold mb-3 shadow-2xs group-hover:bg-brand-teal group-hover:text-white transition-colors">06</div>
                <h4 className="font-label-md text-brand-teal font-bold text-xs mb-1 uppercase tracking-wider">SOLVE</h4>
                <p className="font-body-sm text-on-surface-variant text-[11px] leading-relaxed">Students & innovators build real solutions.</p>
              </div>

            </div>
          </div>

          {/* Supporting Real-World Innovation Spotlight */}
          <div className="rounded-3xl border border-outline-variant/70 overflow-hidden shadow-xs bg-[#FAFAF8] grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 lg:p-10 space-y-4">
              <div className="text-xs font-extrabold text-brand-teal uppercase tracking-widest">{t('citizen.dashboard.spotlightTitle')}</div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-brand-indigo leading-tight">
                From Community Need to On-Field Student Innovation
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {t('citizen.dashboard.spotlightDesc')}
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => navigate('/role-selection')} 
                  className="bg-brand-indigo hover:bg-brand-violet text-white text-xs px-6 py-3 rounded-full font-bold transition-all shadow-2xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Join as an Innovator or Mentor</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full min-h-[260px] relative overflow-hidden">
              <img 
                src="/images/student-innovation.jpg" 
                alt="Student innovators and mentors testing water sensor" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. COMMUNITY CTA SECTION */}
      <section className="reveal-on-scroll py-16 bg-[#FAFAF8] border-t border-outline-variant/60 relative overflow-hidden">
        <div className="relative z-10 px-6 md:px-margin-desktop max-w-container-max mx-auto text-center flex flex-col items-center space-y-4">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest">{t('landingPage.haveYouNoticedTag')}</span>
          <h3 className="font-headline-md text-brand-indigo text-2xl md:text-3xl font-extrabold max-w-xl">
            {t('landingPage.haveYouNoticedTitle')}
          </h3>
          <p className="font-body-lg text-on-surface-variant text-sm md:text-base max-w-xl leading-relaxed">
            {t('landingPage.haveYouNoticedDesc')}
          </p>
          <div className="pt-4">
            <button 
              onClick={() => navigate('/citizen/report/method')} 
              className="bg-brand-indigo text-white px-8 py-4 rounded-full font-label-md text-sm font-bold hover:bg-brand-violet hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center gap-2.5 group/cta cursor-pointer"
            >
              <span>{t('landingPage.shareProblemBtn')}</span>
              <span className="material-symbols-outlined text-lg group-hover/cta:translate-x-1.5 transition-transform duration-200">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
