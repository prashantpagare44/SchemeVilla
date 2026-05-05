import React , { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function CreateCompany() {

    const [companyData, setCompanyData] = useState({ name: '', zoneIds: [] });
      const [allZones, setAllZones] = useState([]);
      const [masterLoading, setMasterLoading] = useState({ zone: false, company: false });
      const [masterMessage, setMasterMessage] = useState({ zone: null, company: null });
      

    useEffect(() => {
    const fetchZones = async () => {
        try {
          const res = await api.get('/masterdata/zone');
          setAllZones(res.data.zones || []);
        } catch (error) {
          console.error("Failed to fetch zones for master data form", error);
        }
    };
    fetchZones();
  }, []); 


  const handleCompanyChange = (e) => setCompanyData({ ...companyData, [e.target.name]: e.target.value });

  const handleZoneCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedZoneIds = checked
      ? [...companyData.zoneIds, value]
      : companyData.zoneIds.filter(id => id !== value);
    setCompanyData({ ...companyData, zoneIds: updatedZoneIds });
  };


   const handleCompanySubmit = async (e) => {
      e.preventDefault();
      setMasterLoading(prev => ({ ...prev, company: true }));
      setMasterMessage(prev => ({ ...prev, company: null }));
      try {
        const response = await api.post('/masterdata/company', companyData);
        setMasterMessage(prev => ({ ...prev, company: { type: 'success', text: response.data.message } }));
        setCompanyData({ name: '', zoneIds: [] }); // Reset form
        
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);

      } catch (error) {
        setMasterMessage(prev => ({ ...prev, company: { type: 'error', text: error.response?.data?.message || 'Failed to create company.' } }));
      } finally {
        setMasterLoading(prev => ({ ...prev, company: false }));
      }
    };

  return(
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-4xl w-full rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Business/Corporate Theme */}
        <div className="hidden md:flex w-1/2 bg-blue-600 relative items-center justify-center p-8 overflow-hidden">
          {/* Unsplash Business/Office Background */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 to-transparent"></div>
          
          <div className="relative z-10 text-white text-center mt-auto pb-8">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-6 border border-white/30 shadow-lg">
               {/* Building/Company SVG Icon */}
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z"></path></svg>
             </div>
             <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Onboard Companies</h2>
             <p className="text-blue-100 text-sm font-medium px-4 leading-relaxed">
                Register new agencies, distributors, and partners into the supply chain network and assign operational zones.
             </p>
          </div>
        </div>

        
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              
              <div className="mb-8">
                 <h3 className="text-2xl font-extrabold text-slate-800">Create New Company</h3>
                 <p className="text-slate-500 text-sm mt-1 font-medium">Add a new company/agency to the system.</p>
              </div>

              {masterMessage.company && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${masterMessage.company.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {masterMessage.company.text}
                </div>
              )}
              <form onSubmit={handleCompanySubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                  <input type="text" name="name" value={companyData.name} onChange={handleCompanyChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g., Raju Traders" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Zones</label>
                  <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-200 rounded-xl bg-slate-50">
                    {allZones.length > 0 ? allZones.map(zone => (
                      <label key={zone._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          value={zone._id}
                          checked={companyData.zoneIds.includes(zone._id)}
                          onChange={handleZoneCheckboxChange}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-700 font-medium">{zone.name} <span className="text-slate-400 font-normal text-xs ml-1">({zone.city})</span></span>
                      </label>
                    )) : (
                      <p className="text-sm text-slate-500 text-center py-4">No zones found. Please create a zone first.</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button type="button" onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={masterLoading.company} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-sm shadow-blue-200">
                    {masterLoading.company ? 'Creating...' : 'Create Company'}
                  </button>
                </div>
              </form>
            </div>
      </div>
    </div>
  )

}

export default CreateCompany;