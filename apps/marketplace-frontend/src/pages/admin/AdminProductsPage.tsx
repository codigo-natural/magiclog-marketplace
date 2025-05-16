import React, { useEffect, useState } from 'react'
import { ProductCard } from '../../components/products/ProductCard'
import { Button } from '../../components/ui/Button'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchAllProductsAdmin,
  clearProductsError as clearProdError,
} from '../../store/features/products/productsSlice'
import {
  fetchAllSellersForAdmin,
  clearSellersError,
  type Seller,
} from '../../store/features/adminUsersSlice'

export const AdminProductsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    allItemsAdmin: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useAppSelector((state) => state.products)

  const { sellers, isLoadingSellers, sellersError } = useAppSelector(
    (state) => state.adminUsers
  )

  const [selectedSellerId, setSelectedSellerId] = useState<string>('')

  useEffect(() => {
    dispatch(fetchAllSellersForAdmin())
    return () => {
      dispatch(clearProdError())
      dispatch(clearSellersError())
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchAllProductsAdmin(selectedSellerId || undefined))
  }, [dispatch, selectedSellerId])

  const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSellerId(e.target.value)
  }

  const clearSellerFilter = () => {
    setSelectedSellerId('')
  }

  const MAX_SELLERS_VISIBLE_INITIALLY = 5
  const [showAllSellers, setShowAllSellers] = useState(false)
  const visibleSellers = showAllSellers
    ? sellers
    : sellers.slice(0, MAX_SELLERS_VISIBLE_INITIALLY)

  return (
    <div className='container mx-auto px-4 py-6'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>
        Gestión de Productos
      </h1>

      {/* Filtro por vendedor */}
      <section className='bg-white p-6 rounded-xl shadow mb-10'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>
          Filtrar por Vendedor
        </h2>

        {isLoadingSellers ? (
          <p className='text-gray-500 text-sm'>Cargando vendedores...</p>
        ) : sellersError ? (
          <p className='text-red-500 text-sm'>{sellersError}</p>
        ) : (
          <div className='flex flex-col sm:flex-row items-stretch sm:items-end gap-4'>
            <div className='flex-1'>
              <select
                id='seller-filter'
                value={selectedSellerId}
                onChange={handleSellerChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>-- Todos los Vendedores --</option>
                {visibleSellers.map((seller: Seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.email}
                  </option>
                ))}
              </select>
            </div>

            {selectedSellerId && (
              <Button
                onClick={clearSellerFilter}
                variant='secondary'
                className='h-10'
              >
                Limpiar Filtro
              </Button>
            )}
          </div>
        )}

        {!showAllSellers && sellers.length > MAX_SELLERS_VISIBLE_INITIALLY && (
          <button
            onClick={() => setShowAllSellers(true)}
            className='text-sm text-blue-600 hover:text-blue-800 mt-2'
          >
            Ver más vendedores...
          </button>
        )}
      </section>

      {/* Estado de carga */}
      {isLoadingProducts && (
        <div className='text-center py-10 text-gray-600'>
          <p>Cargando productos...</p>
        </div>
      )}

      {/* Error al cargar productos */}
      {!isLoadingProducts && productsError && (
        <div className='bg-red-100 text-red-700 text-center p-6 rounded-md shadow'>
          <p className='font-semibold mb-2'>Error al cargar productos</p>
          <p className='text-sm'>{productsError}</p>
        </div>
      )}

      {/* Sin productos */}
      {!isLoadingProducts && !productsError && products.length === 0 && (
        <div className='text-center bg-gray-100 text-gray-500 p-6 rounded-md shadow'>
          No se encontraron productos.
        </div>
      )}

      {/* Lista de productos */}
      {!isLoadingProducts && !productsError && products.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
