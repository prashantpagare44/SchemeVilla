import React from 'react';
import Sidebar from '../component/Sidebar';
import TopNavbar from '../component/TopNavbar';
import { useNavigate } from 'react-router-dom';

export default function Explore() {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-slate-50">
            
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-y-auto">
                    
                    {/* Hero Section */}
                    <div className="relative bg-blue-600 px-6 py-16 lg:px-12 lg:py-20 overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                        
                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 font-semibold text-sm mb-6 backdrop-blur-md">
                                <span>✨</span> Welcome to B2B Supply Chain Revolution! <span>🚀</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
                                Smarter B2B Supply Chain & Scheme Management
                            </h1>
                            <p className="text-blue-100 text-lg lg:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
                                A unified platform connecting Distributors, Sales Representatives, and Retailers. Track inventory, propose smart offers, and manage orders seamlessly in real-time.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 py-12 -mt-10 relative z-20">
                        {/* How It Works / Roles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6"></path></svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-800 mb-3">For Distributors</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    Manage your entire warehouse inventory, approve promotional schemes, and track your sales team's daily performance and revenue on a live dashboard.
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-800 mb-3">For Sales Reps</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    Expand your market reach. Onboard new retailers with OTP security, book real-time orders, collect payments, and propose custom discounts to boost sales.
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-800 mb-3">For Retailers</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    Get complete transparency over your shop's transactions. Track live order dispatch status, view your payment ledger, and grab exclusive active offers.
                                </p>
                            </div>
                        </div>

                        {/* Why Choose Us */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 lg:p-12 mb-12">
                            <h2 className="text-2xl font-extrabold text-slate-800 mb-8 text-center">Why B2B Supply chain?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Dynamic Scheme Engine</h4>
                                        <p className="text-sm text-slate-500 font-medium">Create Flat, Percentage, Free-item, or Combo offers specifically targeted to certain geographical zones.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Secure OTP Onboarding</h4>
                                        <p className="text-sm text-slate-500 font-medium">Retailers are verified via Twilio SMS OTPs, ensuring only authentic businesses join your supply network.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold">3</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Real-Time Inventory Sync</h4>
                                        <p className="text-sm text-slate-500 font-medium">Warehouse stock decreases automatically the moment a Sales Rep books an order in the field.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold">4</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Credit & Dues Management</h4>
                                        <p className="text-sm text-slate-500 font-medium">Record upfront cash or keep track of credit (Udhaar). Automatically reconcile dues when payments are collected.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pb-8">
                            <button onClick={() => navigate(-1)} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-md">
                                Go Back to Dashboard
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
