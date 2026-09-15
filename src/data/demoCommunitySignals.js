/**
 * Demo Community Signals - Seed Dataset for Pattern Detection
 */

export const demoCommunitySignals = [
  // WATER & HEALTH CLUSTER (4 Signals)
  {
    id: 'DEMO-SIG-101',
    title: 'Yellow Discolored Handpump Water',
    description: 'The water from our handpump has become yellow and leaves rust stain in buckets.',
    method: 'text',
    primaryDomain: 'Water Quality & Sanitation',
    relatedDomains: ['Community Health'],
    location: 'Gumla, Jharkhand',
    district: 'Gumla',
    affectedGroups: ['Families'],
    date: '2026-08-20',
    isDemo: true
  },
  {
    id: 'DEMO-SIG-102',
    title: 'Childhood Stomach Illness Post Water Consumption',
    description: 'Many children have stomach problems after drinking village water during early rains.',
    method: 'voice',
    primaryDomain: 'Water Quality & Sanitation',
    relatedDomains: ['Healthcare & Public Health'],
    location: 'Latehar, Jharkhand',
    district: 'Latehar',
    affectedGroups: ['Children'],
    date: '2026-08-22',
    isDemo: true
  },
  {
    id: 'DEMO-SIG-103',
    title: 'Drinking Water Chemical Smell',
    description: 'The drinking water smells strange during summer and rainy seasons.',
    method: 'text',
    primaryDomain: 'Water Quality & Sanitation',
    relatedDomains: ['Community Health'],
    location: 'Simdega, Jharkhand',
    district: 'Simdega',
    affectedGroups: ['Families', 'Children'],
    date: '2026-08-25',
    isDemo: true
  },
  {
    id: 'DEMO-SIG-104',
    title: 'Long Walk for Safe Drinking Water Source',
    description: 'We have to walk far because the nearby open water well is not safe for drinking.',
    method: 'voice',
    primaryDomain: 'Water Quality & Sanitation',
    relatedDomains: ['Water Access'],
    location: 'Gumla, Jharkhand',
    district: 'Gumla',
    affectedGroups: ['Women', 'Families'],
    date: '2026-08-27',
    isDemo: true
  },

  // AGRICULTURE CLUSTER (2 Signals)
  {
    id: 'DEMO-SIG-201',
    title: 'Monsoon Heavy Rain Crop Inundation',
    description: 'Heavy rainfall is damaging our crops every year due to inadequate field runoff channels.',
    method: 'text',
    primaryDomain: 'Agriculture & Irrigation',
    relatedDomains: ['Monsoon Soil Drainage'],
    location: 'Ranchi, Jharkhand',
    district: 'Ranchi',
    affectedGroups: ['Farmers'],
    date: '2026-08-24',
    isDemo: true
  },
  {
    id: 'DEMO-SIG-202',
    title: 'Unchecked Crop Disease Spreading',
    description: 'The crop disease spreads across neighboring farms before we know how to control it.',
    method: 'voice',
    primaryDomain: 'Agriculture & Irrigation',
    relatedDomains: ['Crop Protection'],
    location: 'Khunti, Jharkhand',
    district: 'Khunti',
    affectedGroups: ['Farmers'],
    date: '2026-08-26',
    isDemo: true
  },

  // ISOLATED SIGNAL (1 Signal)
  {
    id: 'DEMO-SIG-301',
    title: 'School Access Road Waterlogging',
    description: 'The road near our village school becomes unusable during monsoon for young children.',
    method: 'text',
    primaryDomain: 'Rural Infrastructure & Connectivity',
    relatedDomains: ['Public Access'],
    location: 'West Singhbhum, Jharkhand',
    district: 'West Singhbhum',
    affectedGroups: ['Students', 'Local Residents'],
    date: '2026-08-29',
    isDemo: true
  }
];
