import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { assets } from '../assets/assets'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          
          {/* Logo/Brand */}
          <Link to='/' className='shrink-0 flex items-center gap-2'>
            <img src={assets.logo} alt='Logo' className='w-40 h-30' />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <Link to='/' className='text-gray-700 hover:text-indigo-600 transition font-medium'>
              Home
            </Link>
            <Link to='/' className='text-gray-700 hover:text-indigo-600 transition font-medium'>
              Blog
            </Link>
            <a href='#contact' className='text-gray-700 hover:text-indigo-600 transition font-medium'>
              About
            </a>
          </div>

          {/* Desktop Auth Section */}
          <div className='hidden md:flex items-center gap-4'>
            {isAuthenticated ? (
              <div className='relative'>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className='flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-600 text-white cursor-pointer rounded-lg hover:from-indigo-700 hover:to-blue-700 transition'
                >
                  <span className='text-sm font-medium'>{user?.name || 'User'}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10'>
                    <div className='px-4 py-2 border-b border-gray-200'>
                      <p className='font-semibold text-gray-900'>{user?.name}</p>
                      <p className='text-xs text-gray-600'>{user?.email}</p>
                    </div>
                    <Link
                      to='/profile'
                      onClick={() => setIsUserMenuOpen(false)}
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                    >
                      Profile
                    </Link>
                    <Link
                      to='/profile'
                      onClick={() => setIsUserMenuOpen(false)}
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                    >
                      My Blogs
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition'
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-6 py-2 text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium'
                >
                  Sign In
                </Link>
                <Link
                  to='/signup'
                  className='px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-gray-700 hover:text-gray-900 transition focus:outline-none'
            >
              <svg
                className='h-6 w-6'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {isMenuOpen ? (
                  <path d='M6 18L18 6M6 6l12 12'></path>
                ) : (
                  <path d='M4 6h16M4 12h16M4 18h16'></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-gray-50 border-t border-gray-200'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            <Link
              to='/'
              className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition'
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to='/'
              className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition'
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <a
              href='#contact'
              className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition'
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>

            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <>
                <div className='px-3 py-3 border-t border-gray-200'>
                  <p className='font-semibold text-gray-900'>{user?.name}</p>
                  <p className='text-xs text-gray-600'>{user?.email}</p>
                </div>
                <Link
                  to='/profile'
                  onClick={() => setIsMenuOpen(false)}
                  className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition'
                >
                  Profile
                </Link>
                <Link
                  to='/profile'
                  onClick={() => setIsMenuOpen(false)}
                  className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition'
                >
                  My Blogs
                </Link>
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition'
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className='px-3 py-2 space-y-2'>
                <Link
                  to='/login'
                  className='block w-full text-center px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to='/signup'
                  className='block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
