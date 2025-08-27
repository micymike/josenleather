import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Executive Briefcase",
    price: 15900,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&crop=center",
    description: "Premium Italian leather with brass hardware. This executive briefcase is crafted from the finest Italian leather, featuring durable brass hardware and a sophisticated design perfect for the modern professional. The spacious interior includes multiple compartments for laptops, documents, and business essentials.",
    category: "bags",
    rating: 4.8,
    features: ["Premium Italian Leather", "Brass Hardware", "Laptop Compartment", "Document Organizer"]
  },
  {
    id: 2,
    name: "Vintage Messenger",
    price: 12500,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop&crop=center",
    description: "Handcrafted canvas and leather blend. A perfect fusion of durability and style, this vintage messenger bag combines high-quality canvas with genuine leather accents. Ideal for daily commutes, travel, or casual outings.",
    category: "bags",
    rating: 4.6,
    features: ["Canvas & Leather Blend", "Adjustable Strap", "Multiple Pockets", "Vintage Design"]
  },
  {
    id: 3,
    name: "Travel Duffle",
    price: 18700,
    image: "https://images.unsplash.com/photo-1553735491-c5c7a065da9b?w=600&h=600&fit=crop&crop=center",
    description: "Spacious weekend companion. This premium travel duffle bag offers ample space for all your weekend getaway essentials. Crafted from durable materials with reinforced handles and a detachable shoulder strap.",
    category: "bags",
    rating: 4.9,
    features: ["Large Capacity", "Reinforced Handles", "Detachable Strap", "Weekend Travel"]
  }
];

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart, getTotalItems } = useCart();
  
  const product = PRODUCTS.find(p => p.id === parseInt(id || '0'));

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

  if (!product) {
    return <div>Product not found</div>;
  }

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
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Image - Left Side */}
          <div className="animate-in slide-in-from-left duration-500">
            <FloatingElement amplitude={15}>
              <div 
                className="glass-card rounded-3xl p-8"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 3}deg)`
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
              </div>
            </FloatingElement>
          </div>

          {/* Product Details - Right Side */}
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div>
              <h1 className="text-4xl font-black text-amber-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-amber-700 font-medium">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold shimmer-text">KSh {product.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-3">Description</h3>
              <p className="text-amber-800/80 leading-relaxed mb-4">{product.description}</p>
              
              {/* Features */}
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Features:</h4>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-amber-700/80 flex items-center">
                      <span className="text-amber-600 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="font-semibold text-amber-900">Quantity:</label>
                <div className="flex items-center border border-amber-300/30 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-amber-900 hover:bg-amber-100/20 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium text-amber-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-amber-900 hover:bg-amber-100/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                  }, quantity);
                  setShowPopup(true);
                  setTimeout(() => setShowPopup(false), 3000);
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Add {quantity} to Cart - KSh {(product.price * quantity).toLocaleString()}
              </button>
            </div>

            {/* Back to Products */}
            <Link
              to="/products"
              className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium transition-colors"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
      
      {/* Add to Cart Popup */}
      {showPopup && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right duration-300">
          <div className="glass-card rounded-2xl p-4 shadow-2xl border border-green-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-bold text-green-800">Added to Cart!</p>
                <p className="text-sm text-green-700">{quantity} x {product.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;