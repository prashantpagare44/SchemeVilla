import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Adddistributer from './component/Adddistributor.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import CreateZone from './component/CreateZone.jsx';
import CreateCompany from './component/CreateCompany.jsx';

import './App.css'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
       /> 
       <Route path="/" element={<Navigate to="/dashboard" replace />} />
       <Route path="/adddistributor" element={<Adddistributer />} />
       <Route path="/createzone" element={<CreateZone />} />
       <Route path="/createcompany" element={<CreateCompany />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
