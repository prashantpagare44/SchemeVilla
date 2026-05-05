import React from 'react'
import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function CreateZone()
{
    const navigate = useNavigate();
    const [zoneData, setZoneData] = useState({ name: '', city: '' });
    const [masterMessage, setMasterMessage] = useState({ zone: null, company: null });
    const [masterLoading, setMasterLoading] = useState({ zone: false, company: false });
    
    const handleZoneChange = (e) => setZoneData({ ...zoneData, [e.target.name]: e.target.value });
    
    const handleZoneSubmit = async (e) => {
        e.preventDefault();
        setMasterLoading(prev => ({ ...prev, zone: true }));
        setMasterMessage(prev => ({ ...prev, zone: null }));
        try {
          const response = await api.post('/masterdata/zone', zoneData);
          setMasterMessage(prev => ({ ...prev, zone: { type: 'success', text: response.data.message } }));
          setZoneData({ name: '', city: '' }); 
          
          // Redirect back to dashboard after 1.2 seconds on success
          setTimeout(() => {
            navigate('/dashboard'); // App.jsx ke hisaab se sahi route '/dashboard' hai
          }, 1200);

        } catch (error) {
          setMasterMessage(prev => ({ ...prev, zone: { type: 'error', text: error.response?.data?.message || 'Failed to create zone.' } }));
        } finally {
          setMasterLoading(prev => ({ ...prev, zone: false }));
        }
      };
      
    return(
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white max-w-4xl w-full rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Side: Map / Location Theme */}
            <div className="hidden md:flex w-1/2 bg-blue-600 relative items-center justify-center p-8 overflow-hidden">
              {/* Unsplash Map Background */}
              <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 to-transparent"></div>
              
              <div className="relative z-10 text-white text-center mt-auto pb-8">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-6 border border-white/30 shadow-lg">
                   {/* Map Pin SVG Icon */}
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 </div>
                 <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Define Territories</h2>
                 <p className="text-blue-100 text-sm font-medium px-4 leading-relaxed">
                    Create operational zones and areas for your distributors and sales reps to manage the supply chain efficiently.
                 </p>
              </div>
            </div>

            {/* Right Side: Create Zone Form */}
            <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              
              <div className="mb-8">
                 <h3 className="text-2xl font-extrabold text-slate-800">Create New Zone</h3>
                 <p className="text-slate-500 text-sm mt-1 font-medium">Add a new geographical area to the system.</p>
              </div>

              {masterMessage.zone && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${masterMessage.zone.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {masterMessage.zone.text}
                </div>
              )}

              <form onSubmit={handleZoneSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Zone Name</label>
                  <input type="text" name="name" value={zoneData.name} onChange={handleZoneChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g., Delhi NCR" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                  <input type="text" name="city" value={zoneData.city} onChange={handleZoneChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g., New Delhi" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button type="button" onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={masterLoading.zone} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-sm shadow-blue-200">
                    {masterLoading.zone ? 'Creating...' : 'Create Zone'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    )
}
export default CreateZone;