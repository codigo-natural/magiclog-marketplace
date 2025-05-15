import React from 'react'
import { CreateProductForm } from '../../components/products/CreateProductForm'

export const CreateProductPage: React.FC = () => {
  return (
    <div className='container mx-auto p-4 mt-6'>
      <h1 className='text-3xl font-bold mb-6 text-gray-300 text-center'>
        Añadir Nuevo Producto
      </h1>
      <div className='flex justify-center'>
        <CreateProductForm />
      </div>
    </div>
  )
}
