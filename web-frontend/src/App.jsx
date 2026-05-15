import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Adddistributer from './component/Adddistributor.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import CreateZone from './component/CreateZone.jsx';
import CreateCompany from './component/CreateCompany.jsx';
import Chat from './component/Chat.jsx';
import AddRep from './component/AddRep.jsx';
import Addproduct from './component/Addproduct.jsx';
import Managedistributor from './pages/Managedistributor.jsx';
import Masterdatamanagement from './pages/Masterdatamanagement.jsx';
import CreateScheme from './component/CreateScheme.jsx';
import ManageScheme from './component/ManageScheme.jsx';
import DistributorDashboard from './pages/DistributorDashboard.jsx';
import Reponboard from './component/Reponboard.jsx';
import Manageorder from './component/Manageorder.jsx'
import ManageReps from './component/ManageReps.jsx';
import Inventory from './component/Inventory.jsx';
import MyRetailers from './component/MyRetailers.jsx';
import Createorder from './component/Createorder.jsx';
  import ProposeScheme from './component/ProposeScheme.jsx';

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
       <Route path="/chat" element={<Chat />} />
       <Route path="/addrep" element={<AddRep />} />
       <Route path="/addproduct" element={<Addproduct />} />
       <Route path="/dashboard/distributors" element={<Managedistributor />} />
       <Route path="/dashboard/master-data" element={<Masterdatamanagement />} />
       <Route path="/dashboard/schemes" element={<ManageScheme />} />
       <Route path="/create-scheme" element={<CreateScheme />} />
       <Route path="/dashboard/reps" element={<Reponboard />} />
       <Route path="/dashboard/orders" element={<Manageorder/>}/>
       <Route path="/manage-reps" element={<ManageReps />} />
       <Route path="/dashboard/inventory" element={<Inventory />} />
       <Route path="/dashboard/retailers" element={<MyRetailers />} />
       <Route path="/dashboard/create-order" element={<Createorder />} />
       <Route path="/dashboard/propose-scheme" element={<ProposeScheme />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
