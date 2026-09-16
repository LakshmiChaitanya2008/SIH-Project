import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { updateReportDraft } from '../features/app/appSlice';
import { getCurrentGPSLocation } from '../lib/geo';
import { useTranslation } from '../lib/useTranslation';

export default function CitizenLocationView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const reportDraft = useSelector((state) => state.app.reportDraft);
  const currentLocation = reportDraft?.location || null;
  const canonicalId = reportDraft?.reportId || reportDraft?.id || 'SS-2026-00401';

  // State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [locationData, setLocationData] = useState(() => {
    if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
      return {
        label: currentLocation.label,
        locality: currentLocation.locality,
        district: currentLocation.district,
        state: currentLocation.state,
        country: currentLocation.country || 'India',
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        accuracy: currentLocation.accuracy,
        timestamp: currentLocation.timestamp || new Date().toISOString(),
        rawAddress: currentLocation.rawAddress || currentLocation.label,
        method: currentLocation.method || 'demo_gps',
        is_mock_location: currentLocation.is_mock_location !== false,
      };
    }
    return null;
  });

  const steps = [
    { num: '1', key: 'step1', icon: 'check', titleKey: 'step1', subKey: 'step1Sub', active: false, completed: true },
    { num: '2', key: 'step2', icon: 'check', titleKey: 'step2', subKey: 'step2Sub', active: false, completed: true },
    { num: '3', key: 'step3', icon: 'location_on', titleKey: 'step3', subKey: 'step3Sub', active: true, completed: false },
    { num: '4', key: 'step4', icon: 'fact_check', titleKey: 'step4', subKey: 'step4Sub', active: false, completed: false },
    { num: '5', key: 'step5', icon: 'task_alt', titleKey: 'step5', subKey: 'step5Sub', active: false, completed: false }
  ];

  const handleGPSLocation = async () => {
    // Clear stale captured state before detecting
    setLocationData(null);
    setGpsError('');
    setGpsLoading(true);

    try {
      // Simulate realistic ~1000ms detection sequence
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const loc = await getCurrentGPSLocation();

      const newLocData = {
        label: loc.label,
        locality: loc.locality || 'Kanuru, Vijayawada',
        district: loc.district || 'NTR District',
        state: loc.state || 'Andhra Pradesh',
        country: loc.country || 'India',
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        timestamp: loc.timestamp,
        captured_at: loc.captured_at || loc.timestamp,
        rawAddress: loc.rawAddress || loc.label,
        method: loc.method || (loc.is_mock_location ? 'demo_gps' : 'gps'),
        is_mock_location: loc.is_mock_location !== false,
        reportId: canonicalId,
      };

      setLocationData(newLocData);
      setGpsError('');
      dispatch(updateReportDraft({
        location: newLocData
      }));
    } catch (err) {
      let errorMsg = err.message || 'Unable to detect location. Click "Use My Current Location" to try again.';
      if (err.message && err.message.toLowerCase().includes('denied')) {
        errorMsg = 'Location permission was denied. Click Try Again to retry.';
      }
      setGpsError(errorMsg);
      setLocationData(null);
    } finally {
      setGpsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!locationData || !locationData.latitude) {
      setGpsError('Location is required to proceed. Click "Use My Current Location".');
      return;
    }

    dispatch(updateReportDraft({
      location: {
        ...locationData,
        reportId: canonicalId,
      }
    }));
    navigate('/citizen/report/final-review');
  };

  return (
    <main className="flex-grow py-3 sm:py-4 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-between relative text-on-surface">
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-start space-y-4">

        {/* 1. Header: Back Navigation & Step Tag */}
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/citizen/report/evidence')}
            disabled={gpsLoading}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-semibold transition-colors group cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-0.5 px-1"
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
            <div className="absolute top-4 left-[6%] right-[6%] h-0.5 bg-outline-variant/40 -translate-y-1/2 z-0 hidden sm:block" />
            <div className="absolute top-4 left-[6%] w-[50%] h-0.5 bg-brand-indigo -translate-y-1/2 z-0 hidden sm:block" />

            <div className="relative z-10 flex items-start justify-between">
              {steps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center group max-w-[120px] w-full">
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
                      <div className="w-8 h-8 rounded-full bg-white text-outline border border-outline-variant/60 flex items-center justify-center transition-all duration-200">
                        <span className="material-symbols-outlined text-base text-outline/60">{step.icon}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <span className={`text-[11px] font-bold leading-tight ${
                      step.active ? 'text-brand-indigo font-bold' : step.completed ? 'text-brand-teal font-semibold' : 'text-on-surface-variant/80 font-semibold'
                    }`}>
                      {t(`reporting.method.steps.${step.titleKey}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Page Intro Section */}
        <div className="text-center max-w-xl mx-auto space-y-1 py-1">
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest block">
            LOCATION CONFIRMATION
          </span>

          <h1 className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold tracking-tight">
            Confirm Location
          </h1>

          <p className="font-body-md text-on-surface-variant text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
            Use your device's current location. Location is captured automatically and cannot be entered manually.
          </p>
        </div>

        {/* 4. Main State Container */}
        <div className="w-full max-w-[540px] mx-auto space-y-4">
          
          {/* STATE 2: DETECTING LOCATION (~1 Sec Detection Sequence) */}
          {gpsLoading && (
            <div className="p-8 rounded-2xl bg-white border border-brand-violet/30 shadow-md text-center space-y-3.5">
              <div className="w-14 h-14 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto ring-4 ring-brand-violet/10">
                <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#1E1B4B]">Detecting your location...</h3>
                <p className="text-xs font-medium text-slate-500">Getting your current location</p>
              </div>
            </div>
          )}

          {/* STATE 3: CAPTURED STATE */}
          {!gpsLoading && locationData && (
            <div className="p-6 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
                  <span className="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
                  <span>✓ Location Captured</span>
                </div>
                <span className="text-[10px] font-mono text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-200/80 font-bold uppercase tracking-wider">
                  DEMO LOCATION
                </span>
              </div>

              {/* Location Hierarchy */}
              <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200/70 space-y-1">
                <div className="text-lg font-extrabold text-[#1E1B4B]">
                  {locationData.locality || 'Kanuru, Vijayawada'}
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  {locationData.district || 'NTR District'}, {locationData.state || 'Andhra Pradesh'}
                </div>
              </div>

              {/* Exact Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs text-slate-800 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-[9px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Latitude</span>
                  <span className="font-extrabold text-slate-900">{locationData.latitude}° N</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Longitude</span>
                  <span className="font-extrabold text-slate-900">{locationData.longitude}° E</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Accuracy</span>
                  <span className="font-extrabold text-purple-800">Demo / Simulated</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Source</span>
                  <span className="font-extrabold text-purple-800">Demo GPS Location</span>
                </div>
              </div>

              {/* Re-confirm Action Link */}
              <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={handleGPSLocation}
                  className="text-xs font-bold text-brand-indigo hover:text-brand-violet flex items-center gap-1.5 cursor-pointer py-1 group"
                >
                  <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform duration-300">refresh</span>
                  <span>Re-confirm Demo Location</span>
                </button>
                <span className="text-[10px] font-mono text-slate-400">Ref: {canonicalId.slice(0, 18)}</span>
              </div>
            </div>
          )}

          {/* STATE 1: BEFORE LOCATION (Initial State — Idle) */}
          {!gpsLoading && !locationData && (
            <button
              type="button"
              onClick={handleGPSLocation}
              className="w-full p-8 rounded-2xl border-2 border-brand-indigo bg-white hover:bg-brand-indigo/5 transition-all text-center flex flex-col items-center justify-center gap-3.5 cursor-pointer shadow-md group"
            >
              <div className="w-16 h-16 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">my_location</span>
              </div>
              <div>
                <div className="font-extrabold text-brand-indigo text-lg">
                  Use My Current Location
                </div>
                <div className="text-xs text-on-surface-variant mt-1 font-medium">
                  Click to capture device location automatically
                </div>
              </div>
            </button>
          )}

          {/* Error Alert (if any) */}
          {!gpsLoading && gpsError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 text-left">
              <span className="material-symbols-outlined text-base shrink-0">info</span>
              <span>{gpsError}</span>
            </div>
          )}

        </div>

        {/* STATE 4: READY TO CONTINUE (Primary Action CTA) */}
        <div className="w-full max-w-[540px] mx-auto pt-2">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!locationData || !locationData.latitude || gpsLoading}
            className={`w-full h-[48px] rounded-xl font-label-md font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              locationData && locationData.latitude && !gpsLoading
                ? 'bg-brand-indigo hover:bg-brand-violet text-white hover:scale-[1.005] active:scale-98'
                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{locationData ? 'Continue to Review →' : 'Location Required to Continue'}</span>
          </button>
        </div>

      </div>
    </main>
  );
}
