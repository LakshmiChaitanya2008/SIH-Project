import { translations } from '../src/lib/translations.js';

function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : undefined), obj);
}

const keysToTest = [
  'reporting.common.back',
  'reporting.voice.stepTag',
  'reporting.voice.title',
  'reporting.voice.subtitle',
  'reporting.voice.recordingLive',
  'reporting.voice.listening',
  'reporting.voice.stopBtn',
  'reporting.voice.tapToSpeak',
  'reporting.voice.idlePrompt',
  'reporting.voice.aiNote',
  'reporting.voice.aiSubNote',
  'reporting.voice.recordedSuccess',
  'reporting.voice.duration',
  'reporting.voice.rerecord',
  'reporting.voice.transcribedLabel',
  'reporting.voice.placeholder',
  'reporting.voice.continue',
  'reporting.voice.preferWriting',
];

['en', 'hi', 'te'].forEach((lang) => {
  console.log(`\n=== LANGUAGE: ${lang.toUpperCase()} ===`);
  keysToTest.forEach((key) => {
    const val = getNestedValue(translations[lang], key);
    if (!val) {
      console.error(`[MISSING KEY] ${key} in ${lang}`);
    } else {
      console.log(`${key} -> "${val}"`);
    }
  });
});
