import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export const SellerDashboardPage: React.FC = () => {
  return (
    <div className='p-6'>
      <header className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Panel del Vendedor</h1>
        <nav className='space-x-4 flex'>
          <Button variant='primary' className='cursor-pointer'>
            <Link to='/seller/products/new'>Crear Producto</Link>
          </Button>
          <Button variant='secondary'>
            <Link to='/seller/products/me'>Mis Productos</Link>
          </Button>
        </nav>
      </header>

      {/* Aquí puedes seguir con el contenido del dashboard */}
      <section>
        <p className='text-gray-300'>
          Bienvenido a tu panel de vendedor. Aquí puedes gestionar tus
          productos.
        </p>
      </section>
    </div>
  )
}
