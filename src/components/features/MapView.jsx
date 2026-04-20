import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with env var in production

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

const defaultCenter = {
  lat: 28.6139, // Default to New Delhi or another meaningful default
  lng: 77.2090
};

const MapView = ({ markers = [], center, zoom = 12 }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const mapCenter = center || (markers.length > 0 ? { lat: markers[0].lat, lng: markers[0].lng } : defaultCenter);

  if (!isLoaded) return <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={marker.id || index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.title}
        />
      ))}
    </GoogleMap>
  );
};

export default MapView;
