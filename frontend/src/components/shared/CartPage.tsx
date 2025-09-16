import React, { useState, useEffect } from 'react';
import SidebarNav from './SidebarNav';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ProductPage from './ProductPage';
// We'll extract the ProductImageCarousel from ProductPage
import CheckoutForm from './CheckoutForm';

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CartPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, addToCart, clearCart } = useCart();
  const [showResetWarning, setShowResetWarning] = useState(false);
  
  // Check if cart has items with suspiciously low prices (likely USD)
  const hasCorruptedPrices = cartItems.some(item => item.price < 10);
  const [loadingImages, setLoadingImages] = useState(false);

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

      {/* Sidebar Navigation */}
      <SidebarNav />

      <div className="pt-20 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
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
          Thank you for your order!<br />
          Your order reference is <span className="font-bold text-green-900">{orderRef}</span>.<br />
          Your order has been received and is being processed.
        </p>
        <div className="mb-4">
          <a
            href={`/order-tracking/${orderRef}`}
            className="inline-block bg-amber-600 text-white px-4 py-2 rounded font-semibold hover:bg-amber-700 transition"
          >
            Track Your Order
          </a>
        </div>
        <OrderTrackingStatus status="Received" />
        <p className="mt-4 text-amber-900 text-sm">
          You will receive updates on every status change.
        </p>
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
  updateQuantity: (id: any, qty: number) => void;
  removeFromCart: (id: any) => void;
}> = ({
  cartItems,
  getTotalItems,
  getTotalPrice,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {/* Cart Summary - Left Side */}
      <div className="lg:col-span-1 md:col-span-2 col-span-1">
        <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 sticky top-24">
          <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-4 md:mb-6">Order Summary</h3>
          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            <div className="flex justify-between">
              <span className="text-amber-800">Items ({getTotalItems()})</span>
              <span className="font-medium text-amber-900">
                {(() => {
                  let total = 0;
                  cartItems.forEach(item => {
                    if (item.name && item.name.toLowerCase().includes("bag")) {
                      total += 18500 * item.quantity;
                    } else if (item.name && item.name.toLowerCase().includes("belt")) {
                      total += 4500 * item.quantity;
                    } else {
                      total += item.price * item.quantity;
                    }
                  });
                  return `KSh ${total.toLocaleString()}`;
                })()}
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
                {(() => {
                  let totalKES = 0;
                  let totalUSD = 0;
                  let allBags = true;
                  let allBelts = true;
                  cartItems.forEach(item => {
                    if (item.name && item.name.toLowerCase().includes("bag")) {
                      totalKES += 18500 * item.quantity;
                      totalUSD += 145 * item.quantity;
                      allBelts = false;
                    } else if (item.name && item.name.toLowerCase().includes("belt")) {
                      totalKES += 4500 * item.quantity;
                      totalUSD += 35 * item.quantity;
                      allBags = false;
                    } else {
                      totalKES += item.price * item.quantity;
                      allBags = false;
                      allBelts = false;
                    }
                  });
                  if (allBags) {
                    return `KES ${totalKES.toLocaleString()}  (US$ ${totalUSD.toLocaleString()})`;
                  } else if (allBelts) {
                    return `KES ${totalKES.toLocaleString()}  (US$ ${totalUSD.toLocaleString()})`;
                  } else {
                    return `KSh ${totalKES.toLocaleString()}`;
                  }
                })()}
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
      <div className="lg:col-span-2 md:col-span-2 col-span-1">
        <div className="space-y-3 md:space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              className="glass-card rounded-xl md:rounded-2xl p-3 md:p-6 animate-in slide-in-from-right duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {item.imageUrls && item.imageUrls.length > 1 ? (
                  <ProductImageCarousel imageUrls={item.imageUrls} productName={item.name} />
                ) : (
                  <img
                    src={item.image || "/logo.jpg"}
                    alt={item.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg md:rounded-xl"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-lg md:text-xl font-bold text-amber-900 mb-1 md:mb-2">{item.name}</h4>
                  <p className="text-base md:text-lg font-semibold shimmer-text mb-2 md:mb-4">
                    {item.name && item.name.toLowerCase().includes("bag") ? (
                      <>
                        <span>KES 18,500</span>
                        <span className="text-xs text-amber-700/80"> US$ 145</span>
                      </>
                    ) : item.name && item.name.toLowerCase().includes("belt") ? (
                      <>
                        <span>KES 4,500</span>
                        <span className="text-xs text-amber-700/80"> US$ 35</span>
                      </>
                    ) : (
                      <>KSh {item.price.toLocaleString()}</>
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center border border-amber-300/30 rounded-md md:rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 md:px-3 md:py-2 text-amber-900 hover:bg-amber-100/20 transition-colors text-lg md:text-xl"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 md:px-4 md:py-2 font-medium text-amber-900 text-base md:text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 md:px-3 md:py-2 text-amber-900 hover:bg-amber-100/20 transition-colors text-lg md:text-xl"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 mt-2 sm:mt-0">
                      <span className="text-lg md:text-xl font-bold text-amber-900">
                        {item.name && item.name.toLowerCase().includes("bag") ? (
                          <>
                            <span>KES {18500 * item.quantity}</span>
                            <span className="text-xs text-amber-700/80"> US$ {145 * item.quantity}</span>
                          </>
                        ) : item.name && item.name.toLowerCase().includes("belt") ? (
                          <>
                            <span>KES {4500 * item.quantity}</span>
                            <span className="text-xs text-amber-700/80"> US$ {35 * item.quantity}</span>
                          </>
                        ) : (
                          <>KSh {(item.price * item.quantity).toLocaleString()}</>
                        )}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 text-lg md:text-xl"
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
          <div ref={checkoutRef} className="mt-6 md:mt-8">
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl md:rounded-3xl p-4 md:p-8 border border-amber-200/50 shadow-2xl">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl text-amber-50">🛒</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-1 md:mb-2">Complete Your Order</h2>
                <p className="text-amber-700 text-sm md:text-base">Fill in your details to proceed with checkout</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 md:p-6 rounded-xl md:rounded-2xl border border-amber-300/30">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="text-xl md:text-2xl">📱</span>
                    <h4 className="font-bold text-amber-900 text-base md:text-lg">M-Pesa Payment</h4>
                  </div>
                  <p className="text-amber-800 text-xs md:text-sm">Secure mobile money payment</p>
                  <div className="mt-2 md:mt-3 text-xs text-amber-700 bg-amber-200/50 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                    ✓ Instant confirmation
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 md:p-6 rounded-xl md:rounded-2xl border border-orange-300/30">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="text-xl md:text-2xl">💳</span>
                    <h4 className="font-bold text-amber-900 text-base md:text-lg">Card Payment</h4>
                  </div>
                  <p className="text-amber-800 text-xs md:text-sm">VISA/MasterCard accepted</p>
                  <div className="mt-2 md:mt-3 text-xs text-amber-700 bg-orange-200/50 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                    ✓ Bank-level security
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50/50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-amber-200/30">
                <CheckoutSection />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CartPage;
