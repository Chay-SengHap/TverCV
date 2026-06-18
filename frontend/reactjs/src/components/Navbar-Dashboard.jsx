import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NavbarDashboard = () => {
  const user = {name: 'Jonh Doe'}
  const navigate = useNavigate();

  const logouUser = () => [
    navigate('/')
  ]

  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link to='/'>
          <img src="../../public/assets/logoTverCv.png" className='h-11 w-auto'/>
        </Link>
        <div className='flex items-center gap-4 text-sm'>
          <p>Hi, {user?.name}</p>
          <button onClick={logouUser} className='bg-white hover:bg-amber-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
        </div>

      </nav>

    </div>
  )
}

export default NavbarDashboard