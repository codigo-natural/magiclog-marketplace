import React from 'react'
import { useAppSelector } from '../../store/hooks'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

interface CartSummaryProps {
  showCheckoutButton?: boolean
  className?: string
}

export const CartSummary: React.FC<CartSummaryProps> = ({ 
  showCheckoutButton = true,
  className = ''
}) => {
  const { items } = useAppSelector((state) => state.cart)
  
  // Calculate total price and item count
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
  
  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <p className="text-center text-gray-500">Tu carrito está vacío</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="font-semibold text-lg mb-3">Resumen del Carrito</h3>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span>Productos ({itemCount}):</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Envío:</span>
          <span>$0.00</span>
        </div>
        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      {showCheckoutButton && (
        <Link to="/checkout">
          <Button variant="primary" className="w-full">
            Proceder al Pago
          </Button>
        </Link>
      )}
    </div>
  )
}