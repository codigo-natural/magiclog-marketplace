import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export interface SearchParams {
  name?: string
  sku?: string
  minPrice?: number
  maxPrice?: number
}

interface ProductSearchProps {
  onSearch: (params: SearchParams) => void
  isLoading?: boolean
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  isLoading,
}) => {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params: SearchParams = {}
    if (name) params.name = name
    if (sku) params.sku = sku
    if (minPrice) params.minPrice = parseFloat(minPrice)
    if (maxPrice) params.maxPrice = parseFloat(maxPrice)
    onSearch(params)
  }

  return (
    <form
      onSubmit={handleSearch}
      className='bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end'
    >
      <Input
        label='Nombre'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Ej: Camiseta'
      />
      <Input
        label='SKU'
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        placeholder='Ej: CAM-001'
      />
      <Input
        label='Precio Mín.'
        type='number'
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder='0'
        min='0'
        step='0.01'
      />
      <Input
        label='Precio Máx.'
        type='number'
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder='1000'
        min='0'
        step='0.01'
      />
      <Button
        type='submit'
        className='w-full md:col-span-1 lg:col-span-1 h-10'
        isLoading={isLoading}
        disabled={isLoading}
      >
        Buscar
      </Button>
    </form>
  )
}
