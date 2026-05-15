import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TopNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  

  // Get user details from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
  };
const chat = ()=>{
  navigate('/chat');
}
  // Dynamic title based on the current URL
  const getPageTitle = () => {
      const path = location.pathname;
      if(path === '/dashboard') return 'Overview';
      if(path.includes('inventory')) return 'Inventory';
      if(path.includes('orders')) return 'Orders';
      if(path.includes('schemes')) return 'Schemes';
      if(path.includes('reps')) return 'My Reps';
      if(path.includes('retailers')) return 'My Retailers';
      if(path.includes('create-order')) return 'Create Order';
      if(path.includes('propose-scheme')) return 'Propose Scheme';
      if(path.includes('distributors')) return 'Manage Distributors';
      if(path.includes('companies')) return 'Manage Companies';
      if(path.includes('products')) return 'Manage Products';
      return 'Dashboard';
  };

  // Dynamic Explore Button Logic
  const handleExplore = () => {
      navigate('/dashboard/explore')
  };


  return (
    <header className="w-full h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40 shrink-0">
      
    
      <div className="flex flex-col justify-center min-w-50">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{getPageTitle()}</h1>
          <p className="text-xs text-slate-500 font-semibold capitalize tracking-wide">{user.role || 'User'} Portal</p>
      </div>


      <div className="flex-1 hidden md:flex items-center justify-center mx-4">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-600 tracking-wide flex items-center">
                  System  <span className="text-slate-300 mx-3">|</span> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
          </div>
      </div>

      
      <div className="flex items-center gap-2">
        
    
        <button onClick={handleExplore} className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all">
          <span className="text-lg">✨</span>
          <span>Explore</span>
        </button>

    
        <button onClick ={chat} className="relative p-2.5 rounded-full text-slate-600 hover:bg-slate-50 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        
        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        
        <div className="flex items-center gap-1">
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-default">
            <span className="text-sm font-bold text-slate-700 hidden md:block">{user.name || user.phone || 'User'}</span>
            <div className="w-9 h-9 bg-linear-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm uppercase">
                {user.role ? user.role.charAt(0) : 'U'}
            </div>
            </button>
            
        
            <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" title="Logout">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;