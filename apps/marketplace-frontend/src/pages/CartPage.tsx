import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/features/cart/cartSlice'

export const CartPage: React.FC = () => {
  const { items } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId))
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }))
  }

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      dispatch(clearCart())
    }
  }

  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold mb-6'>Tu Carrito</h1>
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-16 w-16 mx-auto text-gray-400 mb-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <circle cx='8' cy='21' r='1'></circle>
            <circle cx='19' cy='21' r='1'></circle>
            <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12'></path>
          </svg>
          <p className='text-xl mb-6'>Tu carrito está vacío</p>
          <p className='text-gray-500 mb-6'>
            Parece que aún no has añadido productos a tu carrito.
          </p>
          <Link to='/products/search'>
            <Button variant='primary'>Explorar Productos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tu Carrito</h1>
        <Button variant='secondary' onClick={handleClearCart}>
          Vaciar Carrito
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Producto
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Precio
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Cantidad
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {items.map((item) => (
                  <tr key={item.product.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {item.product.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            SKU: {item.product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {/*${item.product.price.toFixed(2)}*/}$
                        {item.product.price}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
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
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {/*${(item.product.price * item.quantity).toFixed(2)}*/}$
                      {item.product.price * item.quantity}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='md:col-span-1'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-lg font-semibold mb-4'>Resumen del Pedido</h2>

            <div className='space-y-2 mb-6'>
              <div className='flex justify-between'>
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Envío:</span>
                <span>$0.00</span>
              </div>
              <div className='flex justify-between font-bold text-lg border-t pt-2 mt-2'>
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link to='/checkout'>
              <Button variant='primary' className='w-full mb-3'>
                Proceder al Pago
              </Button>
            </Link>

            <Link to='/products/search'>
              <Button variant='secondary' className='w-full'>
                Seguir Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
