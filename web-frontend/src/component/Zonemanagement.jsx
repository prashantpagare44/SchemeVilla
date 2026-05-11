import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export const Zonemanagement = () => {   
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchZones = async () => {
        try {
            const response = await api.get('/masterdata/zone');
            setZones(response.data.zones || []);
        } catch (error) {
            console.error('Error fetching zone data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const handleEdit = (zone) => {
        navigate('/createzone', { state: { zoneData: zone } });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this zone?")) return;
        try {
            await api.delete(`/masterdata/zone/${id}`);
            alert("Zone deleted successfully!");
            fetchZones(); // Refresh the list after deletion
        } catch (error) {
            alert(error.response?.data?.message || "Error deleting zone.");
        }
    };

    return (    
        <div className="flex h-screen bg-slate-50">
            

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Navigation */}
                <TopNavbar />
                
                <main className="flex-1 overflow-y-auto p-6">
                    
                    {/* Top Action Bar */}
                    <div className="w-full mb-6 flex justify-between items-center">
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Dashboard
                        </button>

                        <button onClick={() => navigate('/createzone')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add New Zone
                        </button>
                    </div>

                    {/* Header Details */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold text-slate-800">Manage Zones</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">View, update, or remove operational territories.</p>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">All Registered Zones</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{zones.length} Zones</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Zone Name</th>
                                        <th className="p-4 font-semibold">City</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="3" className="p-8 text-center text-slate-500 font-medium">Loading zones...</td></tr>
                                    ) : zones.length > 0 ? zones.map((zone) => (
                                        <tr key={zone._id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-none">
                                            <td className="p-4 font-bold text-slate-900">{zone.name}</td>
                                            <td className="p-4 font-medium text-slate-600">{zone.city}</td>
                                            <td className="p-4 flex gap-4 justify-end items-center">
                                                <button onClick={() => handleEdit(zone)} className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(zone._id)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="p-8 text-center text-slate-500 font-medium">No zones found. Click "Add New Zone" to create one!</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
export default Zonemanagement;