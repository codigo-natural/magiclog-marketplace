import React, { useCallback, useEffect, useState } from 'react'
import { ProductCard } from '../components/products/ProductCard'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ProductSearch,
  type SearchParams,
} from '../components/products/ProductSearch'
import type { Product } from '../types/products'
import apiClient from '../services/api'
import { CartSummary } from '../components/cart/CartSummary'
import { useAppSelector } from '../store/hooks'

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { items } = useAppSelector((state) => state.cart)
  const hasCartItems = items.length > 0


  const parseQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search)
    const searchFilters: SearchParams = {}
    if (params.get('name')) searchFilters.name = params.get('name')!
    if (params.get('sku')) searchFilters.sku = params.get('sku')!
    if (params.get('minPrice'))
      searchFilters.minPrice = parseFloat(params.get('minPrice')!)
    if (params.get('maxPrice'))
      searchFilters.maxPrice = parseFloat(params.get('maxPrice')!)
    return searchFilters
  }, [location.search])

  const fetchProducts = useCallback(async (searchParams: SearchParams) => {
    setIsLoading(true)
    setError(null)
    try {

      const apiQuery = new URLSearchParams()
      if (searchParams.name) apiQuery.append('name', searchParams.name)
      if (searchParams.sku) apiQuery.append('sku', searchParams.sku)
      if (searchParams.minPrice !== undefined)
        apiQuery.append('minPrice', String(searchParams.minPrice))
      if (searchParams.maxPrice !== undefined)
        apiQuery.append('maxPrice', String(searchParams.maxPrice))

      const response = await apiClient.get<Product[]>(
        `/products/search?${apiQuery.toString()}`
      )
      setProducts(response.data)
      if (response.data.length === 0) {
        setError('No se encontraron productos con esos criterios.')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar productos.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  
  useEffect(() => {
    const initialFilters = parseQueryParams()
    if (Object.keys(initialFilters).length > 0 || location.search === '') {
      fetchProducts(initialFilters)
    }
  }, [fetchProducts, parseQueryParams, location.search])

  const handleSearch = (params: SearchParams) => {
    const query = new URLSearchParams()
    if (params.name) query.append('name', params.name)
    if (params.sku) query.append('sku', params.sku)
    if (params.minPrice !== undefined)
      query.append('minPrice', String(params.minPrice))
    if (params.maxPrice !== undefined)
      query.append('maxPrice', String(params.maxPrice))
    navigate(`${location.pathname}?${query.toString()}`)
  }

  return (
    <div className='container mx-auto p-4 mt-6'>
      <h1 className='text-3xl font-bold mb-6 text-black'>Buscar Productos</h1>
      
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-3'>
          <ProductSearch onSearch={handleSearch} isLoading={isLoading} />

          {isLoading && (
            <div className='text-center p-10'>Buscando productos...</div>
          )}
          {error && !isLoading && (
            <div className='text-center p-10 text-orange-600 bg-orange-100 rounded'>
              {error}
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        
        <div className='lg:col-span-1'>
          <div className='sticky top-24'>
            <h2 className='text-xl font-semibold mb-4'>Tu Carrito</h2>
            <CartSummary />
            
            {hasCartItems && (
              <div className='mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100'>
                <p className='text-sm text-blue-700 mb-2'>
                  ¡Continúa añadiendo productos a tu carrito!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}