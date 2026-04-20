import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const defaultCenter = [15.3647, 75.1240]; // Hubli-Dharwad default

// Helper component to re-center map when center prop changes
const ChangeView = ({ center, zoom }) => {
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
      <ChangeView center={mapCenter} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker
          key={marker.id || index}
          position={[marker.lat || 0, marker.lng || 0]}
        >
          <Popup>
            <strong>{marker.title || 'Issue'}</strong>
            {marker.status && <p className="text-xs mt-1">{marker.status}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
