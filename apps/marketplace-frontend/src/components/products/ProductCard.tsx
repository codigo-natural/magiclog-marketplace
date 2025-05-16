import React from 'react'
import type { Product } from '../../types/products'
import { Button } from '../ui/Button'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addToCart, openCart } from '../../store/features/cart/cartSlice'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    dispatch(openCart())
  }

  const isCurrentUserSellerOfProduct =
    isAuthenticated &&
    user?.role === 'seller' &&
    user?.id === product.seller?.id
  const canAddToCart = !isCurrentUserSellerOfProduct

  return (
    <div className='border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between'>
      <div>
        <h3 className='text-lg font-semibold mb-1 text-gray-800'>
          {product.name}
        </h3>
        <p className='text-sm text-gray-600'>SKU: {product.sku}</p>
        <p className='text-sm text-gray-600'>Cantidad: {product.quantity}</p>
        {product.seller && (
          <p className='text-xs text-gray-500 mt-1'>
            Vendido por: {product.seller.email}
          </p>
        )}
      </div>
      <div className='mt-auto'>
        <p className='text-xl font-bold text-blue-600 mt-2'>
          ${Number(product.price).toFixed(2)}
        </p>
        {canAddToCart && product.quantity > 0 && (
          <Button
            onClick={handleAddToCart}
            variant='primary'
            className='w-full mt-3'
            disabled={product.quantity === 0}
          >
            {product.quantity > 0 ? 'Añadir al carrito' : 'Agotado'}
          </Button>
        )}
        {product.quantity === 0 && !isCurrentUserSellerOfProduct && (
          <p className='text-red-500 text-sm font-semibold mt-3 text-center'>
            Agotado
          </p>
        )}
      </div>
    </div>
  )
}
