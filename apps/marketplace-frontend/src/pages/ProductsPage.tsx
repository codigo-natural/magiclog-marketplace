import React, { useCallback, useEffect, useState } from 'react'
import { ProductCard } from '../components/products/ProductCard'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ProductSearch,
  type SearchParams,
} from '../components/products/ProductSearch'
import type { Product } from '../types/products'
import apiClient from '../services/api'

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Función para parsear query params de la URL
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
      // Construir query string para la API
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

  // Cargar productos al montar o cuando cambian los query params
  useEffect(() => {
    const initialFilters = parseQueryParams()
    if (Object.keys(initialFilters).length > 0 || location.search === '') {
      // Busca si hay filtros o si es la carga inicial sin query
      fetchProducts(initialFilters)
    }
  }, [fetchProducts, parseQueryParams, location.search])

  const handleSearch = (params: SearchParams) => {
    // Actualizar la URL con los nuevos parámetros de búsqueda
    const query = new URLSearchParams()
    if (params.name) query.append('name', params.name)
    if (params.sku) query.append('sku', params.sku)
    if (params.minPrice !== undefined)
      query.append('minPrice', String(params.minPrice))
    if (params.maxPrice !== undefined)
      query.append('maxPrice', String(params.maxPrice))
    navigate(`${location.pathname}?${query.toString()}`)
    // fetchProducts(params); // El useEffect se encargará de esto al cambiar location.search
  }

  return (
    <div className='container mx-auto p-4 mt-6'>
      <h1 className='text-3xl font-bold mb-6 text-gray-200'>
        Buscar Productos
      </h1>
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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
