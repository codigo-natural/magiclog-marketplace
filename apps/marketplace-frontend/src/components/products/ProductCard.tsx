import React from 'react'
import type { Product } from '../../types/products'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className='border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
      <h3 className='text-lg font-semibold mb-1'>{product.name}</h3>
      <p className='text-sm text-gray-600'>SKU: {product.sku}</p>
      <p className='text-sm text-gray-600'>Cantidad: {product.quantity}</p>
      <p className='text-xl font-bold text-blue-600 mt-2'>
        ${Number(product.price).toFixed(2)}
      </p>
      {product.seller && (
        <p className='text-xs text-gray-500 mt-1'>
          Vendido por: {product.seller.email}
        </p>
      )}
    </div>
  )
}
