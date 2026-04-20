import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with bundlers (Vite/Webpack)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultCenter = [22.7196, 75.8577]; // Default: Indore

// Helper component that re-centers the map when center prop changes
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapView = ({ markers = [], center, zoom = 12 }) => {
  const mapCenter = center
    ? [center.lat, center.lng]
    : markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : defaultCenter;

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap center={mapCenter} zoom={zoom} />
      {markers.filter(m => m && typeof m.lat !== 'undefined' && typeof m.lng !== 'undefined').map((marker, index) => (
        <Marker
          key={marker.id || index}
          position={[marker.lat, marker.lng]}
        >
          {marker.title && (
            <Popup>
              <strong>{marker.title}</strong>
              {marker.description && <p>{marker.description}</p>}
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
