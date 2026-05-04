import React from 'react'
import Sidebar from '../../component/Sidebar';
import TopNavbar from '../../component/TopNavbar';

function Admin() {
  const statCards = [
    { title: 'Total Sales', value: '₹ 0.00', valueColor: 'text-slate-800' },
    { title: 'Total Orders', value: '0', valueColor: 'text-slate-800' },
    { title: 'Total Outstanding', value: '₹ 0.00', valueColor: 'text-red-500' },
    { title: 'Active Distributors', value: '0', valueColor: 'text-slate-800' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      
      <Sidebar />
      

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center"
              >
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <h3 className={`text-3xl font-extrabold ${stat.valueColor}`}>
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Admin