import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchAllProductsAdmin } from '../../store/features/products/productsSlice'
import { fetchAllSellersForAdmin } from '../../store/features/adminUsersSlice'
import { FaBoxArchive, FaUsers, FaCircle, FaListCheck } from 'react-icons/fa6' // Usando Fa6 para íconos más nuevos

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()

  const { allItemsAdmin: allProducts, isLoading: isLoadingProducts } =
    useAppSelector((state) => state.products)
  const { sellers, isLoadingSellers } = useAppSelector(
    (state) => state.adminUsers
  )

  useEffect(() => {
    dispatch(fetchAllProductsAdmin(undefined))
    // Cargar todos los vendedores
    dispatch(fetchAllSellersForAdmin())
  }, [dispatch])

  const totalPlatformProducts = allProducts.length
  const totalSellers = sellers.length

  return (
    <div className='p-6 space-y-8'>
      <header>
        <h1 className='text-3xl font-bold text-gray-800'>
          Panel de Administración
        </h1>
        <p className='text-lg text-gray-600'>
          Visión general y gestión de la plataforma Marketplace.
        </p>
      </header>

      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center text-purple-600 mb-2'>
            <FaBoxArchive size={24} className='mr-3' />
            <h3 className='text-xl font-semibold'>Productos en Plataforma</h3>
          </div>
          {isLoadingProducts ? (
            <p className='text-gray-500'>Cargando...</p>
          ) : (
            <p className='text-3xl font-bold text-gray-700'>
              {totalPlatformProducts}
            </p>
          )}
          <p className='text-sm text-gray-500'>Total de productos activos.</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center text-teal-600 mb-2'>
            <FaUsers size={24} className='mr-3' />
            <h3 className='text-xl font-semibold'>Vendedores Registrados</h3>
          </div>
          {isLoadingSellers ? (
            <p className='text-gray-500'>Cargando...</p>
          ) : (
            <p className='text-3xl font-bold text-gray-700'>{totalSellers}</p>
          )}
          <p className='text-sm text-gray-500'>Total de cuentas de vendedor.</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
          <div className='flex items-center text-green-600 mb-2'>
            <FaCircle size={24} className='mr-3' />
            <h3 className='text-xl font-semibold'>Añadir Categoría (Ej.)</h3>
          </div>
          <p className='text-3xl font-bold text-gray-700'>N/A</p>
          <p className='text-sm text-gray-500'>Funcionalidad futura.</p>
        </div>
      </section>

      <section className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-2xl font-semibold mb-6 text-gray-700'>
          Acciones Comunes
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Link
            to='/admin/products'
            className='block p-6 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors text-center shadow-sm hover:shadow-md'
          >
            <FaListCheck size={32} className='mx-auto mb-3 text-sky-600' />
            <h3 className='font-semibold text-sky-700 text-lg'>
              Gestionar Productos
            </h3>
            <p className='text-sm text-sky-600'>
              Ver, editar y filtrar todos los productos.
            </p>
          </Link>

          <div
            className='block p-6 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors text-center shadow-sm hover:shadow-md cursor-not-allowed opacity-60'
            title='Próximamente: Gestión de Vendedores'
          >
            <FaUsers size={32} className='mx-auto mb-3 text-amber-600' />
            <h3 className='font-semibold text-amber-700 text-lg'>
              Gestionar Vendedores
            </h3>
            <p className='text-sm text-amber-600'>
              Ver y administrar cuentas de vendedor.
            </p>
          </div>

          <div
            className='block p-6 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors text-center shadow-sm hover:shadow-md cursor-not-allowed opacity-60'
            title='Próximamente: Moderación'
          >
            <FaUsers size={32} className='mx-auto mb-3 text-rose-600' />{' '}
            <h3 className='font-semibold text-rose-700 text-lg'>Moderación</h3>
            <p className='text-sm text-rose-600'>
              Gestionar contenido y usuarios.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
