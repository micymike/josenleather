import { useState } from 'react';
import {Routes, Route} from 'react-router-dom'

import './App.css'
import AboutPage from './components/shared/AboutPage'
import PaymentSuccess from './components/shared/PaymentSuccess'
import ProductPage from './components/shared/ProductPage'
import ProductDetail from './components/shared/ProductDetail'
import CartPage from './components/shared/CartPage'
import ContactPage from './components/shared/ContactPage'
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
import FeedbackPage from './components/admin/FeedbackPage';

import { useEffect, useRef } from 'react';

function App() {
  const deferredPrompt = useRef(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt.current = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDownloadClick = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
      }
      deferredPrompt.current = null;
    } else {
      alert('App install not available. Use your browser\'s install option or add to home screen.');
    }
  };

  return (
    <CartProvider>
      <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="feedback" element={<FeedbackPage />} />
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
      <button
        className="pwa-download-btn"
        onClick={handleDownloadClick}
        title="Download App"
        aria-label="Download App"
      >
        ⬇
      </button>
    </CartProvider>
  )
}

export default App
