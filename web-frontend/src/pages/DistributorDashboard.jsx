import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import TopNavbar from '../component/TopNavbar';
import Sidebar from '../component/Sidebar'; 
import { useNavigate } from 'react-router-dom';

function DistributorDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalOutstanding: 0,
        topProducts: [],
        topReps: []
    });
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex h-screen bg-slate-50">
            
            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <TopNavbar />
                
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {/* Page Header & Quick Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            {/* <h2 className="text-3xl font-extrabold text-slate-800">Distributor Overview</h2> */}
                            <p className="text-sm text-slate-500 mt-1 font-medium">Welcome back! Here is what's happening in your distribution network today.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/dashboard/schemes')} className="px-4 py-2 bg-blue-600 border border-slate-200 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                + Create Scheme
                            </button>
                            <button onClick={() => navigate('/addrep')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                                + Onboard Rep
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Sales</p>
                                        <h3 className="text-3xl font-black text-slate-800">₹{stats.totalSales.toLocaleString()}</h3>
                                    </div>
                                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                </div>

                    
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Orders</p>
                                        <h3 className="text-3xl font-black text-slate-800">{stats.totalOrders}</h3>
                                    </div>
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                    </div>
                                </div>

                                
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Market Dues (Udhaar)</p>
                                        <h3 className="text-3xl font-black text-red-600">₹{stats.totalOutstanding.toLocaleString()}</h3>
                                    </div>
                                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                
                        
                                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="text-lg font-bold text-slate-800">Top Selling Products</h3>
                                    </div>
                                    <div className="p-4">
                                        {stats.topProducts.length > 0 ? (
                                            <ul className="space-y-3">
                                                {stats.topProducts.map((item, idx) => (
                                                    <li key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                                        <span className="font-semibold text-slate-700">{item.name}</span>
                                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-bold">{item.totalQuantitySold} Units</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-slate-500 text-center py-4 text-sm font-medium">No sales data yet.</p>
                                        )}
                                    </div>
                                </div>

                                
                                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="text-lg font-bold text-slate-800">Top Performing Reps</h3>
                                    </div>
                                    <div className="p-4">
                                        {stats.topReps.length > 0 ? (
                                            <ul className="space-y-3">
                                                {stats.topReps.map((rep, idx) => (
                                                    <li key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                                        <div>
                                                            <p className="font-bold text-slate-800">{rep.repName}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{rep.orderCount} Orders Booked</p>
                                                        </div>
                                                        <span className="text-blue-600 font-black">₹{rep.totalSales.toLocaleString()}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-slate-500 text-center py-4 text-sm font-medium">No rep performance data yet.</p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default DistributorDashboard;