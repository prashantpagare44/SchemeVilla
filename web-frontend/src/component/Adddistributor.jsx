import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Aapka banaya hua axios instance
import { useNavigate, useLocation } from 'react-router-dom';

function Adddistributor() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check agar edit data table wale page se aaya hai
  const editData = location.state?.distributorData;
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
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

  // Agar edit mode hai, toh form ko purane data se bhar do
  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setEditId(editData._id);
      setFormData({
        name: editData.userId?.name || '',
        phone: editData.userId?.phone || '',
        password: '', // Password security ke liye khali chhod dein
        companyId: editData.companyId?._id || editData.companyId || '',
        zoneIds: editData.zoneIds?.[0]?._id || editData.zoneIds?.[0] || '' 
      });
    }
  }, [editData]);

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
        companyId: formData.companyId,
        zoneIds: [formData.zoneIds] 
      };
      
      // Agar naya password type kiya hai tabhi payload me bhejo
      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing) {
        await api.put(`/admin/update-distributor/${editId}`, payload);
        setMessage({ type: 'success', text: 'Distributor successfully updated!' });
      } else {
        await api.post('/admin/create-distributor', payload);
        setMessage({ type: 'success', text: 'Distributor successfully added!' });
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || `Error ${isEditing ? 'updating' : 'adding'} distributor. Please try again.` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-extrabold text-slate-800">{isEditing ? 'Update Distributor' : 'Add New Distributor'}</h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">{isEditing ? 'Modify the details of the selected distributor.' : 'Onboard a new distribution partner.'}</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Raju Kumar" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="10-digit mobile" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Select Company</label>
                <select name="companyId" value={formData.companyId} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors">
                  <option value="">-- Select Company --</option>
                  {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{isEditing ? 'New Password (Optional)' : 'Password'}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder={isEditing ? "Leave blank to keep same" : "Create a password"} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select Operating Zone</label>
              <select name="zoneIds" value={formData.zoneIds} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors">
                <option value="">-- Select Zone --</option>
                {zones.map(z => <option key={z._id} value={z._id}>{z.name} - {z.city}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:opacity-60 shadow-sm shadow-blue-200">
                {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Distributor' : 'Create Distributor')}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Distributor Theme Image */}
        <div className="hidden md:flex w-1/2 bg-blue-600 relative items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1578575437136-7242e38d7599?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 to-transparent"></div>
          
          <div className="relative z-10 text-white text-center mt-auto pb-8">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-6 border border-white/30 shadow-lg">
               {/* Distributor/Warehouse Icon */}
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6"></path></svg>
             </div>
             <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Distribution Network</h2>
             <p className="text-blue-100 text-sm font-medium px-4 leading-relaxed">
                Build and manage your network of distributors, assigning them to specific companies and operational zones.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adddistributor;