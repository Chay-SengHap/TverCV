import React from 'react'
import { Outlet } from 'react-router-dom'
import NavbarDashboard from '../components/Navbar-Dashboard'

const Layout = () => {
  return (
    <div >
      <div className='min-h-screen bg-gray-50'>
        <NavbarDashboard />
        <Outlet />

      </div>
    </div>
  )
}

export default Layout