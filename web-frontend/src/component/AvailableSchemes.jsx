import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function AvailableSchemes() {
    const navigate = useNavigate();
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchSchemes = async () => {
            try {
                const response = await api.get('/schemes/get-schemes');
                setSchemes(response.data.data || []);
            }catch(error) {
                console.error("Error fetching schemes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes(); 
    }, []); 

    return (
        <div className="flex h-screen bg-slate-50">
            
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    
                    <div className="w-full mb-6">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-max">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold text-slate-800">Available Offers & Schemes 🎁</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Special discounts and offers currently active for your shop. Ask your Sales Rep to apply these on your next order!</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : schemes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {schemes.map((scheme) => (
                                <div key={scheme._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                    
                                    {/* Discount Badge */}
                                    <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1.5 rounded-bl-2xl font-black text-sm shadow-sm group-hover:scale-105 transition-transform origin-top-right">
                                        {scheme.schemeType === 'flat' ? `₹${scheme.discount} OFF` : scheme.schemeType === 'percentage' || scheme.schemeType === 'slab' ? `${scheme.discount}% OFF` : 'SPECIAL OFFER'}
                                    </div>

                                    <div className="mt-2 mb-4">
                                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">{scheme.schemeType} Offer</p>
                                        <h3 className="text-xl font-black text-slate-800 leading-tight">{scheme.productName}</h3>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                                        <p className="text-sm font-semibold text-slate-700 italic">"{scheme.terms || 'Valid on bulk purchases.'}"</p>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                        <div className="text-xs font-bold text-slate-500">
                                            Valid till: <span className="text-slate-800">{new Date(scheme.expiryDate).toLocaleDateString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                            <p className="text-lg font-bold text-slate-600">No active offers right now.</p>
                            <p className="text-sm text-slate-500 mt-2">Check back later for exciting discounts!</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
