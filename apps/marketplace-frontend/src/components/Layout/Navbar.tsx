import React, { useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../store/features/auth/authSlice'
import { Button } from '../ui/Button'
// import { toggleCart } from '../../store/features/cart/cartSlice';
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { items } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(dropdownRef, () => setShowDropdown(false))

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowDropdown((prev) => !prev)
  }

  // Calculate total items in cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className='text-black bg-gray-300 p-4 fixed top-0 left-0 right-0 z-20'>
      {' '}
      <div className='container mx-auto flex justify-between items-center'>
        <Link to='/' className='text-xl font-bold hover:text-blue-900'>
          Marketplace
        </Link>
        <div className='space-x-4 flex items-center'>
          {/* Cart Icon with dropdown */}
          <div className='relative' ref={dropdownRef}>
            {' '}
            <button onClick={handleCartClick} className='relative p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='8' cy='21' r='1'></circle>
                <circle cx='19' cy='21' r='1'></circle>
                <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12'></path>
              </svg>
              {cartItemCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                  {cartItemCount}
                </span>
              )}
            </button>
            {/* Dropdown menu */}
            {showDropdown && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200'>
                {' '}
                <div className='py-1'>
                  <Link
                    to='/cart'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setShowDropdown(false)}
                  >
                    Ver Carrito
                  </Link>
                  {cartItemCount > 0 && (
                    <Link
                      to='/checkout'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setShowDropdown(false)}
                    >
                      Proceder al Pago
                    </Link>
                  )}
                  {cartItemCount === 0 && (
                    <p className='px-4 py-2 text-sm text-gray-500'>
                      Tu carrito está vacío.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              <span className='text-sm'>
                Hola, {user?.email} ({user?.role})
              </span>
              <Button onClick={handleLogout} variant='secondary'>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link to='/login'>
                <Button variant='primary'>Login</Button>
              </Link>
              <Link to='/register'>
                {' '}
                <Button variant='secondary'>Registro</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
