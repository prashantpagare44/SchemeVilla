import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

function ManageReps() {
    const navigate = useNavigate();
    
    const [reps, setReps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchReps = async () => {
            try {
                const response = await api.get('/admin/reps');
                setReps(response.data.data || []);
            } catch(error) {
                console.error("Error fetching reps:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchReps(); 
    }, []); 

    const handleEdit = (rep) => {
        navigate('/dashboard/reps', { state: { repData: rep } });
    };

    const handleSuspend = async (rep) => {
        const action = rep.userId?.isActive === false ? 'activate' : 'suspend';
        if (!window.confirm(`Are you sure you want to ${action} this Sales Rep?`)) return;
        
        try {
            await api.put(`/admin/suspend-rep/${rep._id}`);
            // Refresh list
            const response = await api.get('/admin/reps');
            setReps(response.data.data || []);
        } catch (error) {
            alert(error.response?.data?.message || `Error trying to ${action} rep.`);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
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
                            {/* <h2 className="text-2xl font-extrabold text-slate-800">My Sales Reps</h2> */}
                            <p className="text-sm text-slate-500 mt-1 font-medium">View and manage all the sales representatives working under you.</p>
                        </div>
                        <button onClick={() => navigate('/dashboard/reps')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            + Add New Rep
                        </button>
                    </div>
                    
                
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Sales Representatives</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{reps.length} Reps</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Rep Name</th>
                                        <th className="p-4 font-semibold">Phone Number</th>
                                        <th className="p-4 font-semibold">Assigned Zones</th>
                                        <th className="p-4 font-semibold">Date Joined</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="4" className="p-8 text-center font-medium text-slate-500">Loading your sales reps...</td></tr>
                                    ) : reps.length > 0 ? (
                                        reps.map((rep) => (
                                            <tr key={rep._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                <td className="p-4 font-bold text-slate-900">{rep.userId?.name || 'Unknown'}</td>
                                                <td className="p-4 font-medium text-slate-600">{rep.userId?.phone || 'N/A'}</td>
                                                <td className="p-4 font-medium text-slate-600">{rep.zoneIds?.map(z => z.name).join(', ') || 'No Zones Assigned'}</td>
                                                <td className="p-4 font-medium text-slate-500">{new Date(rep.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${rep.userId?.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {rep.userId?.isActive !== false ? 'Active' : 'Suspended'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right flex justify-end gap-3 items-center">
                                                    <button onClick={() => handleEdit(rep)} className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Edit</button>
                                                    <button onClick={() => handleSuspend(rep)} className={`${rep.userId?.isActive !== false ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} font-bold transition-colors`}>
                                                        {rep.userId?.isActive !== false ? 'Suspend' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="p-8 text-center text-slate-500">No Sales Reps found. Click "Add New Rep" to onboard someone!</td></tr>
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

export default ManageReps;
