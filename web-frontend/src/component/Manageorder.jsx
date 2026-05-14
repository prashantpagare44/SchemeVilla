import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

function Manageorder() {
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal ke liye states
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(()=>{
        const fetchOrders = async () => {
            try {
        
                const response = await api.get('/orders');
                setOrders(response.data.data || []);
            }catch(error)
            {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders(); 
    }, []); 

    // Modal Open/Close handlers
    const openModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status); // Default status jo abhi hai
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };
    const handleStatusUpdate = async () => {
        setUpdateLoading(true);
        try {
            await api.put('/orders/update-status', { orderId: selectedOrder._id, status: newStatus });
            
            setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, status: newStatus } : o));
            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update order status");
        } finally {
            setUpdateLoading(false);
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

                
                <div className="mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-800">Manage Orders</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">View and track all incoming retailer orders here.</p>
                </div>
                
            
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-800">All Orders</h3>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{orders.length} Orders</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 font-semibold">Order ID</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold">Retailer / Rep</th>
                                    <th className="p-4 font-semibold">Amount / Type</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-8 text-center font-medium text-slate-500">Loading orders...</td></tr>
                                ) : orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                            <td className="p-4 font-mono text-xs font-bold text-slate-500">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                            <td className="p-4 font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900">{order.retailerId?.phone || 'Retailer Info'}</div>
                                                <div className="text-xs text-slate-500">Rep: {order.repId?.name || 'Unknown'}</div>
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
                                            <td className="p-4 text-right">
                                                <button onClick={() => openModal(order)} className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="p-8 text-center text-slate-500">No orders found. Wait for Sales Reps to place orders!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>

        
        {isModalOpen && selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    
                
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800">Order Details</h2>
                            <p className="text-xs text-slate-500 font-mono mt-1">#{selectedOrder._id}</p>
                        </div>
                        <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    
                    <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Retailer</p>
                                <p className="font-bold text-slate-800">{selectedOrder.retailerId?.phone || 'Retailer Info'}</p>
                                <p className="text-xs text-slate-500 mt-1">Booked by: {selectedOrder.repId?.name || 'Unknown Rep'}</p>
                            </div>
                            <div className={`p-4 rounded-2xl border ${selectedOrder.orderType === 'credit' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Order Amount</p>
                                <p className="text-2xl font-black">₹{selectedOrder.totalAmount}</p>
                                <p className="text-xs font-bold uppercase mt-1 opacity-80">{selectedOrder.orderType} Payment</p>
                            </div>
                        </div>

                        
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 mb-3">Items Ordered</h3>
                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                {selectedOrder.products.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                                            <p className="text-xs text-slate-500">₹{item.price} × {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-slate-700">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Update Journey Status</label>
                            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700">
                                <option value="pending">🟡 Pending (New Order)</option>
                                <option value="accepted">🔵 Accepted (Stock Verified)</option>
                                <option value="dispatched">🚚 Dispatched (Out for Delivery)</option>
                                <option value="delivered">🟢 Delivered (Received by Retailer)</option>
                                <option value="cancelled">🔴 Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                        <button onClick={closeModal} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
                        <button onClick={handleStatusUpdate} disabled={updateLoading || newStatus === selectedOrder.status} className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-200">
                            {updateLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Manageorder