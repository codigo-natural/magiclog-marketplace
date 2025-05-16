import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createProduct,
  clearProductsError,
} from '../../store/features/products/productsSlice'

interface ProductDataPayload {
  name: string
  sku: string
  quantity: number
  price: number
}

export const CreateProductForm: React.FC = () => {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [formValidationError, setFormValidationError] = useState<string | null>(
    null
  )
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const dispatch = useAppDispatch()
  const { isLoading, error: apiError } = useAppSelector(
    (state) => state.products
  )
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      dispatch(clearProductsError())
    }
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormValidationError(null)
    setSuccessMessage(null)
    dispatch(clearProductsError())

    if (!name || !sku || !quantity || !price) {
      setFormValidationError('Todos los campos son obligatorios.')
      return
    }
    const numQuantity = parseInt(quantity, 10)
    const numPrice = parseFloat(price)

    if (isNaN(numQuantity) || numQuantity < 0) {
      setFormValidationError('La cantidad debe ser un número no negativo.')
      return
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormValidationError('El precio debe ser un número positivo.')
      return
    }

    const productData: ProductDataPayload = {
      name,
      sku,
      quantity: numQuantity,
      price: numPrice,
    }

    // Despachar la acción asincrona
    dispatch(createProduct(productData))
      .unwrap()
      .then(() => {
        setSuccessMessage('Product creado exitosamente!')
        setName('')
        setSku('')
        setQuantity('')
        setPrice('')
        setTimeout(() => {
          navigate('/seller/products/me')
        }, 1500)
      })
      .catch((err) => {
        console.error('Error al crear producto: ', err)
      })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-lg'
    >
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        Crear Nuevo Producto
      </h2>
      {formValidationError && (
        <p className='text-red-500 text-sm bg-red-100 p-3 rounded'>
          {formValidationError}
        </p>
      )}
      {apiError && !formValidationError && (
        <p className='text-red-500 text-sm bg-red-100 p-3 rounded'>
          {Array.isArray(apiError) ? apiError.join(', ') : apiError}
        </p>
      )}
      {successMessage && (
        <p className='text-green-600 text-sm bg-green-100 p-3 rounded'>
          {successMessage}
        </p>
      )}

      <Input
        label='Nombre del Producto'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label='SKU'
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        required
      />
      <Input
        label='Cantidad'
        type='number'
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        min='0'
      />
      <Input
        label='Precio'
        type='number'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        min='0.01'
        step='0.01'
      />

      <Button
        type='submit'
        className='w-full'
        isLoading={isLoading}
        disabled={isLoading}
      >
        Crear Producto
      </Button>
    </form>
  )
}
