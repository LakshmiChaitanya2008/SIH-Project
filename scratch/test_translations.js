import { translations } from '../src/lib/translations.js';

console.log('--- TESTING ENGLISH TRANSLATIONS ---');
console.log('nav.howItWorks:', translations.en?.nav?.howItWorks);
console.log('citizen.dashboard.tag:', translations.en?.citizen?.dashboard?.tag);
console.log('citizen.dashboard.welcome:', translations.en?.citizen?.dashboard?.welcome);
console.log('citizen.dashboard.subtitle:', translations.en?.citizen?.dashboard?.subtitle);
console.log('citizen.dashboard.summaryTitle:', translations.en?.citizen?.dashboard?.summaryTitle);
console.log('citizen.dashboard.reportsSubmitted:', translations.en?.citizen?.dashboard?.reportsSubmitted);
console.log('citizen.dashboard.personalLayerTag:', translations.en?.citizen?.dashboard?.personalLayerTag);
console.log('citizen.dashboard.activityTimelineTag:', translations.en?.citizen?.dashboard?.activityTimelineTag);

console.log('\n--- TESTING HINDI TRANSLATIONS ---');
console.log('nav.howItWorks:', translations.hi?.nav?.howItWorks);
console.log('citizen.dashboard.welcome:', translations.hi?.citizen?.dashboard?.welcome);

console.log('\n--- TESTING TELUGU TRANSLATIONS ---');
console.log('nav.howItWorks:', translations.te?.nav?.howItWorks);
console.log('citizen.dashboard.welcome:', translations.te?.citizen?.dashboard?.welcome);
