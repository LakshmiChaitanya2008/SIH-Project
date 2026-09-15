import { translations } from '../src/lib/translations.js';

function t(keyPath, currentLang = 'en', params = {}) {
  if (!keyPath) return '';
  const keys = String(keyPath).split('.');
  
  let res = translations[currentLang];
  for (const k of keys) {
    if (res !== undefined && res !== null && (typeof res === 'object' || Array.isArray(res)) && k in res) {
      res = res[k];
    } else {
      res = undefined;
      break;
    }
  }

  if (res === undefined && currentLang !== 'en') {
    let fallbackRes = translations['en'];
    for (const k of keys) {
      if (fallbackRes !== undefined && fallbackRes !== null && (typeof fallbackRes === 'object' || Array.isArray(fallbackRes)) && k in fallbackRes) {
        fallbackRes = fallbackRes[k];
      } else {
        fallbackRes = undefined;
        break;
      }
    }
    res = fallbackRes;
  }

  if (res === undefined || res === null) {
    const parts = keyPath.split('.');
    const nonNumeric = parts.filter(p => !/^\d+$/.test(p));
    const lastPart = nonNumeric[nonNumeric.length - 1] || parts[parts.length - 1] || keyPath;
    res = lastPart.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase()).trim();
  }

  if (typeof res !== 'string') {
    return res;
  }

  let interpolated = res;
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((paramKey) => {
      const val = params[paramKey];
      if (val !== undefined && val !== null) {
        interpolated = interpolated
          .replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), val)
          .replace(new RegExp(`\\{${paramKey}\\}`, 'g'), val);
      }
    });
  }

  return interpolated;
}

console.log("en welcome:", t('citizen.dashboard.welcome', 'en', { name: 'Ramesh Sharma' }));
console.log("hi welcome:", t('citizen.dashboard.welcome', 'hi', { name: 'रमेश शर्मा' }));
console.log("te welcome:", t('citizen.dashboard.welcome', 'te', { name: 'రమేష్ శర్మ' }));

console.log("en recentActivities.0.title:", t('citizen.dashboard.recentActivities.0.title', 'en'));
console.log("hi recentActivities.0.title:", t('citizen.dashboard.recentActivities.0.title', 'hi'));
console.log("te recentActivities.0.title:", t('citizen.dashboard.recentActivities.0.title', 'te'));

console.log("en workflowSteps.0.title:", t('citizen.dashboard.workflowSteps.0.title', 'en'));
console.log("hi workflowSteps.0.title:", t('citizen.dashboard.workflowSteps.0.title', 'hi'));
console.log("te workflowSteps.0.title:", t('citizen.dashboard.workflowSteps.0.title', 'te'));

console.log("missing key test:", t('citizen.dashboard.someMissingKeyPath', 'en'));
