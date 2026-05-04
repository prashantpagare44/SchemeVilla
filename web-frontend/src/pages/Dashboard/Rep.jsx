import React from 'react'

function Rep() {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">My Target Achieved</p>
                <h3 className="text-3xl font-extrabold text-green-600">0%</h3>
            </div>
        </div>
    </div>
  )
}

export default Rep