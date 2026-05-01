import React, { useState, useEffect, useContext, useRef } from 'react';
import { getCities, getZones, getMapMarkers, reportPothole } from '../api';
import { CityContext } from '../context/CityContext';
import { getCityCenter } from '../lib/cityCoordinates';
import MapView from '../components/features/MapView';
import toast from 'react-hot-toast';
import { UploadCloud, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROAD_TYPE_OPTIONS } from '../lib/constants';

const NewReport = () => {
  const { selectedCityId, setSelectedCityId } = useContext(CityContext);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [issueType, setIssueType] = useState('Pothole');
  const [roadType, setRoadType] = useState('main_road');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState(null);
  const [geocodingStatus, setGeocodingStatus] = useState('idle');
  const [mlLoading, setMlLoading] = useState(false);
  const [mlResult, setMlResult] = useState(null);
  const [mlError, setMlError] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const issueOptions = ['Pothole', 'Broken Streetlight', 'Water Leak', 'Road Damage', 'Other'];

  // ─── CRITICAL REFS to prevent duplicate fetches and overwrites ───
  const lastFetchedCityId = useRef(null);
  const isManualZoneSelection = useRef(false);

  // ─── 1. Load cities once on mount ───
  useEffect(() => {
    let cancelled = false;

    getCities()
      .then(data => {
        if (cancelled) return;
        setCities(data);
        if (data.length > 0 && !selectedCityId) {
          const firstCityId = String(data[0].id || data[0]._id);
          setSelectedCityId(firstCityId);
        }
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load cities');
      });

    return () => { cancelled = true; };
  }, []); // ← Empty array = runs once only

  // ─── 2. Load zones + markers when city changes ───
  // This effect ONLY runs when selectedCityId changes.
  // It uses lastFetchedCityId ref to prevent duplicate runs (StrictMode).
  useEffect(() => {
    if (!selectedCityId) return;

    // CRITICAL: Skip if we already fetched for this city
    if (lastFetchedCityId.current === selectedCityId) {
      console.log('[ZoneEffect] Already fetched for city', selectedCityId, '- skipping');
      return;
    }

    let cancelled = false;
    lastFetchedCityId.current = selectedCityId;
    isManualZoneSelection.current = false; // reset manual flag for new city

    console.log('[ZoneEffect] Fetching zones for city:', selectedCityId);

    // Fetch zones
    getZones(selectedCityId)
      .then(data => {
        if (cancelled) return;
        console.log('[ZoneEffect] Got zones:', data.length);
        setZones(data);

        // Auto-select first zone only if user hasn't manually selected
        if (data.length > 0 && !isManualZoneSelection.current) {
          const firstId = String(data[0].id || data[0]._id);
          console.log('[ZoneEffect] Auto-selecting first zone:', firstId);
          setSelectedZoneId(firstId);

          // Auto-pin first zone
          const zone = data[0];
          const zoneName = zone.zoneName || zone.name || '';
          const cityData = cities.find(c => String(c.id || c._id) === String(selectedCityId));
          const cityName = cityData?.name || '';
          const query = `${zoneName}, ${cityName}`;

          setGeocodingStatus('loading');
          fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`)
            .then(res => res.json())
            .then(geoData => {
              if (cancelled) return;
              if (geoData.length > 0) {
                setPinnedLocation({ lat: parseFloat(geoData[0].lat), lng: parseFloat(geoData[0].lon) });
                setGeocodingStatus('success');
                toast.success('📍 Location auto-pinned! Adjust on map if needed.');
              } else {
                setGeocodingStatus('failed');
                toast.error('Auto-pin failed. Please click on the map to set location.');
              }
            })
            .catch(() => {
              if (!cancelled) {
                setGeocodingStatus('failed');
                toast.error('Location lookup failed. Please pin manually on the map.');
              }
            });
        }
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load zones');
      });

    // Fetch markers
    getMapMarkers(selectedCityId)
      .then(data => { if (!cancelled) setMarkers(data); })
      .catch(() => console.log('Error fetching map pins'));

    return () => { cancelled = true; };
  }, [selectedCityId]); // ← ONLY dependency. Nothing else!

  // ─── Handlers ───
  const handleCityChange = (cityId) => {
    const newCityId = String(cityId);
    console.log('[handleCityChange] Changing to city:', newCityId);

    // Reset the ref so the effect will run for the new city
    lastFetchedCityId.current = null;
    isManualZoneSelection.current = false;

    setSelectedCityId(newCityId);
    setZones([]);
    setSelectedZoneId('');
    setPinnedLocation(null);
    setGeocodingStatus('idle');
  };

  const handleZoneChange = (zoneId) => {
    const newZoneId = String(zoneId);
    console.log('[handleZoneChange] User selected zone:', newZoneId);

    // Mark that user manually selected - this prevents auto-overwrite
    isManualZoneSelection.current = true;
    setSelectedZoneId(newZoneId);

    // Geocode the selected zone directly (no fetch, no effect trigger)
    const zone = zones.find(z => String(z.id || z._id) === newZoneId);
    if (!zone) return;

    const zoneName = zone.zoneName || zone.name || '';
    const cityData = cities.find(c => String(c.id || c._id) === String(selectedCityId));
    const cityName = cityData?.name || '';
    const query = `${zoneName}, ${cityName}`;

    setGeocodingStatus('loading');
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setPinnedLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          setGeocodingStatus('success');
          toast.success('📍 Location auto-pinned! Adjust on map if needed.');
        } else {
          setGeocodingStatus('failed');
          toast.error('Auto-pin failed. Please click on the map to set location.');
        }
      })
      .catch(() => {
        setGeocodingStatus('failed');
        toast.error('Location lookup failed. Please pin manually on the map.');
      });
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));

      setMlResult(null);
      setMlError(null);
      setMlLoading(true);

      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const response = await fetch('https://ml-flask-model-3jg4.onrender.com/api/detect-pothole', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.success && data.data?.hasPothole) {
          setMlResult({ hasPothole: true, count: data.data.potholeCount });
          toast.success(`Pothole detected!`);
        } else {
          setMlError(data.message || 'No pothole detected in the image.');
          setFile(null);
          setPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          toast.error(data.message || 'No pothole detected. Please upload a valid image.');
        }
      } catch (error) {
        console.error('ML API Error:', error);
        setMlError('Error detecting pothole. Please try again.');
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.error('Error connecting to ML service.');
      } finally {
        setMlLoading(false);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setMlResult(null);
    setMlError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !selectedCityId || !selectedZoneId || !issueType || !description) {
      toast.error('Please fill all required fields and upload an image.');
      return;
    }

    if (!pinnedLocation) {
      toast.error('Please select a location on the map or choose a zone to auto-pin.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const dataPayload = {
        cityId: Number(selectedCityId),
        zoneId: Number(selectedZoneId),
        latitude: pinnedLocation.lat,
        longitude: pinnedLocation.lng,
        roadType: roadType,
        description: description,
      };

      console.log('[handleSubmit] Sending dataPayload:', dataPayload);
      formData.append('data', JSON.stringify(dataPayload));

      await reportPothole(formData);
      toast.success('✅ Your report has been submitted successfully!');
      navigate('/my-complaints');
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to submit report. Check console for details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-h-full">
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-[85vh]">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit New Report</h1>
        <p className="text-gray-500 mb-8">Help us fix issues by providing details and a photo.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Photo (Required)</label>
            {!previewUrl ? (
              <div
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={40} className="text-brand-orange mb-2" />
                <p className="text-sm font-medium text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>
            ) : (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {mlLoading && (
              <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></span>
                Analyzing image for potholes...
              </p>
            )}
            {mlResult?.hasPothole && (
              <p className="text-sm text-green-600 mt-2 font-medium">
                ✅ Pothole detected
              </p>
            )}
            {mlError && (
              <p className="text-sm text-red-600 mt-2 font-medium">
                ❌ {mlError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={selectedCityId || ''}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              >
                {cities.map(c => (
                  <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone / Area</label>
              <select
                value={selectedZoneId}
                onChange={(e) => handleZoneChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              >
                <option value="" disabled>Select Zone</option>
                {zones.map(z => (
                  <option key={z.id || z._id} value={z.id || z._id}>
                    {z.zoneName || z.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
            >
              {issueOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Road Type</label>
            <select
              value={roadType}
              onChange={(e) => setRoadType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
            >
              {ROAD_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none resize-none"
              placeholder="Provide more context about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {geocodingStatus === 'failed' && (
            <p className="text-xs text-red-500 -mt-2">
              ⚠️ Auto-pin failed. Please click on the map to drop a pin manually.
            </p>
          )}
          {pinnedLocation && (
            <p className="text-xs text-green-600 -mt-2">
              ✅ Location set: {pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lng.toFixed(4)}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !pinnedLocation || geocodingStatus === 'loading' || mlLoading || !mlResult?.hasPothole}
            className="w-full bg-brand-orange text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {geocodingStatus === 'loading'
              ? 'Finding location...'
              : !pinnedLocation
                ? 'Select a zone to continue'
                : mlLoading
                  ? 'Analyzing image...'
                  : !mlResult?.hasPothole
                    ? 'Pothole detection required'
                    : loading
                      ? 'Submitting...'
                      : 'Submit Report'}
          </button>
        </form>
      </div>

      {/* Right: Map */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-[85vh] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow font-medium text-sm text-gray-800">
          Existing Issues in {cities.find(c => String(c.id || c._id) === String(selectedCityId))?.name || 'City'}
        </div>
        <MapView
          markers={markers}
          center={getCityCenter(cities.find(c => String(c.id || c._id) === String(selectedCityId))?.name)}
          pinnedLocation={pinnedLocation}
          onMapClick={(latlng) => {
            setPinnedLocation(latlng);
            setGeocodingStatus('success');
          }}
        />
      </div>
    </div>
  );
};

export default NewReport;
