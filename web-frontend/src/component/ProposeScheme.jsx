import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function ProposeScheme() {
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    
    const schemeFieldConfig = {
        flat: {
            label: 'Flat Discount (₹)',
            placeholder: 'e.g., 50',
            helpText: 'Enter the exact discount amount in Rupees.'
        },
        slab: {
            label: 'Discount Value',
            placeholder: 'e.g., 10',
            helpText: "Enter discount value. Describe slab (e.g., 'On purchase of 10 units') in Terms field."
        },
        combo: {
            label: 'Combo Offer Discount (₹)',
            placeholder: 'e.g., 100',
            helpText: "Enter total discount. Describe combo (e.g., 'Product A + Product B') in Terms field."
        },
        free: {
            label: 'Quantity of Free Item',
            placeholder: 'e.g., 1',
            helpText: "Enter the number of free units. Describe condition (e.g., 'On purchase of 5 units') in Terms field."
        }
    };

    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        schemeType: 'flat',
        discount: '',
        validFrom: new Date().toISOString().split('T')[0],
        expiryDate: '',
        terms: '',
        zoneIds: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, zoneRes] = await Promise.all([
                    api.get('/products/get-products'),
                    api.get('/masterdata/zone')
                ]);
                setProducts(prodRes.data.data || []);
                setZones(zoneRes.data.zones || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-fill product name when product is selected
        if (name === 'productId') {
            const selectedProduct = products.find(p => p._id === value);
            setFormData({ 
                ...formData, 
                productId: value, 
                productName: selectedProduct ? selectedProduct.name : '' 
            });
        } else if (name === 'zoneIds') {
            setFormData({ ...formData, zoneIds: [value] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Call backend API to create/propose scheme
            await api.post('/schemes/create-scheme', {
                productId: formData.productId,
                productName: formData.productName,
                schemeType: formData.schemeType,
                discount: Number(formData.discount),
                validFrom: formData.validFrom,
                expiryDate: formData.expiryDate,
                terms: formData.terms || 'Proposed by Rep',
                zoneIds: formData.zoneIds
            });

            setMessage({ type: 'success', text: 'Scheme proposed successfully! Waiting for Distributor approval.' });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.error || error.response?.data?.message || 'Error proposing scheme.' 
            });
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
                            <h2 className="text-2xl font-extrabold text-slate-800">Propose New Scheme</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Create a new offer for retailers. It will be active once approved by the distributor.</p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Product and Zone Selection Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Product</label>
                                    <select name="productId" value={formData.productId} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">-- Choose Product --</option>
                                        {products.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} (Price: ₹{p.price})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Zone</label>
                                    <select name="zoneIds" value={formData.zoneIds[0] || ''} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">-- Choose Zone --</option>
                                        {zones.map(z => (
                                            <option key={z._id} value={z._id}>{z.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Scheme Details Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Scheme Type</label>
                                    <select name="schemeType" value={formData.schemeType} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="flat">Flat Discount (₹)</option>
                                        <option value="slab">Slab Based</option>
                                        <option value="combo">Combo Offer</option>
                                        <option value="free">Free Item</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {schemeFieldConfig[formData.schemeType].label}
                                    </label>
                                    <input type="number" min="1" name="discount" value={formData.discount} onChange={handleChange} required placeholder={schemeFieldConfig[formData.schemeType].placeholder} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                                    <p className="text-xs text-slate-500 mt-1.5 px-1">{schemeFieldConfig[formData.schemeType].helpText}</p>
                                </div>
                            </div>

                            {/* Dates Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Valid From</label>
                                    <input type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date</label>
                                    <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required min={formData.validFrom || new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                                </div>
                            </div>

                            {/* Terms */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Reason / Terms & Conditions</label>
                                <input type="text" name="terms" value={formData.terms} onChange={handleChange} required placeholder="e.g. Festival demand is high, need to push sales." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-md shadow-blue-200">
                                    {loading ? 'Submitting...' : 'Propose Scheme'}
                                </button> 
                            </div>

                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
