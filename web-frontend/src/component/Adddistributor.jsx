import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Aapka banaya hua axios instance
import { useNavigate } from 'react-router-dom';

function Adddistributor() {
  const navigate = useNavigate();
  
  // Form ke data ka state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    companyId: '', 
    zoneIds: ''    
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Dropdowns ke liye state
  const [companies, setCompanies] = useState([]);
  const [zones, setZones] = useState([]);

  // Component mount hone par APIs se data fetch karo
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [compRes, zoneRes] = await Promise.all([
          api.get('/masterdata/company'), 
          api.get('/masterdata/zone')
        ]);
        setCompanies(compRes.data.companies || []);
        setZones(zoneRes.data.zones || []);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      
      const payload = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        companyId: formData.companyId,
        zoneIds: [formData.zoneIds] 
      };

      const response = await api.post('/admin/create-distributor', payload);
      
      setMessage({ type: 'success', text: 'Distributor successfully added!' });
      
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error adding distributor. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-sm border border-slate-100 p-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Add New Distributor</h2>
          <p className="text-slate-500 text-sm mt-1">Fill in the details to create a new distributor account.</p>
        </div>

        {/* Message Alert (Success / Error) */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Raju Kumar"
              />
            </div>

            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select Company</label>
              <select 
                name="companyId" 
                value={formData.companyId} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">-- Select Company --</option>
                {companies.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Zone / Area ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Operating Zone</label>
            <select 
              name="zoneIds" 
              value={formData.zoneIds} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">-- Select Zone --</option>
              {zones.map(z => (
                <option key={z._id} value={z._id}>{z.name} - {z.city}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
            >
              {loading ? 'Creating...' : 'Create Distributor'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Adddistributor;