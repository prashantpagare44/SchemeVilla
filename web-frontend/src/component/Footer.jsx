import React from 'react'

function Footer() {
  return (
   <div className="max-w-7xl mx-auto mt-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">SV</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Scheme-Vila</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Optimizing B2B supply chains with intelligent monitoring and 
              seamless trade portal solutions.
            </p>
            <div className="flex gap-4 mt-6">
            
              <div className="w-5 h-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer transition-all"></div>
              <div className="w-5 h-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer transition-all"></div>
              <div className="w-5 h-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer transition-all"></div>
            </div>
          </div>

    
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">Product</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Trade Portal</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Supply Chain AI</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">DevX Monitoring</a></li>
            </ul>
          </div>

      
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>

  
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">Support</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

      
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Scheme-Vila Trade Portal. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
  )
}

export default Footer