import { useState } from 'react';
import {Routes, Route} from 'react-router-dom'

import './App.css'
import LandingPage from './components/shared/LandingPage'
import ProductPage from './components/shared/ProductPage'
import ProductDetail from './components/shared/ProductDetail'
import CartPage from './components/shared/CartPage'
import { CartProvider } from './context/CartContext'
import {
  AdminLayout,
  AdminDashboard,
  ProductList,
  ProductForm,
  OrderList,
  PaymentList,
  BlogList,
  BlogForm,
  AdminLogin,
  ProtectedRoute
} from './components/admin'

function App() {

  return (
    <CartProvider>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="payments" element={<PaymentList />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/add" element={<BlogForm />} />
        <Route path="blog/edit/:id" element={<BlogForm />} />
      </Route>
      </Routes>
    </CartProvider>
  )
}

export default App
