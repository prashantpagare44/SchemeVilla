import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AddRetailer() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const editData = location.state?.retailerData;
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [zones, setZones] = useState([]);
    
    const [formData, setFormData] = useState({
        shopName: '',
        phone: '',
        zoneId: '',
        otp: ''
    });
    
    const [step, setStep] = useState(1); // Step 1: Form, Step 2: OTP Verification
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const response = await api.get('/masterdata/zone');
                setZones(response.data.zones || []);
            } catch (error) {
                console.error("Error fetching zones", error);
            }
        };
        fetchZones();
    }, []);

    useEffect(() => {
        if (editData) {
            setIsEditing(true);
            setEditId(editData._id);
            setFormData({
                shopName: editData.shopName || '',
                phone: editData.userId?.phone || '',
                zoneId: editData.zone?._id || editData.zone || '',
                otp: ''
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Step 1: Send OTP to Retailer's Phone
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            // NOTE: Make sure aapka backend reproutes.js is '/rep/send-retailer-otp' route par map ho
            await api.post('/rep/send-retailer-otp', {
                phone: formData.phone,
                zoneId: formData.zoneId
            });
            setMessage({ type: 'success', text: `OTP sent successfully to +91 ${formData.phone}` });
            setStep(2); // Move to OTP input screen
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error sending OTP. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and Create Profile
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            // NOTE: Make sure aapka backend reproutes.js is '/rep/verify-retailer' route par map ho
            await api.post('/rep/verify-retailer', {
                phone: formData.phone,
                otp: formData.otp,
                shopName: formData.shopName,
                zoneId: formData.zoneId
            });
            
            setMessage({ type: 'success', text: 'Retailer onboarded successfully!' });
            setTimeout(() => navigate('/dashboard/retailers'), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid OTP or Error creating retailer.' });
        } finally {
            setLoading(false);
        }
    };

    // Direct Update form (No OTP required for updating)
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            await api.put(`/retailers/update-retailer/${editId}`, {
                shopName: formData.shopName,
                phone: formData.phone,
                zoneId: formData.zoneId
            });
            setMessage({ type: 'success', text: 'Retailer details updated successfully!' });
            setTimeout(() => navigate('/dashboard/retailers'), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating retailer.' });
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
                            Back to Retailers
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 w-full max-w-3xl mx-auto p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-slate-800">{isEditing ? 'Update Retailer' : 'Onboard New Retailer'}</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">{isEditing ? 'Modify retailer contact and zone details.' : 'Add a new shop owner to your network. An OTP will be sent to verify identity.'}</p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        {isEditing ? (
                            // ================= EDIT DETAILS FORM (No OTP Needed) =================
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Shop Name</label>
                                        <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Retailer Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign Zone</label>
                                    <select name="zoneId" value={formData.zoneId} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">-- Choose Zone --</option>
                                        {zones.map(z => <option key={z._id} value={z._id}>{z.name} - {z.city}</option>)}
                                    </select>
                                </div>
                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-md shadow-blue-200">
                                        {loading ? 'Updating...' : 'Update Retailer Details'}
                                    </button> 
                                </div>
                            </form>
                        ) : step === 1 ? (
                            // ================= STEP 1: Details =================
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Shop Name</label>
                                        <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="e.g. Sharma Kirana Store" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Retailer Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="10-digit mobile number" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign Zone</label>
                                    <select name="zoneId" value={formData.zoneId} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">-- Choose Zone --</option>
                                        {zones.map(z => (
                                            <option key={z._id} value={z._id}>{z.name} - {z.city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-md shadow-blue-200">
                                        {loading ? 'Sending OTP...' : 'Send OTP to Retailer'}
                                    </button> 
                                </div>
                            </form>
                        ) : (
                            // ================= STEP 2: OTP Verification =================
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Enter Verification Code</h3>
                                    <p className="text-sm text-slate-600 mb-6">Please ask the retailer for the OTP sent to <span className="font-bold">+91 {formData.phone}</span></p>
                                    
                                    <input type="text" name="otp" value={formData.otp} onChange={handleChange} required placeholder="Enter 6-digit OTP" className="w-full max-w-xs mx-auto text-center px-4 py-3 text-xl tracking-widest font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white block" />
                                </div>

                                <div className="pt-6 flex justify-between items-center">
                                    <button type="button" onClick={() => setStep(1)} className="text-slate-500 hover:text-blue-600 font-bold transition-colors">
                                        ← Back to Details
                                    </button>
                                    <button type="submit" disabled={loading || formData.otp.length < 4} className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-400 shadow-md shadow-green-200">
                                        {loading ? 'Verifying...' : 'Verify & Onboard'}
                                    </button> 
                                </div>
                            </form>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
