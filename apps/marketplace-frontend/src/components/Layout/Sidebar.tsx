import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

const generalItems = [
  {
    name: 'Buscar productos',
    link: '/products/search',
  },
]

const sellerItems = [
  {
    name: 'Dashboard',
    link: '/seller/dashboard',
  },
  {
    name: 'Mis productos',
    link: 'seller/products/me',
  },
]

const adminItems = [
  {
    name: 'Dashboard',
    link: '/admin/dashboard',
  },
  {
    name: 'Panel Admin',
    link: '/admin/products',
  },
]

export const Sidebar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  return (
    <aside className='w-64 bg-gray-300 min-h-screen'>
      <div className='text-black'>
        <nav className='flex flex-col mt-[70px] gap-4 pt-6 items-center'>
          {/* Enlaces generales */}
          {generalItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className='hover:text-gray-500'
            >
              {item.name}
            </Link>
          ))}

          {/* Enlaces para vendedores */}
          {isAuthenticated &&
            user?.role === 'seller' &&
            sellerItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className='hover:text-gray-500'
              >
                {item.name}
              </Link>
            ))}

          {/* Enlaces para administradores */}
          {isAuthenticated &&
            user?.role === 'admin' &&
            adminItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className='hover:text-gray-500'
              >
                {item.name}
              </Link>
            ))}
        </nav>
      </div>
    </aside>
  )
}
