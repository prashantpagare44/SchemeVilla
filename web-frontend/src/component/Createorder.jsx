import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function CreateOrder() {
    const navigate = useNavigate();
    
    // Dropdown Data States
    const [retailers, setRetailers] = useState([]);
    const [products, setProducts] = useState([]);
    const [schemes, setSchemes] = useState([]);
    
    // Form States
    const [selectedRetailer, setSelectedRetailer] = useState('');
    const [orderType, setOrderType] = useState('upfront');
    const [selectedScheme, setSelectedScheme] = useState('');
    
    // Dynamic Order Items: Array of objects { productId, quantity }
    const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1 }]);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Fetch Master Data on Load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [retRes, prodRes, schemeRes] = await Promise.all([
                    api.get('/retailers'),
                    api.get('/products/get-products'),
                    api.get('/schemes/get-schemes')
                ]);
                setRetailers(retRes.data.data || []);
                setProducts(prodRes.data.data || []);
                setSchemes(schemeRes.data.data || []);
            } catch (error) {
                console.error("Error fetching data for order form:", error);
            }
        };
        fetchData();
    }, []);

    // 2. Handle Dynamic Product Rows
    const handleItemChange = (index, field, value) => {
        const newItems = [...orderItems];
        newItems[index][field] = value;
        setOrderItems(newItems);
    };

    const addItemRow = () => {
        setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
    };

    const removeItemRow = (index) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    // 3. Live Total Calculation
    const calculateTotal = () => {
        let total = 0;
        orderItems.forEach(item => {
            if (item.productId && item.quantity) {
                const product = products.find(p => p._id === item.productId);
                if (product) total += (product.price * item.quantity);
            }
        });

        // Scheme Discount apply karein
        if (selectedScheme) {
            const scheme = schemes.find(s => s._id === selectedScheme);
            if (scheme && scheme.schemeType === 'flat') {
                 total -= scheme.discount;
            } else if (scheme && scheme.schemeType === 'slab' || scheme?.schemeType === 'percentage') {
                 total -= (total * (scheme.discount / 100));
            }
        }
        return total > 0 ? total : 0;
    };

    // 4. Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Validation: Clean empty rows
        const validProducts = orderItems
            .filter(item => item.productId && item.quantity > 0)
            .map(item => ({ productId: item.productId, quantity: Number(item.quantity) }));

        if (validProducts.length === 0) {
            setMessage({ type: 'error', text: 'Please add at least one valid product with quantity.' });
            setLoading(false);
            return;
        }

        const payload = {
            retailerId: selectedRetailer,
            products: validProducts,
            orderType: orderType,
            schemeId: selectedScheme || undefined
        };

        try {
            await api.post('/orders/create-order', payload);
            setMessage({ type: 'success', text: 'Order booked successfully!' });
            setTimeout(() => navigate('/dashboard/orders'), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error booking order.' });
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

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 w-full max-w-5xl mx-auto p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-slate-800">Book New Order</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Select retailer, add products, and apply offers.</p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Section 1: Basic Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Retailer</label>
                                    <select value={selectedRetailer} onChange={(e) => setSelectedRetailer(e.target.value)} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">-- Choose Retailer --</option>
                                        {retailers.map(r => (
                                            <option key={r._id} value={r.userId?._id}>{r.shopName || r.userId?.name} ({r.userId?.phone})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Type</label>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors ${orderType === 'upfront' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                                            <input type="radio" name="orderType" value="upfront" checked={orderType === 'upfront'} onChange={() => setOrderType('upfront')} className="hidden" />
                                            <span className="font-bold">💵 Cash (Upfront)</span>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors ${orderType === 'credit' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                                            <input type="radio" name="orderType" value="credit" checked={orderType === 'credit'} onChange={() => setOrderType('credit')} className="hidden" />
                                            <span className="font-bold">📒 Udhaar (Credit)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Products */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Order Items</h3>
                                </div>
                                <div className="space-y-3">
                                    {orderItems.map((item, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-end">
                                            <div className="flex-1 w-full">
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Product</label>
                                                <select value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                                                    <option value="">Select Product...</option>
                                                    {products.map(p => (
                                                        <option key={p._id} value={p._id} disabled={p.stock < 1}>
                                                            {p.name} - ₹{p.price} {p.stock < 1 ? '(Out of Stock)' : `(${p.stock} left)`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-full sm:w-32">
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Quantity</label>
                                                <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white text-sm" />
                                            </div>
                                            {orderItems.length > 1 && (
                                                <button type="button" onClick={() => removeItemRow(index)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl border border-transparent transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addItemRow} className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                                    + Add Another Product
                                </button>
                            </div>

                            {/* Section 3: Schemes & Total */}
                            <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="w-full md:w-1/2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Apply Scheme / Offer (Optional)</label>
                                    <select value={selectedScheme} onChange={(e) => setSelectedScheme(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">-- No Scheme Applied --</option>
                                        {schemes.map(s => (
                                            <option key={s._id} value={s._id}>{s.productName} ({s.schemeType === 'flat' ? `₹${s.discount} Off` : `${s.discount}% Off`})</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="w-full md:w-1/3 bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Estimated Total</p>
                                    <h3 className="text-4xl font-black">₹{calculateTotal().toLocaleString('en-IN')}</h3>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button type="submit" disabled={loading || !selectedRetailer} className="px-10 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-md shadow-blue-200 text-lg">
                                    {loading ? 'Processing...' : 'Confirm & Book Order'}
                                </button> 
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
