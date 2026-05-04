import React from 'react'
import Sidebar from '../../component/Sidebar'
import TopNavbar from '../../component/TopNavbar';

function Distributor() {
  return (
    <>
     <TopNavbar/>  
     <Sidebar/>
    
    
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">My Total Sales</p>
                <h3 className="text-3xl font-extrabold text-slate-800">₹ 0.00</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Orders</p>
                <h3 className="text-3xl font-extrabold text-orange-500">0</h3>
            </div>
        </div>
    </div>
    </>
  )
}

export default Distributor