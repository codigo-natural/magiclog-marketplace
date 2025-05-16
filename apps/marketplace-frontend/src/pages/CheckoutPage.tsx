import React from 'react'
import { useAppSelector } from '../store/hooks'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'

export const CheckoutPage: React.FC = () => {
  const { items } = useAppSelector((state) => state.cart)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold mb-6'>Checkout</h1>
        <div className='bg-white rounded-lg shadow p-6 text-center'>
          <p className='mb-4'>Tu carrito está vacío</p>
          <Link to='/products/search'>
            <Button variant='primary'>Continuar Comprando</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold mb-6'>Checkout</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Resumen del pedido */}
        <div className='md:col-span-2'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-xl font-semibold mb-4'>Resumen del Pedido</h2>

            <div className='space-y-4'>
              {items.map((item) => (
                <div key={item.product.id} className='flex border-b pb-4'>
                  <div className='flex-1'>
                    <h3 className='font-medium'>{item.product.name}</h3>
                    <p className='text-sm text-gray-500'>
                      SKU: {item.product.sku}
                    </p>
                    <p className='text-sm'>
                      {/*${item.product.price.toFixed(2)} x {item.quantity}*/}$
                      {item.product.price} x {item.quantity}
                    </p>
                  </div>
                  <div className='font-semibold'>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isAuthenticated && (
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4'>
              <p className='text-yellow-700'>
                Inicia sesión para guardar tu historial de compras
              </p>
              <div className='mt-2'>
                <Link to='/login'>
                  <Button variant='secondary' className='mr-2'>
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to='/register'>
                  <Button>Registrarse</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Resumen de pago */}
        <div className='md:col-span-1'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-xl font-semibold mb-4'>Resumen de Pago</h2>

            <div className='space-y-2 mb-4'>
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

            <Button variant='primary' className='w-full'>
              Completar Compra
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
