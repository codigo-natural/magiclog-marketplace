import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import { Navbar } from './components/Layout/Navbar'
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

function App() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  return (
    <BrowserRouter>
      <Navbar />
      <div className='container mx-auto p-4 mt-6'>
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

          {/* Rutas Protegidas para Vendedores */}

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={['seller', 'admin']}
                userRole={user?.role}
              />
            }
          >
            <Route path='/seller/dashboard' element={<SellerDashboardPage />} />
            <Route
              path='/seller/products/new'
              element={<CreateProductPage />}
            />
            <Route path='/seller/products/me' element={<MyProductsPage />} />
          </Route>

          {/* Rutas Protejidas para Administradores */}
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
      </div>
    </BrowserRouter>
  )
}

export default App
