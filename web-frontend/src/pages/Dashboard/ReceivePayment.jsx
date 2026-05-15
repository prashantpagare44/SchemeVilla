import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Sidebar from '../../component/Sidebar';
import TopNavbar from '../../component/TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function ReceivePayment() {
    const navigate = useNavigate();
    
    const [retailers, setRetailers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        retailerId: '',
        amount: '',
        paymentMode: 'cash',
        remarks: ''
    });

    // 1. Fetch Retailers on Load
    useEffect(() => {
        const fetchRetailers = async () => {
            try {
                const response = await api.get('/retailers');
                setRetailers(response.data.data || []);
            } catch (error) {
                console.error("Error fetching retailers:", error);
            }
        };
        fetchRetailers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/payments/record', {
                retailerId: formData.retailerId,
                amount: Number(formData.amount),
                paymentMode: formData.paymentMode,
                remarks: formData.remarks
            });
            setMessage({ type: 'success', text: 'Payment collected and recorded successfully!' });
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error recording payment. Check API.' });
        } finally {
            setLoading(false);
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

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 w-full max-w-3xl mx-auto p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-slate-800">Receive Payment</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Collect and record payments from your assigned retailers.</p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Retailer Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Retailer</label>
                                <select name="retailerId" value={formData.retailerId} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value="">-- Choose Retailer --</option>
                                    {retailers.map(r => (
                                        <option key={r._id} value={r.userId?._id}>
                                            {r.shopName || r.userId?.name} (Dues: ₹{r.outstandingAmount || 0})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Amount (₹)</label>
                                    <input type="number" min="1" name="amount" value={formData.amount} onChange={handleChange} required placeholder="e.g., 5000" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Mode</label>
                                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="cash">💵 Cash</option>
                                        <option value="upi">📱 UPI / Online</option>
                                        <option value="bank">🏦 Bank Transfer (NEFT/RTGS)</option>
                                        <option value="cheque">📝 Cheque</option>
                                    </select>
                                </div>
                            </div>

                            {/* Remarks */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Remarks / Notes (Optional)</label>
                                <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="e.g. Cleared dues for Invoice #ORD-XXX" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <button type="submit" disabled={loading} className="px-10 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-400 shadow-md shadow-green-200">
                                    {loading ? 'Processing...' : 'Record Payment'}
                                </button> 
                            </div>

                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}