export function computeCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0
  const len = Math.min(vecA.length, vecB.length)
  let dot = 0
  let normASq = 0
  let normBSq = 0

  for (let i = 0; i < len; i++) {
    const a = vecA[i]
    const b = vecB[i]
    dot += a * b
    normASq += a * a
    normBSq += b * b
  }

  if (normASq === 0 || normBSq === 0) return 0
  return dot / (Math.sqrt(normASq) * Math.sqrt(normBSq))
}

export function calculateEmergenceScore(cluster) {
  const members = cluster.members || []
  const N = members.length || cluster.problem_count || 1

  // 1. Volume Factor (S_count)
  const S_count = Math.min(1.0, Math.log(1 + N) / Math.log(1 + 10))

  // 2. Severity Factor (S_severity)
  const avgSeverity = cluster.avg_severity || 5.0
  const S_severity = Math.min(1.0, avgSeverity / 10.0)

  // 3. Composite score
  const score = Math.min(100, Math.max(10, Math.round(100 * (0.4 * S_count + 0.35 * S_severity + 0.25 * 0.85))))
  return score
}

export function clusterSubmissions(submissions, threshold = 0.75, minSize = 2) {
  const clusters = []
  const visited = new Set()

  for (let i = 0; i < submissions.length; i++) {
    if (visited.has(submissions[i].id)) continue

    const root = submissions[i]
    const group = [root]

    for (let j = 0; j < submissions.length; j++) {
      if (i === j || visited.has(submissions[j].id)) continue
      const candidate = submissions[j]

      const sameDomain = (root.primary_domain || '').toUpperCase() === (candidate.primary_domain || '').toUpperCase()
      const sameDistrict = (root.district || '').toLowerCase() === (candidate.district || '').toLowerCase()

      if (sameDomain || sameDistrict) {
        group.push(candidate)
      }
    }

    if (group.length >= minSize) {
      group.forEach(s => visited.add(s.id))
      const avgSev = group.reduce((sum, s) => sum + (s.severity_score || 5.0), 0) / group.length
      const domain = root.primary_domain || 'WATER QUALITY & SANITATION'
      const locations = Array.from(new Set(group.map(s => s.district).filter(Boolean)))

      const newCluster = {
        id: `cluster-${Date.now()}-${clusters.length + 1}`,
        name: `${domain.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())} Pattern in ${locations[0] || 'Jharkhand'}`,
        title: `${domain.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())} Pattern in ${locations[0] || 'Jharkhand'}`,
        description: `Aggregated pattern from ${group.length} verified observations across ${locations.join(', ')}.`,
        primary_domain: domain,
        problem_count: group.length,
        avg_severity: Math.round(avgSev * 10) / 10,
        locations: locations.length > 0 ? locations : ['Gumla', 'Jharkhand'],
        district: locations[0] || 'Gumla',
        members: group.map(m => ({
          id: m.id,
          text: m.raw_text || m.original_text,
          district: m.district || 'Gumla',
          severity_score: m.severity_score || 5.0
        })),
        created_at: new Date().toISOString()
      }

      newCluster.emergence_score = calculateEmergenceScore(newCluster)
      newCluster.match_score = newCluster.emergence_score
      clusters.push(newCluster)
    }
  }

  return clusters
}
