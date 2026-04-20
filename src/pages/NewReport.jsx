import React, { useState, useEffect, useContext, useRef } from 'react';
import { getCities, getZones, getMapMarkers, reportPothole } from '../api';
import { CityContext } from '../context/CityContext';
import MapView from '../components/features/MapView';
import toast from 'react-hot-toast';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewReport = () => {
  const { selectedCityId, setSelectedCityId } = useContext(CityContext);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [issueType, setIssueType] = useState('Pothole');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const issueOptions = ['Pothole', 'Broken Streetlight', 'Water Leak', 'Road Damage', 'Other'];

  const fetchMapMarkers = React.useCallback(async (cityId) => {
    try {
      const data = await getMapMarkers(cityId);
      setMarkers(data);
    } catch {
      console.log('Error fetching map pins');
    }
  }, []);

  const fetchZones = React.useCallback(async (cityId) => {
    try {
      const data = await getZones(cityId);
      setZones(data);
      if(data.length > 0) {
        setSelectedZoneId(data[0].id || data[0]._id);
      } else {
        setSelectedZoneId('');
      }
    } catch {
      toast.error('Failed to load zones');
    }
  }, []);

  const fetchCities = React.useCallback(async () => {
    try {
      const data = await getCities();
      setCities(data);
      if (data.length > 0 && !selectedCityId) {
        setSelectedCityId(data[0].id || data[0]._id);
      }
    } catch {
      toast.error('Failed to load cities');
    }
  }, [selectedCityId, setSelectedCityId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    if (selectedCityId) {
      fetchZones(selectedCityId);
      fetchMapMarkers(selectedCityId);
    }
  }, [selectedCityId, fetchZones, fetchMapMarkers]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedCityId || !selectedZoneId || !issueType || !description) {
      toast.error('Please fill all required fields and upload an image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('cityId', selectedCityId);
      formData.append('zoneId', selectedZoneId);
      formData.append('issueType', issueType);
      formData.append('description', description);

      await reportPothole(formData);
      toast.success('✅ Your report has been submitted successfully!');
      navigate('/my-complaints');
    } catch {
      toast.error('Failed to submit report. Please try again.');
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select 
                value={selectedCityId || ''} 
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              >
                {cities.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone / Area</label>
              <select 
                value={selectedZoneId} 
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              >
                <option value="" disabled>Select Zone</option>
                {zones.map(z => <option key={z.id || z._id} value={z.id || z._id}>{z.name}</option>)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              rows="4" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none resize-none"
              placeholder="Provide more context about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-orange text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>

      {/* Right: Map Preview */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-[85vh] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow font-medium text-sm text-gray-800">
           Existing Issues in {cities.find(c => (c.id || c._id) === selectedCityId)?.name || 'City'}
        </div>
        <MapView markers={markers} />
      </div>
    </div>
  );
};

export default NewReport;
