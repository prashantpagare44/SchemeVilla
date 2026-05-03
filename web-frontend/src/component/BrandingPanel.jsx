import React from 'react'

function BrandingPanel() {
  return (
    <div className="hidden lg:flex flex-col w-1/2 bg-blue-400 mb-2 mt-2 mx-2 text-white p-16 relative overflow-hidden justify-center ">
        
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          
          <div className="absolute -bottom-32 -left-32 w-120 h-120 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-0 -right-20 w-[20rem] h-80 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
          
          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-extrabold leading-tight mb-6">Streamline your B2B Supply Chain.</h1>
            <p className="text-blue-100 text-xl font-medium leading-relaxed mb-8">Manage exclusive schemes, track high-volume orders, and boost your retail network efficiency all from one unified dashboard.</p>
            <div className="flex items-center gap-4 text-sm font-semibold text-blue-200">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> Secure Network</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> Fast Operations</span>
            </div>
          </div>
        </div>

  )
}

export default BrandingPanel