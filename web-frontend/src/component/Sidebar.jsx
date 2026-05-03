import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MENU_ITEMS = {
    admin: [
        { name: 'Overview', path: '/dashboard' },
        { name: 'Manage Distributors', path: '/dashboard/distributors' },
        { name: 'Master Data', path: '/dashboard/master-data' },
    ],
    distributor: [
        { name: 'Overview', path: '/dashboard' },
        { name: 'Inventory', path: '/dashboard/inventory' },
        { name: 'Orders', path: '/dashboard/orders' },
        { name: 'Schemes', path: '/dashboard/schemes' },
        { name: 'My Reps', path: '/dashboard/reps' },
    ],
    rep: [
        { name: 'Overview', path: '/dashboard' },
        { name: 'My Retailers', path: '/dashboard/retailers' },
        { name: 'Create Order', path: '/dashboard/create-order' },
        { name: 'Propose Scheme', path: '/dashboard/propose-scheme' },
    ],
    retailer: [
        { name: 'Overview', path: '/dashboard' },
        { name: 'My Orders', path: '/dashboard/my-orders' },
        { name: 'Available Schemes', path: '/dashboard/available-schemes' },
    ]
};

function Sidebar() {
    const location = useLocation(); 
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user?.role || 'retailer'; 

    const menuLinks = MENU_ITEMS[userRole] || [];

    return (
       <aside className="w-64 bg-white text-slate-900 h-screen flex flex-col border-r border-slate-200 shrink-0 sticky top-0">
    {/* Header / Logo Section */}
    <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-200">S</div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Scheme-Vila</h2>
        </div>
        <p className="text-xs text-blue-600 mt-2 font-semibold uppercase tracking-wider">{userRole} Portal</p>
    </div>
    
    {/* Navigation Menu */}
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</p>
        {menuLinks.map((item, index) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            
            return (
                <Link 
                    key={index} 
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                        isActive 
                        ? 'bg-blue-50 text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                    {item.name}
                </Link>
            )
        })}
    </nav>

    {/* User Profile Section */}
    <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-inner">
                {user.role ? user.role.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name || user.phone || 'User'}</p>
                <p className="text-xs text-slate-500 capitalize font-medium">{userRole}</p>
            </div>
        </div>
    </div>
</aside>
    );
}

export default Sidebar;
