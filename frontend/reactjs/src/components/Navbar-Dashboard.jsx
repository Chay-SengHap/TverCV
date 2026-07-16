import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice';
import { User } from 'lucide-react'

const NavbarDashboard = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleNavigation = (to, e) => {
    if (window.resumeBuilderDirty) {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent('show-leave-builder-confirm', { detail: { targetUrl: to } })
      );
      return;
    }
    navigate(to);
  };

  const logoutUser = () => {
    if (window.resumeBuilderDirty) {
      window.dispatchEvent(
        new CustomEvent('show-leave-builder-confirm', { detail: { targetUrl: '/logout' } })
      );
      return;
    }
    navigate('/');
    dispatch(logout());
  };

  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link to='/' onClick={(e) => handleNavigation('/', e)}>
          <img src="https://ik.imagekit.io/3txkyljof/user-resume/logoTverCv.png" className='h-11 w-auto' />
        </Link>
        <div className='flex items-center gap-4 text-sm'>
          <Link to="/app/profile" onClick={(e) => handleNavigation('/app/profile', e)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <p>Hi, {user?.name}</p>
            <div className='rounded-[50%] p-1 border border-gray-300 bg-slate-50'>
              <User className='size-5 text-slate-600' />
            </div>
          </Link>
          <button onClick={logoutUser} className='bg-white hover:bg-amber-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all cursor-pointer'>Logout</button>
        </div>

      </nav>

    </div>
  )
}

export default NavbarDashboard