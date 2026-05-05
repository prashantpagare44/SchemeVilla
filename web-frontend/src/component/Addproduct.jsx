import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    distributorId: ''
  });

  const [products, setProducts] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tableError, setTableError] = useState(null);
  
  // State for tracking Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [prodRes, distRes] = await Promise.all([
        api.get('/products/get-products'),
        api.get('/admin/distributors') // Make sure this route is working
      ]);
      setProducts(prodRes.data.data || []);
      setDistributors(distRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isEditing) {
        await api.put(`/products/update-product/${editId}`, formData);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await api.post('/products/create-product', formData);
        setMessage({ type: 'success', text: 'Product created successfully!' });
      }

      // Reset Form after success
      setFormData({ name: '', sku: '', price: '', distributorId: '' });
      setIsEditing(false);
      setEditId(null);
      fetchData(); // Refresh the table

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error processing product.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      distributorId: product.distributorId?._id || product.distributorId || ''
    });
    setIsEditing(true);
    setEditId(product._id);
    // Smooth scroll to top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(`/products/delete-product/${id}`);
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
      fetchData(); // Refresh table
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting product.' });
    }
  };

  const cancelEdit = () => {
    setFormData({ name: '', sku: '', price: '', distributorId: '' });
    setIsEditing(false);
    setEditId(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      
      {/* Top Action Bar */}
      <div className="w-full max-w-6xl mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </button>
      </div>

      {/* Top Section: Split Layout (Image + Form) */}
      <div className="bg-white max-w-6xl w-full rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row mb-8">
        
        {/* Left Side: Product Theme Image */}
        <div className="hidden md:flex w-1/2 bg-blue-600 relative items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 to-transparent"></div>
          
          <div className="relative z-10 text-white text-center mt-auto pb-8">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-6 border border-white/30 shadow-lg">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
             </div>
             <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Product Catalog</h2>
             <p className="text-blue-100 text-sm font-medium px-4 leading-relaxed">
                Manage your inventory efficiently. Add new items, update pricing, or remove outdated products from the central database.
             </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-extrabold text-slate-800">{isEditing ? 'Update Product' : 'Add New Product'}</h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">{isEditing ? 'Modify existing product details below.' : 'Register a new product into the system.'}</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Parle-G 100g" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">SKU Code</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. PARLE-001" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
                <input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Distributor</label>
                <select name="distributorId" value={formData.distributorId} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors">
                  <option value="">-- Select Distributor --</option>
                  {distributors.map(d => (
                    <option key={d._id} value={d.userId?._id}>{d.userId?.name || 'Unknown'} - {d.companyId?.name}</option>
                  ))}
                </select>
              </div>
            </div>
            

            <div className="flex items-center justify-end gap-3 pt-4">
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                  Cancel Edit
                </button>
              )}
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:opacity-60 shadow-sm shadow-blue-200">
                {loading ? 'Processing...' : isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section: Database Database Table */}
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">All Products</h3>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{products.length} Items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Distributor</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {tableError ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-red-500 font-semibold">{tableError}</td>
                </tr>
              ) : products.length > 0 ? products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-none">
                  <td className="p-4 font-medium text-slate-900">{product.name}</td>
                  <td className="p-4 font-mono text-slate-500">{product.sku}</td>
                  <td className="p-4 font-bold text-slate-800">₹{product.price}</td>
                  <td className="p-4">{product.distributorId?.name || 'Unknown'}</td>
                  <td className="p-4 flex gap-4 justify-end">
                    <button 
                      onClick={() => handleEdit(product)} 
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)} 
                      className="font-semibold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No products found in the database. Add one above!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AddProduct;