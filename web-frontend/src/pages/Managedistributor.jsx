import React, { useState, useEffect } from 'react';
import Sidebar from '../component/Sidebar';
import TopNavbar from '../component/TopNavbar';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function Managedistributor() {
    const [distributors, setDistributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDistributors = async () => {
        try {
            const res = await api.get('/admin/distributors');
            setDistributors(res.data.data || []);
        } catch (error) {
            console.error("Error fetching distributors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDistributors();
    }, []);

    // Edit Button Click Handler
    const handleEdit = (distributor) => {
        // Distributor ka data state mein pass karke Adddistributor page par bhejna
        navigate('/adddistributor', { state: { distributorData: distributor } });
    };

    // Suspend Button Click Handler
    const handleSuspend = async (id, isActive) => {
        const action = isActive === false ? 'activate' : 'suspend';
        if (!window.confirm(`Are you sure you want to ${action} this distributor?`)) return;
        try {
            await api.put(`/admin/suspend-distributor/${id}`);
            alert(`Distributor ${action}d successfully!`);
            fetchDistributors();
        } catch (error) {
            alert(error.response?.data?.message || `Error ${action}ing distributor`);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Navigation */}
                <TopNavbar />
                
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Top Action Bar with Styled Back Button */}
                    <div className="w-full mb-4">
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-max">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">Manage Distributors</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">View, update, or suspend distributor accounts.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">All Distributors</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{distributors.length} Total</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Name & Contact</th>
                                        <th className="p-4 font-semibold">Company</th>
                                        <th className="p-4 font-semibold">Operating Zones</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">Loading distributors...</td></tr>
                                    ) : distributors.length > 0 ? distributors.map((d) => (
                                        <tr key={d._id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-none">
                                            <td className="p-4">
                                                <p className="font-bold text-slate-900">{d.userId?.name || 'N/A'}</p>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">{d.userId?.phone || 'N/A'}</p>
                                            </td>
                                            <td className="p-4 font-semibold text-slate-800">{d.companyId?.name || 'N/A'}</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {d.zoneIds?.map(z => (
                                                        <span key={z._id} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                                                            {z.name}
                                                        </span>
                                                    )) || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.userId?.isActive === false ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {d.userId?.isActive === false ? 'Suspended' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-3 justify-end items-center h-full">
                                                <button 
                                                    onClick={() => handleEdit(d)} 
                                                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleSuspend(d._id, d.userId?.isActive)} 
                                                    className={`${d.userId?.isActive === false ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'} font-semibold transition-colors`}
                                                >
                                                    {d.userId?.isActive === false ? 'Activate' : 'Suspend'}
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No distributors found. Add one from the dashboard!</td></tr>
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
export default Managedistributor;
