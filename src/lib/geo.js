/**
 * Geolocation & Proximity Resolver for SamadhanSetu
 * Resolves GPS coordinates into administrative Jharkhand districts in <1ms without paid APIs.
 */

// Coordinates for all 24 Jharkhand district headquarters
const JHARKHAND_DISTRICTS = [
  { name: 'Gumla', lat: 23.0423, lng: 84.5412 },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
  { name: 'Latehar', lat: 23.7431, lng: 84.4984 },
  { name: 'Simdega', lat: 22.6146, lng: 84.5106 },
  { name: 'Khunti', lat: 23.0722, lng: 85.2796 },
  { name: 'Lohardaga', lat: 23.4357, lng: 84.6811 },
  { name: 'West Singhbhum', lat: 22.5683, lng: 85.8080 },
  { name: 'East Singhbhum', lat: 22.8046, lng: 86.2029 },
  { name: 'Hazaribagh', lat: 23.9925, lng: 85.3637 },
  { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
  { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
  { name: 'Palamu', lat: 24.0373, lng: 84.0722 },
  { name: 'Garhwa', lat: 24.1610, lng: 83.8058 },
  { name: 'Chatra', lat: 24.2092, lng: 84.8711 },
  { name: 'Koderma', lat: 24.4682, lng: 85.5947 },
  { name: 'Giridih', lat: 24.1856, lng: 86.3073 },
  { name: 'Deoghar', lat: 24.4826, lng: 86.7011 },
  { name: 'Dumka', lat: 24.2677, lng: 87.2486 },
  { name: 'Godda', lat: 24.8277, lng: 87.2136 },
  { name: 'Sahibganj', lat: 25.2425, lng: 87.6433 },
  { name: 'Pakur', lat: 24.6342, lng: 87.8488 },
  { name: 'Jamtara', lat: 23.9622, lng: 86.8028 },
  { name: 'Ramgarh', lat: 23.6294, lng: 85.5173 },
  { name: 'Saraikela Kharsawan', lat: 22.6997, lng: 85.9304 },
]

/**
 * Calculates great-circle distance between two points on Earth using Haversine formula (in km)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Finds the nearest Jharkhand district from given coordinates
 */
export function getNearestDistrict(lat, lng) {
  if (!lat || !lng) return { district: 'Gumla', state: 'Jharkhand' }

  let nearestDistrict = JHARKHAND_DISTRICTS[0].name
  let minDistance = Infinity

  for (const d of JHARKHAND_DISTRICTS) {
    const dist = haversineDistance(lat, lng, d.lat, d.lng)
    if (dist < minDistance) {
      minDistance = dist
      nearestDistrict = d.name
    }
  }

  return {
    district: nearestDistrict,
    state: 'Jharkhand',
    distanceKm: Math.round(minDistance),
  }
}

/**
 * Request device GPS coordinates from browser Geolocation API
 */
export function getCurrentGPSLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const { district, state, distanceKm } = getNearestDistrict(latitude, longitude)
        
        resolve({
          latitude: parseFloat(latitude.toFixed(4)),
          longitude: parseFloat(longitude.toFixed(4)),
          district,
          state,
          label: `${district} District, ${state}`,
          method: 'gps',
          distanceKm,
        })
      },
      (error) => {
        let message = 'Unable to retrieve your location.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access was denied. Please select your district below.'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is currently unavailable.'
            break
          case error.TIMEOUT:
            message = 'Location request timed out. Please select your district manually.'
            break
        }
        reject(new Error(message))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  })
}

export { JHARKHAND_DISTRICTS }
