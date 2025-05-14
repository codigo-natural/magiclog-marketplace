import React, { useEffect, useState } from 'react'
import apiClient from '../../services/api'
import { ProductCard } from '../../components/products/ProductCard'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import type { Product } from '../../types/products'

export const MyProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyProducts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<Product[]>('/products/me')
        setProducts(response.data)
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Error al cargar tus productos.'
        )
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMyProducts()
  }, [])

  if (isLoading)
    return <div className='text-center p-10'>Cargando tus productos...</div>
  if (error)
    return (
      <div className='text-center p-10 text-red-500 bg-red-100 rounded'>
        {error}
      </div>
    )

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Mis Productos</h1>
        <Link to='/seller/products/new'>
          <Button>Añadir Producto</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className='text-center text-gray-600'>
          Aún no has añadido ningún producto.
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
