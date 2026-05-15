import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import TopNavbar from '../../component/TopNavbar';  
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function Rep() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const [orders, setOrders] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                    const [ordersRes, schemesRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/schemes/get-schemes')
                ]);
                setOrders(ordersRes.data.data || []);
                setSchemes(schemesRes.data.data || []);
            } catch (error) {
                console.error("Error fetching rep dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    
    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const recentOrders = orders.slice(0, 5); // Sirf top 5 latest orders dikhayenge

  return (
    <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
            <TopNavbar />
            
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                {/* Page Header & Quick Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Hello <span className="font-bold text-slate-800">{user.name}</span>, ready to boost your sales today?</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/dashboard/create-order')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Take Order
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">My Total Sales</p>
                                <h3 className="text-3xl font-black text-blue-600">₹{totalSales.toLocaleString()}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Orders Booked</p>
                                <h3 className="text-3xl font-black text-slate-800">{orders.length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Approval</p>
                                <h3 className="text-3xl font-black text-orange-500">{pendingOrders}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Schemes</p>
                                <h3 className="text-3xl font-black text-purple-600">{schemes.length}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Orders Table (Takes 2/3 space) */}
                            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
                                    <button onClick={() => navigate('/dashboard/orders')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                                <th className="p-4 font-semibold">Order ID</th>
                                                <th className="p-4 font-semibold">Retailer</th>
                                                <th className="p-4 font-semibold">Amount</th>
                                                <th className="p-4 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-slate-700">
                                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                                <tr key={order._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                    <td className="p-4 font-mono text-xs font-bold text-slate-500">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                                    <td className="p-4 font-semibold text-slate-800">{order.retailerId?.phone || 'Retailer'}</td>
                                                    <td className="p-4 font-bold">₹{order.totalAmount}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="4" className="p-6 text-center text-slate-500">No orders booked yet. Start selling!</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-slate-100 bg-slate-50">
                                    <h3 className="text-lg font-bold text-slate-800">Live Offers</h3>
                                </div>
                                <div className="p-4 overflow-y-auto max-h-100">
                                    {schemes.length > 0 ? (
                                        <ul className="space-y-3">
                                            {schemes.map((scheme) => (
                                                <li key={scheme._id} className="p-4 border border-blue-100 bg-blue-50/30 rounded-xl hover:bg-blue-50 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-slate-800">{scheme.productName}</h4>
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{scheme.schemeType === 'flat' ? `₹${scheme.discount} OFF` : `${scheme.discount}% OFF`}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium">Valid till: {new Date(scheme.expiryDate).toLocaleDateString()}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-center text-slate-500 py-6 text-sm">No active schemes from distributor.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    </div>
  )
}

export default Rep