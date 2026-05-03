import React from 'react'
import Admin from './Admin.jsx';
import Distributor from './Distributor.jsx';
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
  return (
    <></>
  )
}

export default Dashboard