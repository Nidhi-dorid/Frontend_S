// City name → map center coordinates
// Used by MapView to center the map on the selected city
const cityCoordinates = {
  'Indore':  { lat: 22.7196, lng: 75.8577 },
  'Bhopal':  { lat: 23.2599, lng: 77.4126 },
  'Vidisha': { lat: 23.5251, lng: 77.8081 },
};

// Default center (Indore) if city not found
const DEFAULT_CENTER = { lat: 22.7196, lng: 75.8577 };

/**
 * Get map center coordinates for a given city name.
 * Falls back to DEFAULT_CENTER if the city isn't in our lookup.
 */
export const getCityCenter = (cityName) => {
  if (!cityName) return DEFAULT_CENTER;
  return cityCoordinates[cityName] || DEFAULT_CENTER;
};

export default cityCoordinates;
