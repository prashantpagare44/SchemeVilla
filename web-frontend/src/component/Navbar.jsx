import React from 'react'

function Navbar() {
  return (
   <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            S
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">B2B Supply Chain</span>
        </div>
        <div className="hidden sm:block text-sm font-bold text-slate-400 uppercase tracking-wider">
          B2B Trade Portal
        </div>
      </nav>
  )
}

export default Navbar