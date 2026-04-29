import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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

// Red pin icon — user ka selected location
const redPinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultCenter = [22.7196, 75.8577]; // Default: Indore

// FIX 4 — Sirf city change hone par re-center karo (zone change par nahi)
// centerKey sirf tab badle jab city badle
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  const prevCenterRef = React.useRef(null);

  React.useEffect(() => {
    if (!center) return;
    const isSameCenter =
      prevCenterRef.current &&
      prevCenterRef.current[0] === center[0] &&
      prevCenterRef.current[1] === center[1];

    if (!isSameCenter) {
      map.setView(center, zoom);
      prevCenterRef.current = center;
    }
  }, [center, zoom, map]);

  return null;
};

// FIX — Map click handler: user map pe click kare toh pin drop ho
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

const MapView = ({ markers = [], center, zoom = 12, pinnedLocation = null, onMapClick = null }) => {
  const mapCenter = center
    ? [center.lat, center.lng]
    : markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : defaultCenter;

  return (
    <>
      {/* FIX — User ko hint do ki map clickable hai */}
      {onMapClick && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          fontSize: '12px',
          padding: '4px 12px',
          borderRadius: '999px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          {pinnedLocation ? '📍 Pin set — click to move it' : '👆 Click on map to drop a pin'}
        </div>
      )}

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

        {/* FIX 4 — Re-center only when city changes */}
        <RecenterMap center={mapCenter} zoom={zoom} />

        {/* FIX — Map click handler */}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        {/* Existing pothole markers (blue default pins) */}
        {markers
          .filter(m => m && typeof m.lat !== 'undefined' && typeof m.lng !== 'undefined')
          .map((marker, index) => (
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

        {/* FIX — User ka red pin (auto-pin ya manual click) */}
        {pinnedLocation && (
          <Marker
            position={[pinnedLocation.lat, pinnedLocation.lng]}
            icon={redPinIcon}
          >
            <Popup>
              <strong>📍 Your selected location</strong>
              <p style={{ fontSize: '11px', margin: '4px 0 0' }}>
                {pinnedLocation.lat.toFixed(5)}, {pinnedLocation.lng.toFixed(5)}
              </p>
              <p style={{ fontSize: '11px', color: '#666' }}>
                Click elsewhere on map to move pin
              </p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default MapView;