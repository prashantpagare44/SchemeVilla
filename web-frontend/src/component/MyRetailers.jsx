import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

function MyRetailers() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const [retailers, setRetailers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchRetailers = async () => {
            try {
                const response = await api.get('/retailers');
                setRetailers(response.data.data || []);
            } catch(error) {
                console.error("Error fetching retailers:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchRetailers(); 
    }, []); 

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this retailer?")) return;
        try {
            await api.delete(`/retailers/delete-retailer/${id}`);
            setRetailers(retailers.filter(r => r._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || "Error deleting retailer");
        }
    };

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

                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">My Retailers</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">View your entire network of retailers and track their outstanding dues.</p>
                        </div>
                        {user.role === 'rep' && (
                            <button onClick={() => navigate('/create-retailer')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                + Add New Retailer
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Retailer Network</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{retailers.length} Retailers</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Shop Name</th>
                                        <th className="p-4 font-semibold">Owner / Phone</th>
                                        <th className="p-4 font-semibold">Zone</th>
                                        <th className="p-4 font-semibold text-right">Outstanding Dues</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="4" className="p-8 text-center font-medium text-slate-500">Loading your retailers...</td></tr>
                                    ) : retailers.length > 0 ? (
                                        retailers.map((retailer) => (
                                            <tr key={retailer._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                <td className="p-4 font-bold text-slate-900">{retailer.shopName || 'N/A'}</td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-slate-800">{retailer.userId?.name || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500">{retailer.userId?.phone || 'N/A'}</div>
                                                </td>
                                                <td className="p-4 font-medium text-slate-600">{retailer.zone?.name || 'Unassigned'}</td>
                                                <td className="p-4 text-right">
                                                    <span className={`px-3 py-1 rounded-md font-bold ${retailer.outstandingAmount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                        ₹{retailer.outstandingAmount || 0}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-3 items-center">
                                                        <button onClick={() => navigate('/create-retailer', { state: { retailerData: retailer } })} className="text-blue-600 hover:text-blue-800 font-bold text-xs transition-colors">Edit</button>
                                                        <button onClick={() => handleDelete(retailer._id)} className="text-red-500 hover:text-red-700 font-bold text-xs transition-colors">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500">No Retailers found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default MyRetailers;