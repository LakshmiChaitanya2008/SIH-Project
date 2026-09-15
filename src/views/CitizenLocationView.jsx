import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { updateReportDraft } from '../features/app/appSlice';
import { getCurrentGPSLocation, JHARKHAND_DISTRICTS } from '../lib/geo';
import { useTranslation } from '../lib/useTranslation';

export default function CitizenLocationView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentLocation = useSelector((state) => state.app.reportDraft.location) || {
    label: 'Gumla District, Jharkhand',
    district: 'Gumla',
    state: 'Jharkhand',
    method: 'manual',
  };

  const [locationLabel, setLocationLabel] = useState(currentLocation.label);
  const [selectedDistrict, setSelectedDistrict] = useState(currentLocation.district || 'Gumla');
  const [searchQuery, setSearchQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [coords, setCoords] = useState({
    latitude: currentLocation.latitude || 23.0423,
    longitude: currentLocation.longitude || 84.5412,
  });

  const steps = [
    { num: '1', key: 'step1', icon: 'check', titleKey: 'step1', subKey: 'step1Sub', active: false, completed: true },
    { num: '2', key: 'step2', icon: 'check', titleKey: 'step2', subKey: 'step2Sub', active: false, completed: true },
    { num: '3', key: 'step3', icon: 'location_on', titleKey: 'step3', subKey: 'step3Sub', active: true, completed: false },
    { num: '4', key: 'step4', icon: 'fact_check', titleKey: 'step4', subKey: 'step4Sub', active: false, completed: false },
    { num: '5', key: 'step5', icon: 'task_alt', titleKey: 'step5', subKey: 'step5Sub', active: false, completed: false }
  ];

  const handleGPSLocation = async () => {
    setGpsLoading(true);
    setGpsError('');
    try {
      const loc = await getCurrentGPSLocation();
      setLocationLabel(loc.label);
      setSelectedDistrict(loc.district);
      setCoords({ latitude: loc.latitude, longitude: loc.longitude });
      dispatch(updateReportDraft({
        location: {
          label: loc.label,
          district: loc.district,
          state: loc.state,
          latitude: loc.latitude,
          longitude: loc.longitude,
          method: 'gps',
        }
      }));
    } catch (err) {
      setGpsError(err.message || 'Could not detect location. Please select your district below.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleSelectDistrict = (distName) => {
    setSelectedDistrict(distName);
    const label = `${distName} District, Jharkhand`;
    setLocationLabel(label);
    const districtObj = JHARKHAND_DISTRICTS.find(d => d.name === distName);
    const newCoords = districtObj ? { latitude: districtObj.lat, longitude: districtObj.lng } : coords;
    setCoords(newCoords);
    dispatch(updateReportDraft({
      location: {
        label,
        district: distName,
        state: 'Jharkhand',
        latitude: newCoords.latitude,
        longitude: newCoords.longitude,
        method: 'manual',
      }
    }));
  };

  const handleManualInput = (value) => {
    setLocationLabel(value);
  };

  const handleContinue = () => {
    dispatch(updateReportDraft({
      location: {
        label: locationLabel || `${selectedDistrict} District, Jharkhand`,
        district: selectedDistrict,
        state: 'Jharkhand',
        latitude: coords.latitude,
        longitude: coords.longitude,
        method: currentLocation.method || 'manual',
      }
    }));
    navigate('/citizen/report/final-review');
  };

  const filteredDistricts = JHARKHAND_DISTRICTS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  return (
    <main className="flex-grow py-3 sm:py-4 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-between relative text-on-surface">
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-start space-y-3">

        {/* 1. Header: Back Navigation & Step Tag */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => navigate('/citizen/report/evidence')}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-semibold transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-0.5 px-1"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
            <span>{t('reporting.common.back')}</span>
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-brand-violet uppercase bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            {t('reporting.location.stepTag')}
          </span>
        </div>

        {/* 2. Compact 5-Milestone Journey Line */}
        <div className="w-full py-1.5 border-b border-outline-variant/30 min-h-[75px]">
          <div className="relative w-full">
            {/* Background Line */}
            <div className="absolute top-4 left-[6%] right-[6%] h-0.5 bg-outline-variant/40 -translate-y-1/2 z-0 hidden sm:block" />
            
            {/* Active Step Line (Step 1 -> Step 2 -> Step 3) */}
            <div className="absolute top-4 left-[6%] w-[50%] h-0.5 bg-brand-indigo -translate-y-1/2 z-0 hidden sm:block" />

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
            {t('reporting.location.eyebrow')}
          </span>

          <h1 className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold tracking-tight">
            {t('reporting.location.title')}
          </h1>

          <p className="font-body-md text-on-surface-variant text-xs font-medium leading-normal max-w-md mx-auto">
            {t('reporting.location.subtitle')}
          </p>
        </div>

        {/* 4. Location Selected Summary Card */}
        <div className="w-full max-w-[620px] mx-auto bg-surface-container-low/70 p-3.5 rounded-xl border border-outline-variant/60 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-teal text-white flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-lg">location_on</span>
            </div>
            <div className="text-left">
              <span className="text-[9px] font-bold text-brand-teal uppercase tracking-widest block leading-tight">
                {t('reporting.location.selectedLabel')}
              </span>
              <div className="font-bold text-brand-indigo text-xs sm:text-sm leading-snug">
                {locationLabel}
              </div>
              <span className="text-[10px] text-on-surface-variant/80">
                District: <strong className="text-brand-indigo font-semibold">{selectedDistrict}</strong>
                {currentLocation.method === 'gps' && ' • Coordinates active'}
              </span>
            </div>
          </div>

          {currentLocation.method === 'gps' && (
            <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full border border-brand-teal/20 flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              <span>{t('reporting.location.gpsDetected')}</span>
            </span>
          )}
        </div>

        {/* GPS Error Alert */}
        {gpsError && (
          <div className="w-full max-w-[620px] mx-auto p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-sm shrink-0">info</span>
            <span>{gpsError}</span>
          </div>
        )}

        {/* 5. Open Location Options (2-Column Desktop Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full max-w-[620px] mx-auto">

          {/* LEFT COLUMN: Find Your Location */}
          <div className="space-y-3">

            {/* GPS Detection Button */}
            <button
              type="button"
              onClick={handleGPSLocation}
              disabled={gpsLoading}
              className="w-full p-3 rounded-xl border border-outline-variant/60 bg-white hover:border-brand-indigo hover:bg-surface-container-low transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs disabled:opacity-60"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className={`material-symbols-outlined text-lg ${gpsLoading ? 'animate-spin' : ''}`}>
                    {gpsLoading ? 'progress_activity' : 'my_location'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-brand-indigo text-xs">
                    {gpsLoading ? t('reporting.location.gpsDetecting') : t('reporting.location.useGps')}
                  </div>
                  <div className="text-[10px] text-on-surface-variant">{t('reporting.location.gpsSub')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-brand-indigo text-sm">chevron_right</span>
            </button>

            {/* District Selector Card */}
            <div className="p-3 rounded-xl border border-outline-variant/60 bg-white space-y-2 shadow-2xs text-left">
              <label className="block text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
                {t('reporting.location.selectDistrict')}
              </label>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input
                  type="text"
                  className="w-full bg-surface-container-low/60 border border-outline-variant/50 rounded-lg py-1.5 pl-8 pr-2.5 text-xs text-on-surface focus:outline-none focus:border-brand-violet focus:bg-white"
                  placeholder="Filter districts (e.g. Gumla, Ranchi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-1 pt-1 max-h-[110px] overflow-y-auto">
                {filteredDistricts.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => handleSelectDistrict(d.name)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                      selectedDistrict === d.name
                        ? 'bg-brand-indigo text-white border-brand-indigo font-bold shadow-2xs'
                        : 'bg-white text-brand-indigo border-outline-variant/60 hover:border-brand-violet hover:bg-surface-container-low'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Specific Locality & Privacy Note */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-outline-variant/60 bg-white space-y-2.5 shadow-2xs text-left h-full flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
                    {t('reporting.location.localityLabel')}
                  </label>
                  <span className="text-[9px] font-semibold text-outline bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/30">
                    Optional
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-tight">
                  {t('reporting.location.localitySub')}
                </p>
                <input
                  type="text"
                  className="w-full bg-surface-container-low/60 border border-outline-variant/50 rounded-lg py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-brand-violet focus:bg-white mt-1"
                  placeholder="e.g. Near Primary Health Centre, Basia Block"
                  value={locationLabel}
                  onChange={(e) => handleManualInput(e.target.value)}
                />
              </div>

              <div className="p-2 bg-surface-container-low/60 rounded-lg border border-outline-variant/40 text-[10px] text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-brand-teal text-sm shrink-0">shield</span>
                <span>{t('reporting.location.privacyNote')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 6. Primary Action CTA */}
        <div className="w-full max-w-[620px] mx-auto pt-1">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full bg-brand-indigo hover:bg-brand-violet text-white h-[48px] rounded-xl font-label-md font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005] active:scale-98"
          >
            <span>{t('reporting.location.continue')}</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

      </div>
    </main>
  );
}
