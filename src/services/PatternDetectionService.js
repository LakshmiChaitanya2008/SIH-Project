/**
 * Pattern Detection Service - Multi-Signal Pattern Clustering Engine
 * 
 * Groups confirmed community observations into shared regional patterns.
 */

export const PatternDetectionService = {
  /**
   * Examines array of signals and clusters them into community patterns.
   * @param {Array} signals - Array of combined user and demo signals
   * @returns {Array} List of detected community patterns
   */
  detectPatterns(signals = []) {
    const patterns = [];
    const domainClusters = {};

    // Group signals by primary domain
    signals.forEach(sig => {
      const domain = sig.understanding?.primaryDomain || sig.primaryDomain || 'General Community Concern';
      if (!domainClusters[domain]) {
        domainClusters[domain] = [];
      }
      domainClusters[domain].push(sig);
    });

    let patternIdx = 1;

    Object.keys(domainClusters).forEach(domain => {
      const clusterSignals = domainClusters[domain];
      const count = clusterSignals.length;

      // Extract unique locations & affected groups
      const locations = Array.from(new Set(clusterSignals.map(s => {
        const loc = s.location?.label || s.location || 'Jharkhand';
        return loc.split(',')[0].trim();
      })));

      const affectedGroups = Array.from(new Set(clusterSignals.flatMap(s => s.affectedGroups || ['Local Community'])));

      let status = 'Individual signal';
      if (count >= 3) {
        status = 'Emerging pattern';
      } else if (count === 2) {
        status = 'Similar signals detected';
      }

      let title = `${domain} Issue`;
      let summary = `Single community observation logged in ${locations.join(', ')}.`;

      if (domain.includes('Water')) {
        title = 'Water Quality & Public Health Concern';
        summary = 'Multiple community observations indicate recurring concerns related to drinking water quality, discoloration, and potential health impacts.';
      } else if (domain.includes('Agriculture')) {
        title = 'Crop Damage & Early Warning System';
        summary = 'Related observations from agricultural workers regarding seasonal monsoon field inundation and crop disease spread.';
      } else if (domain.includes('Infrastructure')) {
        title = 'Monsoon Road & Bridge Accessibility';
        summary = 'Community observations regarding seasonal road damage and rural connectivity limitations during rainfall.';
      }

      patterns.push({
        id: `PATTERN-00${patternIdx++}`,
        title,
        primaryDomain: domain,
        relatedDomains: clusterSignals[0]?.relatedDomains || ['Public Health'],
        signalIds: clusterSignals.map(s => s.id),
        signals: clusterSignals,
        signalCount: count,
        locations,
        affectedGroups,
        summary,
        status,
        createdAt: new Date().toISOString()
      });
    });

    // Sort patterns by signal count descending
    return patterns.sort((a, b) => b.signalCount - a.signalCount);
  }
};
