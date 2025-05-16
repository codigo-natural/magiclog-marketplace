import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  closeCart,
  removeFromCart,
  updateQuantity,
} from '../../store/features/cart/cartSlice'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

export const CartDrawer: React.FC = () => {
  const { items, isOpen } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(closeCart())
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId))
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }))
  }

  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 transition-opacity z-40'
        onClick={handleClose}
        aria-hidden='true'
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col z-50 transform transition-transform ease-in-out duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role='dialog'
        aria-modal='true'
        aria-labelledby='cart-drawer-title'
      >
        {/* Header */}
        <div className='p-4 border-b flex justify-between items-center'>
          <h2 id='card-drawer-title' className='text-xl font-semibold'>
            Carrito de Compras
          </h2>
          <button
            onClick={handleClose}
            className='text-gray-500 hover:text-gray-700'
            aria-label='Cerrar carrito'
          >
            <span className='text-2xl'>&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4'>
          {items.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-500'>Tu carrito está vacío</p>
              <Button variant='primary' className='mt-4' onClick={handleClose}>
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {items.map((item) => (
                <div key={item.product.id} className='flex border-b pb-4'>
                  <div className='flex-1'>
                    <h3 className='font-medium'>{item.product.name}</h3>
                    <p className='text-sm text-gray-500'>
                      SKU: {item.product.sku}
                    </p>
                    <p className='font-semibold'>
                      {/*${item.product.price.toFixed(2)}*/}$
                      {item.product.price}
                    </p>

                    <div className='flex items-center mt-2'>
                      <button
                        className='w-8 h-8 border rounded-l flex items-center justify-center'
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className='w-10 h-8 border-t border-b flex items-center justify-center'>
                        {item.quantity}
                      </span>
                      <button
                        className='w-8 h-8 border rounded-r flex items-center justify-center'
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.product.quantity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className='flex flex-col items-end'>
                    <span className='font-semibold'>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className='text-sm text-red-500 mt-2'
                      onClick={() => handleRemoveItem(item.product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className='p-4 border-t'>
            <div className='flex justify-between mb-4'>
              <span className='font-semibold'>Total:</span>
              <span className='font-bold'>${totalPrice.toFixed(2)}</span>
            </div>

            <Link to='/checkout'>
              <Button variant='primary' className='w-full'>
                Proceder al Pago
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
