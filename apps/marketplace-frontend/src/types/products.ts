export interface Product {
  id: string
  name: string
  sku: string
  quantity: number
  price: number
  seller?: { id: string; email: string }
  // * createdAt, updateAt
}