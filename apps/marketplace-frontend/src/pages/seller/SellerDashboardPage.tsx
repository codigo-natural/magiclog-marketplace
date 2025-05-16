import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchOwnProducts } from '../../store/features/products/productsSlice' // Para obtener los productos
import {
  FaBoxOpen,
  FaPlusCircle,
  FaChartLine,
  FaExclamationTriangle,
} from 'react-icons/fa'

export const SellerDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { ownItems: products, isLoading: isLoadingProducts } = useAppSelector(
    (state) => state.products
  )

  useEffect(() => {
    dispatch(fetchOwnProducts())
  }, [dispatch])

  const totalProducts = products.length
  const lowStockProducts = products.filter(
    (p) => p.quantity > 0 && p.quantity <= 5
  ).length // Ejemplo: bajo stock si <= 5
  const outOfStockProducts = products.filter((p) => p.quantity === 0).length

  return (
    <div className='p-6 space-y-8'>
      <header className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>
            Panel del Vendedor
          </h1>
          {user && (
            <p className='text-lg text-gray-600'>Bienvenido, {user.email}!</p>
          )}
        </div>
        <nav className='space-x-0 sm:space-x-3 flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-0'>
          <Button variant='primary' className='w-full sm:w-auto'>
            <Link
              to='/seller/products/new'
              className='flex items-center justify-center gap-2'
            >
              <FaPlusCircle /> Crear Producto
            </Link>
          </Button>
          <Button variant='secondary' className='w-full sm:w-auto'>
            <Link
              to='/seller/products/me'
              className='flex items-center justify-center gap-2'
            >
              <FaBoxOpen /> Mis Productos
            </Link>
          </Button>
        </nav>
      </header>

      {/* Sección de Estadísticas Rápidas */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center text-blue-600 mb-2'>
            <FaBoxOpen size={24} className='mr-3' />
            <h3 className='text-xl font-semibold'>Productos Totales</h3>
          </div>
          {isLoadingProducts ? (
            <p className='text-gray-500'>Cargando...</p>
          ) : (
            <p className='text-3xl font-bold text-gray-700'>{totalProducts}</p>
          )}
          <p className='text-sm text-gray-500'>
            Productos activos en tu tienda.
          </p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center text-orange-500 mb-2'>
            <FaExclamationTriangle size={24} className='mr-3' />
            <h3 className='text-xl font-semibold'>Bajo Stock</h3>
          </div>
          {isLoadingProducts ? (
            <p className='text-gray-500'>Cargando...</p>
          ) : (
            <p className='text-3xl font-bold text-gray-700'>
              {lowStockProducts}
            </p>
          )}
          <p className='text-sm text-gray-500'>
            Productos con 5 o menos unidades.
          </p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center text-red-500 mb-2'>
            <FaChartLine size={24} className='mr-3' />{' '}
            
            <h3 className='text-xl font-semibold'>Agotados</h3>
          </div>
          {isLoadingProducts ? (
            <p className='text-gray-500'>Cargando...</p>
          ) : (
            <p className='text-3xl font-bold text-gray-700'>
              {outOfStockProducts}
            </p>
          )}
          <p className='text-sm text-gray-500'>
            Productos sin unidades disponibles.
          </p>
        </div>
      </section>

      <section className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-700'>
          ¿Qué quieres hacer hoy?
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Link
            to='/seller/products/new'
            className='block p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors'
          >
            <h3 className='font-semibold text-green-700 text-lg flex items-center gap-2'>
              <FaPlusCircle /> Añadir un Nuevo Producto
            </h3>
            <p className='text-sm text-green-600'>
              Agrega artículos a tu inventario para que los clientes los
              descubran.
            </p>
          </Link>
          <Link
            to='/seller/products/me'
            className='block p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors'
          >
            <h3 className='font-semibold text-indigo-700 text-lg flex items-center gap-2'>
              <FaBoxOpen /> Gestionar Mis Productos
            </h3>
            <p className='text-sm text-indigo-600'>
              Visualiza, edita o elimina los productos de tu catálogo.
            </p>
          </Link>
        </div>
      </section>

      <section>
        <p className='text-gray-500'>
          {' '}
          Utiliza este panel para administrar eficientemente tu inventario,
          precios y más.
        </p>
      </section>
    </div>
  )
}
