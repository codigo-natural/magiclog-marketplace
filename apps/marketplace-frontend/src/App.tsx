import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import { Navbar } from './components/Layout/Navbar'
import { Sidebar } from './components/Layout/Sidebar'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProductsPage } from './pages/ProductsPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage'
import { CreateProductPage } from './pages/seller/CreateProductPage'
import { MyProductsPage } from './pages/seller/MyProductsPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { NotFoundPage } from './pages/NotFound'
import { CartDrawer } from './components/cart/CartDrawer'
import { CheckoutPage } from './pages/CheckoutPage'
import { CartPage } from './pages/CartPage'

function App() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  return (
    <BrowserRouter>
      <Navbar />
      <CartDrawer />

      <div className='flex min-h-screen'>
        <Sidebar />

        <main className='flex-1 p-4 mt-16'>
          <Routes>
            {/* Rutas Públicas */}
            <Route path='/' element={<HomePage />} />
            <Route
              path='/login'
              element={isAuthenticated ? <Navigate to='/' /> : <LoginPage />}
            />
            <Route
              path='/register'
              element={isAuthenticated ? <Navigate to='/' /> : <RegisterPage />}
            />
            <Route path='/products/search' element={<ProductsPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />

            {/* Rutas Protegidas para Vendedores */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['seller']}
                  userRole={user?.role}
                  redirectPath='/login'
                />
              }
            >
              <Route
                path='/seller/dashboard'
                element={<SellerDashboardPage />}
              />
              <Route
                path='/seller/products/new'
                element={<CreateProductPage />}
              />
              <Route path='/seller/products/me' element={<MyProductsPage />} />
            </Route>

            {/* Rutas Protegidas para Administradores */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['admin']}
                  userRole={user?.role}
                />
              }
            >
              <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
              <Route path='/admin/products' element={<AdminProductsPage />} />
            </Route>

            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
