import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ProductPage from './ProductPage';
// We'll extract the ProductImageCarousel from ProductPage
import CheckoutForm from './CheckoutForm';
import { fetchKshToUsdRate, convertKshToUsd } from '../../lib/utils';

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const CartPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, addToCart, clearCart } = useCart();
  const [showResetWarning, setShowResetWarning] = useState(false);
  
  // Check if cart has items with suspiciously low prices (likely USD)
  const hasCorruptedPrices = cartItems.some(item => item.price < 10);
  const [loadingImages, setLoadingImages] = useState(false);
  const [usdRate, setUsdRate] = useState<number | null>(null);

  // Fetch USD rate on mount
  useEffect(() => {
    const fetchRate = async () => {
      const rate = await fetchKshToUsdRate();
      setUsdRate(rate);
    };
    fetchRate();
  }, []);

  // Fetch product images for cart items missing them
  useEffect(() => {
    const fetchMissingImages = async () => {
      const itemsToFetch = cartItems.filter(item => !item.image && (!item.imageUrls || item.imageUrls.length === 0));
      if (itemsToFetch.length === 0) return;
      setLoadingImages(true);
      try {
        // Assume getProducts() returns all products; optimize if you have a getProductById
        const { getProducts } = await import('../../lib/api');
        const allProducts = await getProducts();
        for (const item of itemsToFetch) {
          const prod = allProducts.find((p: any) => String(p.id) === String(item.id));
          if (prod) {
            removeFromCart(item.id);
            addToCart({
              ...item,
              image: prod.imageUrls && prod.imageUrls.length > 0 ? prod.imageUrls[0] : '',
              imageUrls: prod.imageUrls || [],
            }, item.quantity);
          }
        }
      } catch (e) {
        console.error('Failed to fetch product images for cart:', e);
      }
      setLoadingImages(false);
    };
    fetchMissingImages();
    // eslint-disable-next-line
  }, [cartItems]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const FloatingElement = ({ children, delay = 0, amplitude = 20 }: { children: React.ReactNode, delay?: number, amplitude?: number }) => (
    <div
      className="floating-element"
      style={{
        transform: `translateY(${Math.sin(Date.now() * 0.001 + delay) * amplitude}px)`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .glass-card {
          backdrop-filter: blur(25px);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, 
            #654321 25%, 
            #8B4513 50%, 
            #654321 75%
          );
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 -z-20">
        <div className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-orange-900/10" />
      </div>

      {/* Floating shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} amplitude={30}>
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={2} amplitude={25}>
          <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 rounded-lg rotate-45 blur-lg" />
        </FloatingElement>
      </div>

      {/* Navigation */}
      <nav className="glass-nav fixed top-0 w-full z-50 px-8 py-4" style={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-bold shimmer-text flex items-center gap-2" style={{ fontFamily: "'Edu NSW ACT Foundation', cursive", fontStyle: "italic" }}>
            <img src="/logo.jpg" alt="Josen Logo" className="h-8 w-auto" />
            JOSEN LEATHER AND CANVAS
          </Link>
          <div className="flex gap-8 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-amber-900 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-110 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <Link
              to="/cart"
              className="relative p-2 text-amber-900 hover:text-amber-700 transition-all duration-300 hover:scale-110"
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black shimmer-text mb-4">SHOPPING CART</h1>
          <p className="text-xl text-amber-800/80">Review your selected items</p>
          {hasCorruptedPrices && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-red-800 font-semibold">Price Issue Detected</h3>
                  <p className="text-red-700 text-sm">Some items have incorrect prices. Clear cart to fix this issue.</p>
                </div>
                <button
                  onClick={() => setShowResetWarning(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-card rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">Your cart is empty</h3>
              <p className="text-amber-700 mb-6">Add some products to get started</p>
              <Link
                to="/products"
                className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-700 hover:to-orange-800 transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <CheckoutFlow
            cartItems={cartItems}
            getTotalItems={getTotalItems}
            getTotalPrice={getTotalPrice}
            usdRate={usdRate}
            convertKshToUsd={convertKshToUsd}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        )}
      </div>
    </div>
  );
};

/** Carousel component for product images (copied from ProductPage) */
const ProductImageCarousel: React.FC<{ imageUrls: string[]; productName: string }> = ({ imageUrls, productName }) => {
  const [current, setCurrent] = React.useState(0);

  // Auto-advance every 5 seconds
  React.useEffect(() => {
    if (imageUrls.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [imageUrls.length]);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <img
        src={imageUrls[current]}
        alt={productName}
        className="w-24 h-24 object-cover rounded-xl transition-transform duration-700"
      />
      {/* Left arrow */}
      <button
        onClick={prevImage}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
        style={{ display: imageUrls.length > 1 ? 'block' : 'none' }}
        aria-label="Previous image"
      >
        &#8592;
      </button>
      {/* Right arrow */}
      <button
        onClick={nextImage}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
        style={{ display: imageUrls.length > 1 ? 'block' : 'none' }}
        aria-label="Next image"
      >
        &#8594;
      </button>
      {/* Dots */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {imageUrls.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-1.5 h-1.5 rounded-full ${idx === current ? 'bg-orange-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

import OrderTrackingStatus from "./OrderTrackingStatus";

const CheckoutSection: React.FC = () => {
  const [orderRef, setOrderRef] = React.useState<string | null>(null);
  if (orderRef) {
    return (
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <h3 className="text-2xl font-bold text-green-700 mb-2">Order Received!</h3>
        <p className="mb-2">
          Your order has been received and is being processed.<br />
          Please check your email for tracking information.
        </p>
        <div className="text-lg font-mono text-green-900 mb-4">{orderRef}</div>
        <OrderTrackingStatus status="Received" />
      </div>
    );
  }
  return <CheckoutForm onOrderPlaced={setOrderRef} />;
};

/** Checkout flow component to control showing the guest checkout form */
const CheckoutFlow: React.FC<{
  cartItems: any[];
  getTotalItems: () => number;
  getTotalPrice: () => number;
  usdRate: number | null;
  convertKshToUsd: (ksh: number, rate: number) => number;
  updateQuantity: (id: any, qty: number) => void;
  removeFromCart: (id: any) => void;
}> = ({
  cartItems,
  getTotalItems,
  getTotalPrice,
  usdRate,
  convertKshToUsd,
  updateQuantity,
  removeFromCart,
}) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const checkoutRef = React.useRef<HTMLDivElement>(null);

  // Scroll to checkout form when shown
  useEffect(() => {
    if (showCheckout && checkoutRef.current) {
      checkoutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showCheckout]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Summary - Left Side */}
      <div className="lg:col-span-1">
        <div className="glass-card rounded-3xl p-6 sticky top-24">
          <h3 className="text-2xl font-bold text-amber-900 mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-amber-800">Items ({getTotalItems()})</span>
              <span className="font-medium text-amber-900">
                {usdRate !== null
                  ? <>${convertKshToUsd(getTotalPrice(), usdRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-amber-700/70">(KSh {getTotalPrice().toLocaleString()})</span></>
                  : <>KSh {getTotalPrice().toLocaleString()}</>
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-800">Shipping</span>
              <span className="font-medium text-amber-900">Free</span>
            </div>
            <hr className="border-amber-300/30" />
            <div className="flex justify-between text-xl font-bold">
              <span className="text-amber-900">Total</span>
              <span className="shimmer-text">
                {usdRate !== null
                  ? <>${convertKshToUsd(getTotalPrice(), usdRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-amber-700/70">(KSh {getTotalPrice().toLocaleString()})</span></>
                  : <>KSh {getTotalPrice().toLocaleString()}</>
                }
              </span>
            </div>
          </div>
          <button
            className="w-full bg-gradient-to-r from-amber-600 to-orange-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
            onClick={() => setShowCheckout(true)}
            disabled={showCheckout}
          >
            Proceed to Checkout
          </button>
          <Link
            to="/products"
            className="block text-center text-amber-700 hover:text-amber-900 font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      {/* Cart Items - Right Side */}
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-6 animate-in slide-in-from-right duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-4">
                {item.imageUrls && item.imageUrls.length > 1 ? (
                  <ProductImageCarousel imageUrls={item.imageUrls} productName={item.name} />
                ) : (
                  <img
                    src={item.image || "/logo.jpg"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-amber-900 mb-2">{item.name}</h4>
                  <p className="text-lg font-semibold shimmer-text mb-4">
                    {usdRate !== null
                      ? <>${convertKshToUsd(item.price, usdRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-amber-700/70">(KSh {item.price.toLocaleString()})</span></>
                      : <>KSh {item.price.toLocaleString()}</>
                    }
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-amber-300/30 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-amber-900 hover:bg-amber-100/20 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium text-amber-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-amber-900 hover:bg-amber-100/20 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-amber-900">
                        {usdRate !== null
                          ? <>${convertKshToUsd(item.price * item.quantity, usdRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-amber-700/70">(KSh {(item.price * item.quantity).toLocaleString()})</span></>
                          : <>KSh {(item.price * item.quantity).toLocaleString()}</>
                        }
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Guest Checkout Form */}
        {showCheckout && (
          <div ref={checkoutRef} className="mt-8">
            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <span className="font-semibold text-yellow-900">
                All payments are required before delivery for all customers within Nairobi.
              </span>
            </div>
            <CheckoutSection />
          </div>
        )}
      </div>

    </div>
  );
};

export default CartPage;
