import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function ManageProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/get-products');
                setProducts(response.data.data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts(); 
    }, []); 

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/delete-product/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || "Error deleting product");
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    
                    <div className="w-full mb-6">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-max">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">Listed Products</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">View and manage all products available in the system.</p>
                        </div>
                        <button onClick={() => navigate('/addproduct')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 whitespace-nowrap">
                            + Add New Product
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Product Inventory</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{products.length} Products</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">SKU</th>
                                        <th className="p-4 font-semibold">Product Name</th>
                                        <th className="p-4 font-semibold">Price</th>
                                        <th className="p-4 font-semibold">Stock</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center font-medium text-slate-500">Loading products...</td></tr>
                                    ) : products.length > 0 ? (
                                        products.map((product) => (
                                            <tr key={product._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                <td className="p-4 font-mono text-xs font-bold text-slate-500">{product.sku}</td>
                                                <td className="p-4 font-bold text-slate-900">{product.name}</td>
                                                <td className="p-4 font-bold text-green-600">₹{product.price}</td>
                                                <td className="p-4 font-semibold text-slate-700">{product.stock}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 font-bold text-xs transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500">No Products found.</td></tr>
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
