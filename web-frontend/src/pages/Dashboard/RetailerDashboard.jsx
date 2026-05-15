import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import TopNavbar from '../../component/TopNavbar';  
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function RetailerDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRetailerData = async () => {
            try {
                // Retailer ki dono APIs parallel call kar rahe hain
                const [ordersRes, paymentsRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/payments/history')
                ]);
                setOrders(ordersRes.data.data || []);
                setPayments(paymentsRes.data.data || []);
            } catch (error) {
                console.error("Error fetching retailer dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRetailerData();
    }, []);

    
    const totalOrderValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    const recentOrders = orders.slice(0, 5); 
    const recentPayments = payments.slice(0, 5); 

  return (
    <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
            <TopNavbar />
            
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                
                {/* Page Header */}
                <div className="mb-8">
                    <p className="text-sm text-slate-500 mt-1 font-medium">Welcome to your shop portal, <span className="font-bold text-slate-800">{user.name || user.phone}</span>!</p>
                    <h2 className="text-2xl font-extrabold text-slate-800 mt-1">My Shop Dashboard</h2>
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
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Ordered Value</p>
                                <h3 className="text-3xl font-black text-blue-600">₹{totalOrderValue.toLocaleString()}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Payments Recorded</p>
                                <h3 className="text-3xl font-black text-green-600">₹{totalPaid.toLocaleString()}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Orders</p>
                                <h3 className="text-3xl font-black text-slate-800">{orders.length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Orders Processing</p>
                                <h3 className="text-3xl font-black text-orange-500">{pendingOrders}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Orders Table */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
                                    <button onClick={() => navigate('/dashboard/my-orders')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                                <th className="p-4 font-semibold">Order ID</th>
                                                <th className="p-4 font-semibold">Rep Name</th>
                                                <th className="p-4 font-semibold">Amount</th>
                                                <th className="p-4 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-slate-700">
                                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                                <tr key={order._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                    <td className="p-4 font-mono text-xs font-bold text-slate-500">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                                    <td className="p-4 font-semibold text-slate-800">{order.repId?.name || 'Your Rep'}</td>
                                                    <td className="p-4 font-bold">₹{order.totalAmount}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="4" className="p-6 text-center text-slate-500">No orders found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="text-lg font-bold text-slate-800">My Payments</h3>
                                    <button onClick={() => navigate('/dashboard/my-payments')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                                <th className="p-4 font-semibold">Date</th>
                                                <th className="p-4 font-semibold">Mode</th>
                                                <th className="p-4 font-semibold">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-slate-700">
                                            {recentPayments.length > 0 ? recentPayments.map((payment) => (
                                                <tr key={payment._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                    <td className="p-4 font-medium text-slate-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-4 font-semibold text-slate-800 uppercase text-xs">{payment.paymentMode}</td>
                                                    <td className="p-4 font-bold text-green-600">+₹{payment.amount}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="3" className="p-6 text-center text-slate-500">No payments recorded yet.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
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

export default RetailerDashboard;
