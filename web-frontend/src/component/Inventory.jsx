import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function Inventory() {
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [addQuantity, setAddQuantity] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchInventory = async () => {
        try {
            const response = await api.get('/products/get-products');
            setProducts(response.data.data || []);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
        setAddQuantity('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        if (!addQuantity || addQuantity <= 0) return alert("Please enter a valid quantity!");
        
        setUpdateLoading(true);
        try {
            // Naya stock = Purana stock + Nayi quantity
            const newStockAmount = selectedProduct.stock + Number(addQuantity);
            
            await api.put(`/products/update-product/${selectedProduct._id}`, { stock: newStockAmount });
            
            // Refresh table locally for speed
            setProducts(products.map(p => p._id === selectedProduct._id ? { ...p, stock: newStockAmount } : p));
            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update stock");
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
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">Warehouse Inventory</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Monitor product stock levels and add incoming stock.</p>
                        </div>
                        <button onClick={() => navigate('/addproduct')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                            + Add New Product
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Current Stock</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{products.length} Products</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Product Name</th>
                                        <th className="p-4 font-semibold">SKU Code</th>
                                        <th className="p-4 font-semibold">Price</th>
                                        <th className="p-4 font-semibold">Available Stock</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center font-medium text-slate-500">Loading inventory...</td></tr>
                                    ) : products.length > 0 ? (
                                        products.map((product) => (
                                            <tr key={product._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                <td className="p-4 font-bold text-slate-900">{product.name}</td>
                                                <td className="p-4 font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded w-max">{product.sku}</td>
                                                <td className="p-4 font-bold text-slate-800">₹{product.price}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1.5 rounded-lg font-extrabold text-sm ${product.stock > 100 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                        {product.stock} Units
                                                    </span>
                                                    {product.stock <= 50 && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">Low Stock Alert!</p>}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => openModal(product)} className="text-blue-600 hover:text-white font-bold text-xs bg-blue-50 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors border border-blue-100">
                                                        + Add Stock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500">No products found in your inventory.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Stock Modal */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-extrabold text-slate-800">Update Stock</h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">Add new incoming stock to <span className="font-bold text-slate-800">{selectedProduct.name}</span></p>
                        </div>
                        <form onSubmit={handleAddStock} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Enter Quantity Received</label>
                                <input type="number" min="1" value={addQuantity} onChange={(e) => setAddQuantity(e.target.value)} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-lg" placeholder="e.g. 500" />
                                <p className="text-xs text-slate-500 mt-2">Current Stock: {selectedProduct.stock} units</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                                <button type="submit" disabled={updateLoading} className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm shadow-blue-200">
                                    {updateLoading ? 'Saving...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
