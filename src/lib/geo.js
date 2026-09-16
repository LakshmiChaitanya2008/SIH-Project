/**
 * Geolocation & Reverse Geocoding Module for SamadhanSetu
 * SIH Evaluator Prototype Demo Mode Configuration
 */

/**
 * Single Configuration Switch for SIH Evaluator Prototype Demo Mode
 * - Set `ENABLE_DEMO_GPS = true` for prototype live evaluator demonstrations.
 * - Set `ENABLE_DEMO_GPS = false` to restore live device browser geolocation API.
 */
export const ENABLE_DEMO_GPS = true;

/**
 * Authoritative Fixed Demo Location for SIH Prototype Demonstration
 * Place: Kanuru, Vijayawada, NTR District, Andhra Pradesh, India
 */
export const DEMO_LOCATION = {
  latitude: 16.4862,
  longitude: 80.6931,
  accuracy: 10, // Simulated 10m high-accuracy GPS reading
  timestamp: new Date().toISOString(),
  captured_at: new Date().toISOString(),
  locality: 'Kanuru, Vijayawada',
  district: 'NTR District',
  state: 'Andhra Pradesh',
  country: 'India',
  label: 'Kanuru, Vijayawada, NTR District, Andhra Pradesh',
  rawAddress: 'Kanuru, Penamaluru Mandal, Vijayawada, NTR District, Andhra Pradesh 520007, India',
  method: 'demo_gps',
  isAccurate: true,
  is_mock_location: true,
};

// Coordinates for all 24 Jharkhand district headquarters (used for reference distance mapping)
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
];

/**
 * Calculates great-circle distance between two points on Earth using Haversine formula (in km)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds nearest district from reference coordinates
 */
export function getNearestDistrict(lat, lng) {
  if (!lat || !lng) return { district: 'NTR District', state: 'Andhra Pradesh' };

  let nearestDistrict = JHARKHAND_DISTRICTS[0].name;
  let minDistance = Infinity;

  for (const d of JHARKHAND_DISTRICTS) {
    const dist = haversineDistance(lat, lng, d.lat, d.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestDistrict = d.name;
    }
  }

  return {
    district: nearestDistrict,
    state: 'Jharkhand',
    distanceKm: Math.round(minDistance),
  };
}

/**
 * Real-time reverse geocoding directly from raw latitude/longitude coordinates
 */
export async function reverseGeocode(latitude, longitude) {
  // If demo coordinates match DEMO_LOCATION exactly, return deterministic Kanuru data
  if (
    Math.abs(latitude - DEMO_LOCATION.latitude) < 0.001 &&
    Math.abs(longitude - DEMO_LOCATION.longitude) < 0.001
  ) {
    return {
      label: DEMO_LOCATION.label,
      district: DEMO_LOCATION.district,
      state: DEMO_LOCATION.state,
      locality: DEMO_LOCATION.locality,
      country: DEMO_LOCATION.country,
      rawAddress: DEMO_LOCATION.rawAddress,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SamadhanSetu/1.0',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const locality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.village ||
          addr.city_district ||
          addr.town ||
          addr.city ||
          '';
        const district =
          addr.state_district ||
          addr.county ||
          addr.city ||
          addr.district ||
          locality ||
          'District';
        const state = addr.state || 'India';

        const parts = [];
        if (locality) parts.push(locality);
        if (district && district !== locality) parts.push(district.replace(/ district/i, ''));
        if (state) parts.push(state);

        const label = parts.length > 0 ? parts.join(', ') : data.display_name;

        return {
          label: label || `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
          district: district.replace(/ district/i, ''),
          state: state,
          locality: locality || district,
          country: addr.country || 'India',
          rawAddress: data.display_name,
        };
      }
    }
  } catch (err) {
    console.warn('[Reverse Geocode API Warning]:', err.message);
  }

  const nearest = getNearestDistrict(latitude, longitude);
  return {
    label: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
    district: nearest.district,
    state: nearest.state,
    locality: nearest.district,
    country: 'India',
    rawAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
  };
}

/**
 * Request device GPS coordinates or return deterministic DEMO_LOCATION
 */
export function getCurrentGPSLocation() {
  if (ENABLE_DEMO_GPS) {
    const nowISO = new Date().toISOString();
    const demoPayload = {
      ...DEMO_LOCATION,
      timestamp: nowISO,
      captured_at: nowISO,
    };
    console.log('[GPS Capture Demo Mode Active]:', demoPayload);
    return Promise.resolve(demoPayload);
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = parseFloat(position.coords.latitude.toFixed(6));
        const longitude = parseFloat(position.coords.longitude.toFixed(6));
        const accuracy = Math.round(position.coords.accuracy || 0);
        const timestamp = new Date(position.timestamp || Date.now()).toISOString();

        console.log('[GPS Capture Raw]:', { latitude, longitude, accuracy, timestamp });
        const geoInfo = await reverseGeocode(latitude, longitude);

        const result = {
          latitude,
          longitude,
          accuracy,
          timestamp,
          captured_at: timestamp,
          locality: geoInfo.locality,
          district: geoInfo.district,
          state: geoInfo.state,
          country: geoInfo.country || 'India',
          label: geoInfo.label,
          rawAddress: geoInfo.rawAddress,
          method: 'gps',
          isAccurate: accuracy <= 100,
          is_mock_location: false,
        };

        console.log('[GPS Capture Resolved]:', result);
        resolve(result);
      },
      (error) => {
        let message = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access was denied. Please enable location permissions in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'GPS location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            message = 'GPS location request timed out. Please move to an open area and try again.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  });
}

export { JHARKHAND_DISTRICTS };
