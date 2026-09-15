import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { updateReportDraft, setLanguage } from '../features/app/appSlice';
import { evidenceStore } from '../lib/evidenceStore';
import { api } from '../lib/api';
import { useTranslation } from '../lib/useTranslation';

const LANGUAGE_CONFIG = {
  hi: { label: 'हिन्दी', fullName: 'हिन्दी (Hindi)', code: 'hi-IN' },
  en: { label: 'English', fullName: 'English (India)', code: 'en-IN' },
  te: { label: 'తెలుగు', fullName: 'తెలుగు (Telugu)', code: 'te-IN' },
};

function getSupportedMimeType() {
  if (typeof window === 'undefined' || !window.MediaRecorder) return '';
  const candidateTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/wav'
  ];
  return candidateTypes.find(t => MediaRecorder.isTypeSupported(t)) || '';
}

export default function VoiceReportView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const reportDraft = useSelector((state) => state.app.reportDraft);
  const selectedLanguage = useSelector((state) => state.app.selectedLanguage) || 'hi';

  // State
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(reportDraft.voiceRecorded || false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState(reportDraft.voiceTranscript || reportDraft.description || '');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState(reportDraft.voiceAudioUrl || null);
  const [audioDuration, setAudioDuration] = useState(reportDraft.voiceDuration || '00:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState(null);
  const [audioLevels, setAudioLevels] = useState([15, 25, 40, 60, 50, 35, 20, 10]);

  // References
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioElementRef = useRef(null);

  // Active Language Code
  const activeLangCode = LANGUAGE_CONFIG[selectedLanguage]?.code || 'hi-IN';

  // 5-step journey state for Voice page (Step 1 = completed, Step 2 = active)
  const steps = [
    { num: '1', key: 'step1', icon: 'check', titleKey: 'step1', subKey: 'step1Sub', active: false, completed: true },
    { num: '2', key: 'step2', icon: 'mic', titleKey: 'step2Voice', subKey: 'step2VoiceSub', active: true, completed: false },
    { num: '3', key: 'step3', icon: 'photo_camera', titleKey: 'step2', subKey: 'step2Sub', active: false, completed: false },
    { num: '4', key: 'step4', icon: 'location_on', titleKey: 'step3', subKey: 'step3Sub', active: false, completed: false },
    { num: '5', key: 'step5', icon: 'fact_check', titleKey: 'step4', subKey: 'step4Sub', active: false, completed: false }
  ];

  // Format seconds to MM:SS
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Audio Frequency Visualizer Loop
  const startAudioVisualizer = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateBars = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const sampled = [
          Math.max(15, Math.round((dataArray[1] / 255) * 100)),
          Math.max(20, Math.round((dataArray[3] / 255) * 100)),
          Math.max(25, Math.round((dataArray[5] / 255) * 100)),
          Math.max(30, Math.round((dataArray[7] / 255) * 100)),
          Math.max(25, Math.round((dataArray[9] / 255) * 100)),
          Math.max(20, Math.round((dataArray[11] / 255) * 100)),
          Math.max(18, Math.round((dataArray[13] / 255) * 100)),
          Math.max(12, Math.round((dataArray[15] / 255) * 100)),
        ];
        setAudioLevels(sampled);
        animationFrameRef.current = requestAnimationFrame(updateBars);
      };

      updateBars();
    } catch (e) {
      console.warn('[AudioContext] Could not initialize live frequency visualizer:', e.message);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
  };

  // 2. Web Speech API Initialization
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[Web Speech API] SpeechRecognition not natively supported in browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = activeLangCode;
      recognition.maxAlternatives = 1;

      let localAccumulated = transcript;

      recognition.onresult = (event) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += trans + ' ';
          } else {
            interim += trans;
          }
        }

        if (finalChunk) {
          localAccumulated = (localAccumulated + ' ' + finalChunk).trim();
          setTranscript(localAccumulated);
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event) => {
        console.warn('[SpeechRecognition Error]:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Microphone access was blocked. Please grant microphone permission in your browser settings.');
        }
      };

      recognition.onend = () => {
        if (isRecording && recognitionRef.current) {
          try {
            recognition.start();
          } catch (e) { }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('[SpeechRecognition Start Error]:', err.message);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
    }
    setInterimTranscript('');
  };

  // 3. Start Recording
  const handleStartRecording = async () => {
    setMicError(null);
    setTranscript('');
    setInterimTranscript('');
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mime = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mime });
        const localUrl = URL.createObjectURL(audioBlob);
        const voiceId = `voice_${Date.now()}`;
        const formattedDur = formatTime(recordingSeconds || 1);

        evidenceStore.addFile(voiceId, audioBlob);

        setAudioUrl(localUrl);
        setAudioDuration(formattedDur);
        setIsRecorded(true);
        setIsRecording(false);

        let finalTranscript = transcript.trim();
        if (!finalTranscript && audioBlob.size > 1000) {
          setIsTranscribing(true);
          try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Audio = reader.result;
              try {
                const res = await api.transcribe({
                  audioBase64: base64Audio,
                  mimeType: mime,
                  language: selectedLanguage,
                });
                if (res?.text) {
                  finalTranscript = res.text;
                  setTranscript(res.text);
                }
              } catch (transcribeErr) {
                console.warn('[Whisper Fallback Error]:', transcribeErr.message);
              } finally {
                setIsTranscribing(false);
                syncToRedux(voiceId, localUrl, formattedDur, finalTranscript);
              }
            };
          } catch (e) {
            setIsTranscribing(false);
            syncToRedux(voiceId, localUrl, formattedDur, finalTranscript);
          }
        } else {
          syncToRedux(voiceId, localUrl, formattedDur, finalTranscript);
        }

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      startAudioVisualizer(stream);
      startSpeechRecognition();

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 120) {
            handleStopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('[Microphone Permission Exception]:', err);
      setMicError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser to record your problem.'
          : `Microphone error: ${err.message || 'Device unavailable'}`
      );
      setIsRecording(false);
    }
  };

  // 4. Stop Recording
  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopAudioVisualizer();
    stopSpeechRecognition();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const syncToRedux = (voiceId, url, durationStr, transcriptText) => {
    dispatch(
      updateReportDraft({
        method: 'voice',
        voiceRecorded: true,
        voiceAudioId: voiceId,
        voiceAudioUrl: url,
        voiceDuration: durationStr,
        voiceTranscript: transcriptText,
        description: transcriptText || `Voice recording (${durationStr})`,
      })
    );
  };

  const handleRecordAgain = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsRecorded(false);
    setIsRecording(false);
    setTranscript('');
    setInterimTranscript('');
    setRecordingSeconds(0);
    dispatch(
      updateReportDraft({
        voiceRecorded: false,
        voiceAudioId: null,
        voiceAudioUrl: null,
        voiceDuration: '00:00',
        voiceTranscript: '',
      })
    );
  };

  const handleTogglePlay = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleContinue = () => {
    dispatch(
      updateReportDraft({
        method: 'voice',
        voiceRecorded: true,
        voiceTranscript: transcript,
        description: transcript.trim() || `Voice recording (${audioDuration})`,
      })
    );
    navigate('/citizen/report/evidence');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAudioVisualizer();
      stopSpeechRecognition();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <main className="flex-grow py-3 sm:py-4 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-between relative text-on-surface">
      
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-start space-y-3">

        {/* 1. Header: Back Navigation & Step Indicator Tag */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => navigate('/citizen/report/method')}
            disabled={isRecording}
            className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-violet font-label-md text-xs font-semibold transition-colors group disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 rounded-md py-0.5 px-1"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
            <span>{t('reporting.common.back')}</span>
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-brand-violet uppercase bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            {t('reporting.method.stepTag')}
          </span>
        </div>

        {/* 2. Compact 5-Milestone Journey Line */}
        <div className="w-full py-1.5 border-b border-outline-variant/30 min-h-[75px]">
          <div className="relative w-full">
            {/* Background Line */}
            <div className="absolute top-4 left-[6%] right-[6%] h-0.5 bg-outline-variant/40 -translate-y-1/2 z-0 hidden sm:block" />
            
            {/* Active Step Line (Starting at Step 1) */}
            <div className="absolute top-4 left-[6%] w-[8%] h-0.5 bg-brand-indigo -translate-y-1/2 z-0 hidden sm:block" />

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
            {t('reporting.voice.stepTag')}
          </span>

          <h1 className="font-display-lg text-[#1E1B4B] text-xl sm:text-2xl font-extrabold tracking-tight">
            {t('reporting.voice.title')}
          </h1>

          <p className="font-body-md text-on-surface-variant text-xs font-medium leading-normal max-w-md mx-auto">
            {t('reporting.voice.subtitle')}
          </p>
        </div>

        {/* 4. Compact Voice Interaction Area (520–560px Wide) */}
        <div className="w-full max-w-[540px] mx-auto text-center space-y-3">
          
          {/* 3-Segmented Language Selector */}
          <div className="inline-flex items-center justify-center p-0.5 bg-surface-container-low rounded-full border border-outline-variant/50 shadow-2xs">
            {Object.entries(LANGUAGE_CONFIG).map(([langKey, config]) => (
              <button
                key={langKey}
                type="button"
                disabled={isRecording}
                onClick={() => dispatch(setLanguage(langKey))}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedLanguage === langKey
                    ? 'bg-brand-indigo text-white shadow-xs'
                    : 'text-brand-indigo hover:bg-brand-violet/5'
                } disabled:opacity-50`}
              >
                {config.label}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {micError && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-2 text-left">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{micError}</span>
            </div>
          )}

          {/* Voice Capture State */}
          {!isRecorded ? (
            <div className="my-2 flex flex-col items-center justify-center space-y-3">
              {isRecording ? (
                /* LIVE RECORDING STATE */
                <div className="w-full bg-surface-container-low p-4 rounded-2xl border-2 border-brand-violet/40 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-violet">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                      <span className="text-red-700 uppercase tracking-wider font-extrabold text-[11px]">{t('reporting.voice.recordingLive')}</span>
                    </span>
                    <span className="font-mono text-xs bg-white px-2.5 py-0.5 rounded-full border border-outline-variant/40 text-brand-indigo">
                      {formatTime(recordingSeconds)}
                    </span>
                  </div>

                  <div className="flex items-end justify-center gap-1.5 h-12 py-1 bg-white/60 rounded-xl border border-outline-variant/20 px-3">
                    {audioLevels.map((height, i) => (
                      <span
                        key={i}
                        className="w-2 bg-gradient-to-t from-brand-indigo to-brand-violet rounded-full transition-all duration-75"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-outline-variant/40 min-h-[48px] text-left text-xs">
                    <span className="text-[9px] font-bold text-brand-teal uppercase tracking-widest block mb-0.5">
                      LIVE TRANSCRIPT STREAM ({activeLangCode})
                    </span>
                    <p className="text-on-surface font-medium leading-snug italic text-xs">
                      {transcript || interimTranscript ? (
                        <>
                          <span>{transcript}</span>{' '}
                          <span className="text-brand-violet font-semibold opacity-75">{interimTranscript}</span>
                        </>
                      ) : (
                        <span className="text-on-surface-variant/60">{t('reporting.voice.listening')}</span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.005] active:scale-98"
                  >
                    <span className="material-symbols-outlined text-base">stop_circle</span>
                    <span>{t('reporting.voice.stopBtn')}</span>
                  </button>
                </div>
              ) : (
                /* IDLE STATE: CIRCULAR MICROPHONE CONTROL */
                <div className="space-y-3 flex flex-col items-center py-2">
                  <div className="w-24 h-24 rounded-full border-4 border-brand-violet/15 bg-brand-violet/5 flex items-center justify-center p-1.5 hover:border-brand-violet/30 transition-all">
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="w-18 h-18 rounded-full bg-brand-indigo text-white shadow-md hover:bg-brand-violet hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer group"
                    >
                      <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">mic</span>
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-brand-indigo block uppercase tracking-wider">
                      {t('reporting.voice.tapToSpeak')}
                    </span>
                    <p className="font-body-md text-on-surface-variant text-xs font-medium max-w-xs">
                      {t('reporting.voice.idlePrompt')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* RECORDED RESULT STATE (COMPACT PANEL: TARGET HEIGHT ~380-420px) */
            <div className="w-full bg-surface-container-low p-4.5 rounded-2xl border border-outline-variant/60 space-y-3 animate-in fade-in duration-300 shadow-2xs">
              
              {/* Header Status Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-brand-teal font-bold text-xs">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{t('reporting.voice.recordedSuccess')}</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-brand-indigo bg-white px-2.5 py-0.5 rounded-full border border-outline-variant/40">
                  {t('reporting.voice.duration')} {audioDuration}
                </span>
              </div>

              {audioUrl && (
                <audio
                  ref={audioElementRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}

              {/* Audio Waveform & Player Row */}
              <div className="p-3 bg-white rounded-xl border border-outline-variant/40 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-10 h-10 rounded-full bg-brand-indigo hover:bg-brand-violet text-white flex items-center justify-center shadow-2xs cursor-pointer shrink-0 transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <div className="flex-1 flex items-center justify-center gap-1 h-8 py-0.5 overflow-hidden">
                  {[40, 65, 80, 50, 90, 75, 45, 60, 85, 70, 55, 90, 40, 60, 30].map((h, idx) => (
                    <span
                      key={idx}
                      className={`w-1 rounded-full transition-all ${
                        isPlaying ? 'bg-brand-violet animate-pulse' : 'bg-brand-indigo/40'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRecordAgain}
                  className="px-2.5 py-1.5 rounded-lg border border-outline-variant/60 text-on-surface-variant hover:text-error hover:border-error/40 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-xs">refresh</span>
                  <span>{t('reporting.voice.rerecord')}</span>
                </button>
              </div>

              {/* Transcribed Message Section */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-brand-violet">edit_note</span>
                    <span>{t('reporting.voice.transcribedLabel')}</span>
                  </label>
                  {isTranscribing && (
                    <span className="text-[10px] text-brand-violet font-semibold animate-pulse flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                      AI Whisper transcribing...
                    </span>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={t('reporting.voice.placeholder')}
                  className="w-full h-20 p-2.5 bg-white rounded-xl border border-outline-variant/70 text-xs sm:text-sm text-on-surface leading-relaxed focus:outline-none focus:border-brand-violet shadow-2xs resize-none"
                />
              </div>

              {/* Primary Action Button (Target Height ~48-52px) */}
              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-brand-indigo hover:bg-brand-violet text-white h-[48px] rounded-xl font-label-md font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005] active:scale-98"
              >
                <span>{t('reporting.voice.continue')}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          )}

          {/* 5. Intelligent AI Reassurance & Secondary Writing Link (Positioned Below Voice Panel) */}
          <div className="space-y-2 pt-1">
            <div className="text-[10px] text-on-surface-variant font-medium bg-surface-container-low/60 border border-outline-variant/40 rounded-lg p-2 max-w-sm mx-auto space-y-0.5">
              <p className="font-semibold text-brand-indigo text-[10px]">
                💡 {t('reporting.voice.aiNote')}
              </p>
              <p className="text-[9px] text-outline">
                {t('reporting.voice.aiSubNote')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/citizen/report/text')}
              className="text-brand-violet font-semibold hover:underline text-[11px] inline-flex items-center gap-1 cursor-pointer py-0.5"
            >
              <span>{t('reporting.voice.preferWriting')}</span>
              <span className="material-symbols-outlined text-xs">edit_note</span>
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
