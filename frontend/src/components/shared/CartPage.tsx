import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const CartPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

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
      <style jsx>{`
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Summary - Left Side */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-3xl p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-amber-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-amber-800">Items ({getTotalItems()})</span>
                    <span className="font-medium text-amber-900">KSh {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800">Shipping</span>
                    <span className="font-medium text-amber-900">Free</span>
                  </div>
                  <hr className="border-amber-300/30" />
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-amber-900">Total</span>
                    <span className="shimmer-text">KSh {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-amber-600 to-orange-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg mb-4">
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
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-amber-900 mb-2">{item.name}</h4>
                        <p className="text-lg font-semibold shimmer-text mb-4">
                          KSh {item.price.toLocaleString()}
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
                              KSh {(item.price * item.quantity).toLocaleString()}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;