import React ,{ useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; 
import api from '../api/axiosConfig'; 
import Navbar from '../component/Navbar';
import BrandingPanel from '../component/BrandingPanel';
import Footer from '../component/Footer.jsx';   

function Login() {

    const [phone , setPhonenumber] = useState("");
    const [otp , setOtp] = useState('');
    const [ isLoading , setLoading ] = useState(false);
    const [step , setStep ] = useState(1); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]); 

    const handleSendOtp = async (e) => {
        e.preventDefault(); 
        
        if (phone.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        try {
            // Ab URL kitna chhota aur clean ho gaya dekho!
            const response = await api.post(`/auth/login`, { phone });
            toast.success(response.data.message || "OTP Sent!");
            setStep(2); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        
        if (otp.length < 4) {
            toast.error("Please enter a valid OTP");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/auth/verify-otp`, { phone, otp });
            
        
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            toast.success("Login Successful!");
            navigate('/dashboard'); 
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Toaster position="top-center" />
      
      <Navbar />    
      

      {/* Main Content Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        
        
        <BrandingPanel />   
        
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-slate-50 lg:bg-white relative">
          
          <div className="w-full max-w-md bg-white p-8 lg:p-0 rounded-3xl shadow-xl lg:shadow-none border border-slate-100 lg:border-none">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 mt-2 text-base font-medium">Please verify your identity to access your dashboard.</p>
            </div>

            {step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-bold">+91</span>
                            <input type="text" maxLength="10" value={phone} onChange={(e) => setPhonenumber(e.target.value.replace(/\D/g, ''))} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white text-slate-900 font-bold text-lg" placeholder="999 000 0000" />
                        </div>
                    </div>
                    <button disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-green-400 hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-lg">
                        {isLoading ? "Sending OTP..." : "Continue"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-700">Enter 6-Digit OTP</label>
                            <button type="button" onClick={() => setStep(1)} className="text-xs text-blue-600 hover:text-blue-800 font-bold transition-colors">Wrong number?</button>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 font-medium">We've sent a secure code to +91 {phone}</p>
                        <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3.5 text-center tracking-[0.75em] text-2xl rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white text-slate-900 font-extrabold" placeholder="••••••" />
                    </div>
                    
                    <button disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-green-400 hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-lg">
                        {isLoading ? "Verifying..." : "Verify & Secure Login"}
                    </button>
                </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
     <Footer/>
    </div>
  )
}

export default Login