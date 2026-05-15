import React from 'react'
import Admin from './Admin.jsx';
import Distributor from './Distributor.jsx';
import RetailerDashboard from './RetailerDashboard.jsx';
import Sidebar from '../../component/Sidebar';  
import TopNavbar from '../../component/TopNavbar';

import Rep from './Rep.jsx';


function Dashboard() {
    if(JSON.parse(localStorage.getItem('user')).role === 'admin'){
        return <Admin />
    }       
    else if(JSON.parse(localStorage.getItem('user')).role === 'distributor'){
        return <Distributor />
    }       
    else if(JSON.parse(localStorage.getItem('user')).role === 'rep'){
        return <Rep />
    }    
    else{
        return <RetailerDashboard />
    }       
  return (
    <>
   
    </>
  )
}

export default Dashboard