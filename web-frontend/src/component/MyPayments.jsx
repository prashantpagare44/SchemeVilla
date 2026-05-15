import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function MyPayments() {
    const navigate = useNavigate();
    
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchPayments = async () => {
            try {
                const response = await api.get('/payments/history');
                setPayments(response.data.data || []);
            }catch(error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments(); 
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
                        <h2 className="text-2xl font-extrabold text-slate-800">My Payments</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Track your complete payment history, mode, and dates here.</p>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Payment Records</h3>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{payments.length} Transactions</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">Paid To (Rep)</th>
                                        <th className="p-4 font-semibold">Mode</th>
                                        <th className="p-4 font-semibold">Remarks</th>
                                        <th className="p-4 font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center font-medium text-slate-500">Loading your payment history...</td></tr>
                                    ) : payments.length > 0 ? (
                                        payments.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                <td className="p-4 font-medium text-slate-700">{new Date(payment.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td className="p-4 font-bold text-slate-900">{payment.repId?.name || 'Unknown Rep'}</td>
                                                <td className="p-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border border-slate-200">{payment.paymentMode}</span></td>
                                                <td className="p-4 text-slate-500 italic text-xs">{payment.remarks || '-'}</td>
                                                <td className="p-4 font-black text-green-600">₹{payment.amount}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500">No payment records found.</td></tr>
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
