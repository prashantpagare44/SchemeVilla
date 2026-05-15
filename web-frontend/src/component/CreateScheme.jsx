import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

function CreateScheme() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const editData = location.state?.schemeData;
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Helper object for dynamic form fields (Same as Rep's ProposeScheme)
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
        productName: '',
        schemeType: 'flat', 
        discount: '',
        terms: '',
        validFrom: '',
        expiryDate: '',
        zoneIds: []
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [products, setProducts] = useState([]);

    // Fetch existing products to show in suggestions
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/get-products');
                setProducts(response.data.data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (editData) {
            setIsEditing(true);
            setEditId(editData._id);
            setFormData({
                productName: editData.productName,
                schemeType: editData.schemeType,
                discount: editData.discount,
                terms: editData.terms || '',
                validFrom: new Date(editData.validFrom).toISOString().split('T')[0],
                expiryDate: new Date(editData.expiryDate).toISOString().split('T')[0],
                zoneIds: editData.zoneIds || []
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (isEditing) {
                await api.put(`/schemes/update-scheme/${editId}`, { ...formData, discount: Number(formData.discount) });
                setMessage({ type: 'success', text: 'Scheme successfully updated!' });
            } else {
                await api.post('/schemes/create-scheme', { ...formData, discount: Number(formData.discount) });
                setMessage({ type: 'success', text: 'Scheme successfully created!' });
            }
            setTimeout(() => {
                navigate('/dashboard/schemes');
            }, 1500);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || error.response?.data?.message || 'Error creating scheme. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-slate-50">
            
            
            <div className="flex flex-col flex-1 overflow-hidden">
                
                
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="w-full mb-6">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-max">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 w-full max-w-4xl mx-auto p-8 lg:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-slate-800">{isEditing ? 'Update Scheme' : 'Create New Scheme'}</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">{isEditing ? 'Modify promotional details.' : 'Design promotional offers and targets for your retailers to boost sales.'}</p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                                    <input type="text" name="productName" list="product-list" value={formData.productName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Parle-G 100g" />
                                    <datalist id="product-list">
                                        {products.map(p => (
                                            <option key={p._id} value={p.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Scheme Type</label>
                                    <select name="schemeType" value={formData.schemeType} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors">
                                        <option value="flat">Flat Discount (₹)</option>
                                        <option value="slab">Slab Based</option>
                                        <option value="combo">Combo Offer</option>
                                        <option value="free">Free Item</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        {schemeFieldConfig[formData.schemeType]?.label || 'Scheme Value / Discount'}
                                    </label>
                                    <input type="number" min="1" name="discount" value={formData.discount} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder={schemeFieldConfig[formData.schemeType]?.placeholder || "e.g. 10"} />
                                    <p className="text-xs text-slate-500 mt-1.5 px-1">{schemeFieldConfig[formData.schemeType]?.helpText}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Terms & Conditions</label>
                                    <input type="text" name="terms" value={formData.terms} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="Enter scheme terms..." />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Valid From</label>
                                    <input type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label>
                                    <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:opacity-60 shadow-sm shadow-blue-200">
                                    {loading ? 'Saving...' : isEditing ? 'Update Scheme' : 'Create Scheme'}
                                </button> 
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CreateScheme; 