import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';

function AddRep() {
  const navigate = useNavigate();
  
  // Form ke data ka state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    companyId: '', 
    zoneIds: '',
    distributorId: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Dropdowns ke liye state
  const [companies, setCompanies] = useState([]);
  const [zones, setZones] = useState([]);
  const [distributors, setDistributors] = useState([]);

  // Page load hote hi API se master data aur distributors fetch karo
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [compRes, zoneRes, distRes] = await Promise.all([
          api.get('/masterdata/company'), 
          api.get('/masterdata/zone'),
          api.get('/admin/distributors')
        ]);
        setCompanies(compRes.data.companies || []);
        setZones(zoneRes.data.zones || []);
        setDistributors(distRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data for Rep form:", error);
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
        zoneIds: [formData.zoneIds], // Backend needs an array
        distributorId: formData.distributorId
      };

      const response = await api.post('/admin/create-rep', payload);
      
      setMessage({ type: 'success', text: 'Sales Rep successfully added!' });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error adding Sales Rep. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Create Sales Rep Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-extrabold text-slate-800">Add New Sales Rep</h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">Onboard a new sales representative to the field.</p>
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
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="e.g. Amit Sharma"
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
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Distributor</label>
                <select 
                  name="distributorId" 
                  value={formData.distributorId} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                >
                  <option value="">-- Select Distributor --</option>
                  {distributors.map(d => (
                    <option key={d._id} value={d._id}>{d.userId?.name || 'Unknown'} - {d.companyId?.name}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Operating Zone</label>
                <select name="zoneIds" value={formData.zoneIds} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors">
                  <option value="">-- Select Zone --</option>
                  {zones.map(z => <option key={z._id} value={z._id}>{z.name} - {z.city}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:opacity-60 shadow-sm shadow-blue-200">
                {loading ? 'Creating...' : 'Create Sales Rep'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Sales/Field Theme */}
        <div className="hidden md:flex w-1/2 bg-blue-600 relative items-center justify-center p-8 overflow-hidden">
          {/* Unsplash Sales/Field Background */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 to-transparent"></div>
          
          <div className="relative z-10 text-white text-center mt-auto pb-8">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-6 border border-white/30 shadow-lg">
               {/* Sales Team SVG Icon */}
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
             </div>
             <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Expand Your Reach</h2>
             <p className="text-blue-100 text-sm font-medium px-4 leading-relaxed">
                Empower your sales representatives with real-time data, scheme tracking, and seamless order management in the field.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRep;
