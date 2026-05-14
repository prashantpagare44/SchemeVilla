import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function ManageScheme() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSchemes = async () => {
        try {
            const response = await api.get('/schemes/get-schemes');
            setSchemes(response.data.data || []);
        } catch(error) {
            console.error("Error fetching schemes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchemes(); 
    }, []); 

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this scheme?`)) return;
        try {
            await api.put(`/schemes/update-status/${id}`, { status });
            fetchSchemes(); // Refresh table
        } catch (error) {
            alert(error.response?.data?.message || "Error updating status.");
        }
    };

    const handleEdit = (scheme) => {
        navigate('/create-scheme', { state: { schemeData: scheme } });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this scheme?")) return;
        try {
            await api.delete(`/schemes/delete-scheme/${id}`);
            fetchSchemes(); // Refresh table
        } catch (error) {
            alert(error.response?.data?.message || "Error deleting scheme.");
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
                            <h2 className="text-2xl font-extrabold text-slate-800">Manage Schemes</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Approve rep proposals, or create global schemes for your network.</p>
                        </div>
                        <button onClick={() => navigate('/create-scheme')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            + Create Scheme
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Promotional Schemes</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{schemes.length} Schemes</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Product / Type</th>
                                        <th className="p-4 font-semibold">Discount</th>
                                        <th className="p-4 font-semibold">Validity</th>
                                        <th className="p-4 font-semibold">Created By</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="6" className="p-8 text-center font-medium text-slate-500">Loading schemes...</td></tr>
                                    ) : schemes.length > 0 ? (
                                        schemes.map((scheme) => (
                                            <tr key={scheme._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{scheme.productName}</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5 text-blue-500">{scheme.schemeType}</div>
                                                </td>
                                                <td className="p-4 font-bold text-slate-800">
                                                    {scheme.schemeType === 'flat' ? `₹${scheme.discount}` : `${scheme.discount}%`}
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-xs text-slate-500">From: <span className="font-medium text-slate-700">{new Date(scheme.validFrom).toLocaleDateString()}</span></div>
                                                    <div className="text-xs text-slate-500 mt-0.5">To: <span className="font-medium text-slate-700">{new Date(scheme.expiryDate).toLocaleDateString()}</span></div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-700">{scheme.repId ? scheme.repId.name : 'Distributor (Global)'}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">Role: {scheme.repId ? 'Rep' : 'Distributor'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${scheme.status === 'pending' ? 'bg-orange-100 text-orange-700' : scheme.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {scheme.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {user.role === 'distributor' && scheme.status === 'pending' && (
                                                        <div className="flex justify-end gap-2 mb-2">
                                                            <button onClick={() => handleStatusUpdate(scheme._id, 'approved')} className="text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded-md transition-colors">Approve</button>
                                                            <button onClick={() => handleStatusUpdate(scheme._id, 'rejected')} className="text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-md transition-colors">Reject</button>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex justify-end gap-3 items-center">
                                                        <button onClick={() => handleEdit(scheme)} className="text-blue-600 hover:text-blue-800 font-bold text-xs transition-colors">Edit</button>
                                                        <button onClick={() => handleDelete(scheme._id)} className="text-red-500 hover:text-red-700 font-bold text-xs transition-colors">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">No schemes found. Click "+ Create Scheme" to start.</td></tr>
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