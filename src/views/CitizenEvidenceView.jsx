import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { addEvidence, removeEvidence, updateEvidenceCaption } from '../features/app/appSlice';
import { evidenceStore } from '../lib/evidenceStore';
import { useTranslation } from '../lib/useTranslation';

export default function CitizenEvidenceView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const evidenceList = useSelector((state) => state.app.reportDraft.evidence) || [];
  const method = useSelector((state) => state.app.reportDraft.method);
  const voiceRecorded = useSelector((state) => state.app.reportDraft.voiceRecorded);
  const backRoute = (method === 'voice' || voiceRecorded) ? '/citizen/report/voice' : '/citizen/report/text';

  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_FILES = 3;

  const steps = [
    { num: '1', key: 'step1', icon: 'check', titleKey: 'step1', subKey: 'step1Sub', active: false, completed: true },
    { num: '2', key: 'step2', icon: 'photo_camera', titleKey: 'step2', subKey: 'step2Sub', active: true, completed: false },
    { num: '3', key: 'step3', icon: 'location_on', titleKey: 'step3', subKey: 'step3Sub', active: false, completed: false },
    { num: '4', key: 'step4', icon: 'fact_check', titleKey: 'step4', subKey: 'step4Sub', active: false, completed: false },
    { num: '5', key: 'step5', icon: 'task_alt', titleKey: 'step5', subKey: 'step5Sub', active: false, completed: false }
  ];

  const handleFileSelect = () => {
    if (evidenceList.length >= MAX_FILES) {
      setError(`You can add up to ${MAX_FILES} photos or files per report.`);
      return;
    }
    setError('');
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      if (evidenceList.length >= MAX_FILES) {
        setError(`Maximum of ${MAX_FILES} files allowed.`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds the 5MB file size limit.`);
        continue;
      }

      const fileId = `ev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      const type = file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : 'document';

      evidenceStore.addFile(fileId, file);

      dispatch(addEvidence({
        id: fileId,
        name: file.name,
        size: file.size,
        type,
        previewUrl,
        caption: '',
      }));
    }

    e.target.value = '';
  };

  const handleRemove = (index, fileId) => {
    evidenceStore.removeFile(fileId);
    dispatch(removeEvidence(index));
  };

  return (
    <main className="flex-grow py-3 sm:py-4 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-between relative text-on-surface">
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-start space-y-3">

        {/* 1. Header: Back Navigation & Step Tag */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => navigate(backRoute)}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-semibold transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-0.5 px-1"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
            <span>{t('reporting.common.back')}</span>
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-brand-violet uppercase bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            {t('reporting.evidence.stepTag')}
          </span>
        </div>

        {/* 2. Compact 5-Milestone Journey Line */}
        <div className="w-full py-1.5 border-b border-outline-variant/30 min-h-[75px]">
          <div className="relative w-full">
            {/* Background Line */}
            <div className="absolute top-4 left-[6%] right-[6%] h-0.5 bg-outline-variant/40 -translate-y-1/2 z-0 hidden sm:block" />
            
            {/* Active Step Line (Step 1 to Step 2) */}
            <div className="absolute top-4 left-[6%] w-[28%] h-0.5 bg-brand-indigo -translate-y-1/2 z-0 hidden sm:block" />

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
            {t('reporting.evidence.eyebrow')}
          </span>

          <h1 className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold tracking-tight">
            {t('reporting.evidence.title')}
          </h1>

          <p className="font-body-md text-on-surface-variant text-xs font-medium leading-normal max-w-md mx-auto">
            {t('reporting.evidence.subtitle')}
          </p>

          <p className="text-[10px] text-outline font-medium italic pt-0.5">
            {t('reporting.evidence.optionalNote')}
          </p>
        </div>

        {/* 4. Open Evidence Workspace (Max width 580px) */}
        <div className="w-full max-w-[580px] mx-auto space-y-3">

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,.pdf,.doc,.docx"
            multiple
            onChange={handleFileChange}
          />

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* 3 Evidence Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <button
              type="button"
              onClick={handleFileSelect}
              disabled={evidenceList.length >= MAX_FILES}
              className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/60 hover:border-brand-indigo hover:bg-white hover:shadow-xs hover:-translate-y-0.5 transition-all flex flex-col items-center text-center group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <div className="w-10 h-10 rounded-full bg-white text-brand-indigo flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-2xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </div>
              <span className="font-bold text-brand-indigo text-xs sm:text-sm mb-0.5 leading-tight">{t('reporting.evidence.addPhoto')}</span>
              <span className="text-[10px] text-on-surface-variant leading-tight">{t('reporting.evidence.addPhotoSub')}</span>
            </button>

            <button
              type="button"
              onClick={handleFileSelect}
              disabled={evidenceList.length >= MAX_FILES}
              className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/60 hover:border-brand-indigo hover:bg-white hover:shadow-xs hover:-translate-y-0.5 transition-all flex flex-col items-center text-center group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <div className="w-10 h-10 rounded-full bg-white text-brand-violet flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-2xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
              </div>
              <span className="font-bold text-brand-indigo text-xs sm:text-sm mb-0.5 leading-tight">{t('reporting.evidence.chooseGallery')}</span>
              <span className="text-[10px] text-on-surface-variant leading-tight">{t('reporting.evidence.chooseGallerySub')}</span>
            </button>

            <button
              type="button"
              onClick={handleFileSelect}
              disabled={evidenceList.length >= MAX_FILES}
              className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/60 hover:border-brand-indigo hover:bg-white hover:shadow-xs hover:-translate-y-0.5 transition-all flex flex-col items-center text-center group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <div className="w-10 h-10 rounded-full bg-white text-brand-teal flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-2xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-xl">attach_file</span>
              </div>
              <span className="font-bold text-brand-indigo text-xs sm:text-sm mb-0.5 leading-tight">{t('reporting.evidence.addDocument')}</span>
              <span className="text-[10px] text-on-surface-variant leading-tight">{t('reporting.evidence.addDocumentSub')}</span>
            </button>

          </div>

          {/* Evidence Files Area (Inline Empty State vs Uploaded File Cards) */}
          <div className="space-y-2">
            {evidenceList.length > 0 ? (
              evidenceList.map((item, idx) => (
                <div key={item.id || idx} className="p-3 rounded-xl border border-outline-variant/60 bg-white flex items-center gap-3 justify-between shadow-2xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-center text-brand-indigo shrink-0 overflow-hidden">
                    {item.previewUrl ? (
                      <img src={item.previewUrl} className="w-full h-full object-cover" alt={item.name} />
                    ) : (
                      <span className="material-symbols-outlined text-lg">{item.type === 'video' ? 'movie' : 'description'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-bold text-brand-indigo text-xs truncate">{item.name}</div>
                    <input
                      type="text"
                      className="mt-0.5 w-full bg-surface-container-low/60 border border-outline-variant/40 rounded-md px-2 py-0.5 text-xs text-on-surface focus:outline-none focus:border-brand-violet focus:bg-white"
                      placeholder={t('reporting.evidence.captionPlaceholder')}
                      value={item.caption || ''}
                      onChange={(e) => dispatch(updateEvidenceCaption({ index: idx, caption: e.target.value }))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx, item.id)}
                    className="text-outline hover:text-error transition-colors p-1 cursor-pointer shrink-0 ml-1"
                    title="Remove file"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-3.5 bg-surface-container-low/50 border border-dashed border-outline-variant/60 rounded-xl text-center space-y-0.5">
                <span className="text-xs font-semibold text-on-surface-variant block">
                  {t('reporting.evidence.noFilesTitle')}
                </span>
                <span className="text-[10px] text-outline block">
                  {t('reporting.evidence.noFilesSub')}
                </span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate('/citizen/report/location')}
              className="w-full bg-brand-indigo hover:bg-brand-violet text-white h-[48px] rounded-xl font-label-md font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005] active:scale-98"
            >
              <span>{t('reporting.evidence.continue')}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/citizen/report/location')}
              className="text-on-surface-variant hover:text-brand-indigo font-semibold text-xs py-1 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>{t('reporting.evidence.skip')}</span>
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
