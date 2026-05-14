import React,{ useState , useEffect } from 'react'
import api from '../api/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

function Reponboard() { 
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();
    const location = useLocation();
    
    const editData = location.state?.repData;
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [zones, setZones] = useState([]); 

    const [formData, setFormData] = useState({
        name: '',
        phone: '',  
        password: '',
        zoneIds: '' // Single zone select hoga
    });

    useEffect(() => {
        const fetchZones = async () => {
            try {         
                const response = await api.get('/masterdata/zone');
                setZones(response.data.zones || []); 
            } catch(error) {
                console.error('Error fetching zones:', error);
            }
        }
        fetchZones();
    }, []);

    useEffect(() => {
        if (editData) {
            setIsEditing(true);
            setEditId(editData._id);
            setFormData({
                name: editData.userId?.name || '',
                phone: editData.userId?.phone || '',
                password: '', // Kept empty for security
                zoneIds: editData.zoneIds?.[0]?._id || editData.zoneIds?.[0] || ''
            });
        }
    }, [editData]);

    const handleInputChange = (e) => {   
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {       
            const payload = {
                ...formData,
                zoneIds: [formData.zoneIds] 
            };
            if (!formData.password) delete payload.password; // Do not send empty password
            
            if (isEditing) {
                await api.put(`/admin/update-rep/${editId}`, payload);
                setMessage({ type: 'success', text: 'Sales Rep updated successfully!' });
            } else {
                await api.post('/admin/create-rep', payload);
                setMessage({ type: 'success', text: 'Sales Rep onboarded successfully!' });
            }
            
            setTimeout(() => {
                navigate('/manage-reps');
            }, 1500);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Error creating rep.' 
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

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 w-full max-w-4xl mx-auto p-8 lg:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-slate-800">{isEditing ? 'Update Sales Rep' : 'Onboard Sales Rep'}</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">{isEditing ? 'Modify details of your sales representative.' : 'Add a new representative to manage your assigned zones.'}</p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Amit Sales" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required pattern="[0-9]{10}" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder="10-digit mobile number" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">{isEditing ? 'New Password (Optional)' : 'Password'}</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required={!isEditing} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors" placeholder={isEditing ? 'Leave blank to keep current' : 'Create a password'} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Operating Zone</label>
                                    <select name="zoneIds" value={formData.zoneIds} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors">
                                        <option value="">-- Select Zone --</option>
                                        {zones.map(z => (
                                            <option key={z._id} value={z._id}>{z.name} - {z.city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:opacity-60 shadow-sm shadow-blue-200">
                                    {loading ? 'Saving...' : isEditing ? 'Update Rep' : 'Onboard Rep'}
                                </button> 
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Reponboard;