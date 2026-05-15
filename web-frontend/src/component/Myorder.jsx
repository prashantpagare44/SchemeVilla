import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function Myorder() {
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data.data || []);
            }catch(error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders(); 
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

                    <div className="mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-800">My Orders</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Track all your past and pending orders here.</p>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Order History</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{orders.length} Orders</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Order ID</th>
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">Sales Rep</th>
                                        <th className="p-4 font-semibold">Products (Qty)</th>
                                        <th className="p-4 font-semibold">Amount / Type</th>
                                        <th className="p-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="6" className="p-8 text-center font-medium text-slate-500">Loading your orders...</td></tr>
                                    ) : orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                <td className="p-4 font-mono text-xs font-bold text-slate-500">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                                <td className="p-4 font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{order.repId?.name || 'Your Rep'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        {order.products?.map((prod, idx) => (
                                                            <span key={idx} className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded w-max border border-slate-200">
                                                                {prod.name} <span className="text-blue-600 font-bold ml-1">x{prod.quantity}</span> <span className="text-green-600 font-bold ml-1">(₹{prod.price}/item)</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-800">₹{order.totalAmount}</div>
                                                    <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${order.orderType === 'credit' ? 'text-red-500' : 'text-green-500'}`}>{order.orderType}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {order.status || 'pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">No orders found. Ask your Sales Rep to place an order!</td></tr>
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