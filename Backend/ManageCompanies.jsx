import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function ManageCompanies() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/masterdata/company');
                setCompanies(response.data.companies || []);
            } catch (error) {
                console.error("Error fetching companies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies(); 
    }, []); 

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this company?")) return;
        try {
            await api.delete(`/masterdata/company/${id}`);
            setCompanies(companies.filter(c => c._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || "Error deleting company");
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
                            <h2 className="text-2xl font-extrabold text-slate-800">Listed Companies</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">View all registered companies and their assigned zones.</p>
                        </div>
                        <button onClick={() => navigate('/createcompany')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 whitespace-nowrap">
                            + Add New Company
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Company Network</h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{companies.length} Companies</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-semibold">Company Name</th>
                                        <th className="p-4 font-semibold">Zones Assigned</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan="3" className="p-8 text-center font-medium text-slate-500">Loading companies...</td></tr>
                                    ) : companies.length > 0 ? (
                                        companies.map((company) => (
                                            <tr key={company._id} className="hover:bg-slate-50/70 border-b border-slate-100 last:border-none transition-colors">
                                                <td className="p-4 font-bold text-slate-900">{company.name}</td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {company.zoneIds?.map((z, i) => (
                                                            <span key={i} className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded w-max border border-slate-200">
                                                                {z.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleDelete(company._id)} className="text-red-500 hover:text-red-700 font-bold text-xs transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="p-8 text-center text-slate-500">No Companies found.</td></tr>
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
