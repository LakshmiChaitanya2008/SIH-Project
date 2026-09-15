import { translations } from '../src/lib/translations.js';

function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : undefined), obj);
}

const keysToTest = [
  'reporting.method.stepTag',
  'reporting.method.eyebrow',
  'reporting.method.titleLine1',
  'reporting.method.titleLine2',
  'reporting.method.subtitle',
  'reporting.method.multilingualNotice',
  'reporting.method.reassurance',
  'reporting.method.steps.step1',
  'reporting.method.steps.step1Sub',
  'reporting.method.steps.step2',
  'reporting.method.steps.step2Sub',
  'reporting.method.steps.step3',
  'reporting.method.steps.step3Sub',
  'reporting.method.steps.step4',
  'reporting.method.steps.step4Sub',
  'reporting.method.steps.step5',
  'reporting.method.steps.step5Sub',
  'reporting.method.speak.tag',
  'reporting.method.speak.recommended',
  'reporting.method.speak.title',
  'reporting.method.speak.desc',
  'reporting.method.speak.btn',
  'reporting.method.write.prompt',
  'reporting.method.write.btn',
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
