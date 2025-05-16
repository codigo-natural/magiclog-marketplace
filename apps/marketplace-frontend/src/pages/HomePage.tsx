// src/pages/HomePage.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { CartSummary } from '../components/cart/CartSummary'
import { useAppSelector } from '../store/hooks'
import { UserRole } from '../common/enums/role.enum'

export const HomePage: React.FC = () => {
  const { items: cartItems } = useAppSelector((state) => state.cart)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const hasCartItems = cartItems.length > 0

  const renderHeroSection = () => {
    if (isAuthenticated) {
      if (user?.role === UserRole.ADMIN) {
        return (
          <>
            <h1 className='text-3xl font-bold mb-4'>Panel de Administración</h1>
            <p className='text-lg text-gray-700 mb-6'>
              Bienvenido, Administrador. Gestiona la plataforma desde aquí.
            </p>
            <div className='flex gap-4'>
              <Link to='/admin/products'>
                <Button variant='primary'>Ver Todos los Productos</Button>
              </Link>
            </div>
          </>
        )
      } else if (user?.role === UserRole.SELLER) {
        return (
          <>
            <h1 className='text-3xl font-bold mb-4'>Panel de Vendedor</h1>
            <p className='text-lg text-gray-700 mb-6'>
              Hola {user?.email}, gestiona tus productos y ventas.
            </p>
            <div className='flex gap-4'>
              <Link to='/seller/products/me'>
                <Button variant='primary'>Mis Productos</Button>
              </Link>
              <Link to='/seller/products/new'>
                <Button variant='secondary'>Añadir Nuevo Producto</Button>
              </Link>
            </div>
          </>
        )
      } else {
        return (
          <>
            <h1 className='text-3xl font-bold mb-4'>
              Bienvenido de Nuevo, {user?.email}
            </h1>
            <p className='text-lg text-gray-700 mb-6'>
              Continúa explorando los mejores productos de nuestros vendedores.
            </p>
            <div className='flex gap-4'>
              <Link to='/products/search'>
                <Button variant='primary'>Explorar Productos</Button>
              </Link>
            </div>
          </>
        )
      }
    } else {
      return (
        <>
          <h1 className='text-3xl font-bold mb-4'>
            Bienvenido a Nuestro Marketplace
          </h1>
          <p className='text-lg text-gray-700 mb-6'>
            Encuentra los mejores productos de vendedores verificados.
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link to='/products/search'>
              <Button variant='primary' className='w-full sm:w-auto'>
                Explorar Productos
              </Button>
            </Link>
            <Link to='/register'>
              {' '}
              {/* O abrir modal de registro */}
              <Button variant='secondary' className='w-full sm:w-auto'>
                Registrarse como Vendedor
              </Button>
            </Link>
            <Link to='/login'>
              {' '}
              <Button className='w-full sm:w-auto'>Iniciar Sesión</Button>
            </Link>
          </div>
        </>
      )
    }
  }

  const renderSellerCtaSection = () => {
    if (
      !isAuthenticated ||
      (isAuthenticated &&
        user?.role !== UserRole.SELLER &&
        user?.role !== UserRole.ADMIN)
    ) {
      return (
        <section className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-2xl font-semibold mb-4'>
            ¿Quieres vender con nosotros?
          </h2>
          <p className='text-gray-600 mb-4'>
            Regístrate en nuestro marketplace y llega a más clientes. Es fácil y
            rápido.
          </p>
          <Link to='/register'>
            {' '}
            {/* O abrir modal de registro */}
            <Button variant='secondary'>Comenzar a Vender</Button>
          </Link>
        </section>
      )
    }
    return null
  }

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-12'>
      {' '}
      <section>
        {' '}
        {renderHeroSection()}
      </section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 space-y-8'>
          {' '}
          <section className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-2xl font-semibold mb-4'>
              Características Principales
            </h2>
            <div className='space-y-4'>
              <div className='flex items-start'>
                <div className='bg-blue-100 p-3 rounded-full mr-4'>
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
                    <circle cx='10' cy='20.5' r='1' />
                    <circle cx='18' cy='20.5' r='1' />
                    <path d='M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold'>
                    Carrito de Compras Interactivo
                  </h3>
                  <p className='text-gray-600'>
                    Añade productos, ajusta cantidades y visualiza tu pedido
                    antes de pagar.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='bg-green-100 p-3 rounded-full mr-4'>
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
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
                    <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold'>Perfiles de Usuario y Roles</h3>
                  <p className='text-gray-600'>
                    Experiencia personalizada para compradores, vendedores y
                    administradores.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='bg-purple-100 p-3 rounded-full mr-4'>
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
                    <path d='m8 3 4 8 5-5 5 15H2L8 3z' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold'>
                    Búsqueda y Filtrado Avanzado
                  </h3>
                  <p className='text-gray-600'>
                    Encuentra exactamente lo que necesitas con filtros por
                    nombre, SKU y precio.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {renderSellerCtaSection()}
        </div>

        <aside>
          {' '}
          <h2 className='text-xl font-semibold mb-4 sticky top-20'>
            Tu Carrito
          </h2>{' '}
          <div className='sticky top-28'>
            {' '}
            <CartSummary />
            {!hasCartItems && (
              <div className='mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100'>
                <p className='text-sm text-blue-700 mb-2'>
                  Tu carrito está vacío. ¡Explora nuestros productos!
                </p>
                <Link to='/products/search'>
                  <Button variant='primary' className='w-full'>
                    Ver Productos
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
