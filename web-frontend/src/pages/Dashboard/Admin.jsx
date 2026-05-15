import React, { useState, useEffect } from 'react'
import Sidebar from '../../component/Sidebar';
import TopNavbar from '../../component/TopNavbar';
import Adddistributor from '../../component/Adddistributor'; 
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

function Admin() {
  const [isMounted, setIsMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [distributorCount, setDistributorCount] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    
    // Backend se real-time dashboard data fetch karna
    const fetchDashboardData = async () => {
      try {
        const [statsRes, distRes, ordersRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/admin/distributors'),
          api.get('/orders')
        ]);
        if (statsRes.data.success) setDashboardData(statsRes.data.data);
        if (distRes.data.success) setDistributorCount(distRes.data.count);
        if (ordersRes.data.success) setOrders(ordersRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchDashboardData();
  }, []);



  const createzone=async()=>{
    navigate('/createzone');
  }
  const createcompany=async()=>{
    navigate('/createcompany');
  }
 

  
 
  

 

  const statCards = [
    { title: 'Total Sales', value: `₹ ${dashboardData?.totalSales?.toLocaleString('en-IN') || '0'}`, valueColor: 'text-slate-800' },
    { title: 'Total Orders', value: dashboardData?.totalOrders?.toString() || '0', valueColor: 'text-slate-800' },
    { title: 'Total Outstanding', value: `₹ ${dashboardData?.totalOutstanding?.toLocaleString('en-IN') || '0'}`, valueColor: 'text-red-500' },
    { title: 'Active Distributors', value: distributorCount.toString(), valueColor: 'text-slate-800' },
  ];


  const topProductsData = dashboardData?.topProducts?.length > 0 
    ? dashboardData.topProducts.map(prod => ({ name: prod.name, quantity: prod.totalQuantitySold }))
    : [{ name: 'No Data', quantity: 0 }];

  const topRepsData = dashboardData?.topReps?.length > 0
    ? dashboardData.topReps.map(rep => ({ name: rep.repName, sales: rep.totalSales }))
    : [{ name: 'No Data', sales: 0 }];

  // Pie chart colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Naya Data: Sales Trend (Line Chart)
  const getSalesTrendData = () => {
    const trend = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      trend.push({ name: days[d.getDay()], dateStr: d.toDateString(), sales: 0 });
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt).toDateString();
      const trendDay = trend.find(t => t.dateStr === orderDate);
      if (trendDay) {
        trendDay.sales += order.totalAmount || 0;
      }
    });

    return trend;
  };
  const salesTrendData = getSalesTrendData();

  // Naya Data: Recent Orders Table
  const recentOrders = orders.slice(0, 5).map(order => ({
    id: `#${order._id.substring(order._id.length - 6).toUpperCase()}`,
    retailer: order.retailerId?.phone || order.retailerId?.name || 'Retailer Info',
    amount: `₹ ${order.totalAmount}`,
    status: order.status || 'pending',
    date: new Date(order.createdAt).toLocaleDateString('en-IN')
  }));
  const navigate = useNavigate();
const addDistributor = async(req,res)=>{
    navigate('/adddistributor');
}
const addRep = () => {
    navigate('/addrep');
}
const addProduct = () => {    
  navigate('/addproduct');
}

  return (
    <div className="flex h-screen bg-slate-50">
      
      <Sidebar />
      

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Page Header & Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              {/* <h2 className="text-2xl font-bold text-slate-800">Overview</h2> */}
              <p className="text-sm text-slate-500">Welcome back, here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={addProduct}   className="px-4 py-2 bg-blue-600 border border-slate-200 text-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                + Add Product
              </button>
              <button onClick = {addDistributor} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                + New Distributor
              </button>
              <button onClick={addRep} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                + New Rep
              </button>
              <button onClick = {createzone} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                + New Zone
              </button>
              <button onClick = { createcompany } className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                + New company
              </button>
              

            </div>
          </div>
          
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

          {/* Data Visualization Charts Section */}
          
          {/* Full Width Sales Trend Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Trend (Last 7 Days)</h3>
            <div className="h-72 w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Products - Bar Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Products (Quantity)</h3>
              <div className="h-72 w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="quantity" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Top Performing Reps (Sales)</h3>
              <div className="h-72 w-full flex items-center justify-center">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topRepsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="sales">
                      {topRepsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
              <button onClick={() => navigate('/dashboard/orders')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b border-slate-100">Order ID</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Retailer</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Date</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Amount</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  {recentOrders.length > 0 ? recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                      <td className="p-4 font-medium text-slate-900">{order.id}</td>
                      <td className="p-4">{order.retailer}</td>
                      <td className="p-4 text-slate-500">{order.date}</td>
                      <td className="p-4 font-bold">{order.amount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-700' :
                          order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No orders found.</td></tr>
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

export default Admin