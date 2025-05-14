import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../store/features/auth/authSlice'
import { Button } from '../ui/Button'

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className='bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-10'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link to='/' className='text-xl font-bold hover:text-gray-300'>
          Marketplace
        </Link>
        <div className='space-x-4 flex items-center'>
          <Link to='/products/search' className='hover:text-gray-300'>
            Buscar Productos
          </Link>
          {isAuthenticated && user?.role === 'seller' && (
            <Link to='/seller/dashboard' className='hover:text-gray-300'>
              Panel Vendedor
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to='/admin/dashboard' className='hover:text-gray-300'>
              Panel Admin
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <span className='text-sm'>
                Hola, {user?.email} ({user?.role})
              </span>
              <Button onClick={handleLogout} variant='secondary' size='sm'>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link to='/login'>
                <Button variant='primary' size='sm'>
                  Login
                </Button>
              </Link>
              <Link to='/register'>
                <Button variant='secondary' size='sm'>
                  Registro
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
