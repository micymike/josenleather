import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNav from './SidebarNav';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../lib/api';

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];



const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, getTotalItems } = useCart();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const foundProduct = products.find((p: any) => String(p.id) === id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-amber-700 hover:text-amber-900">← Back to Products</Link>
        </div>
      </div>
    );
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

  // SEO: Helmet meta tags and JSON-LD structured data
  const productStructuredData = product
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.imageUrls?.[0] || product.image || "/logo1.jpg",
        "description": product.description,
        "category": product.category,
        "brand": {
          "@type": "Brand",
          "name": "Josen Leather"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": 1
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "KES",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "url": `https://www.josenleather.com/product/${product.id}`
        }
      }
    : null;

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      <Helmet>
        <title>{product ? `${product.name} | JOSEN NAIROBI` : "Product | JOSEN NAIROBI"}</title>
        <meta name="description" content={product ? product.description : "Product details for JOSEN NAIROBI."} />
        <link rel="canonical" href={product ? `https://www.josenleather.com/product/${product.id}` : "https://www.josenleather.com/products"} />
        <meta property="og:title" content={product ? `${product.name} | JOSEN NAIROBI` : "Product | JOSEN NAIROBI"} />
        <meta property="og:description" content={product ? product.description : "Product details for JOSEN NAIROBI."} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={product ? `https://www.josenleather.com/product/${product.id}` : "https://www.josenleather.com/products"} />
        <meta property="og:image" content={product ? (product.imageUrls?.[0] || product.image || "/logo1.jpg") : "https://www.josenleather.com/hero2.jpg"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product ? `${product.name} | JOSEN NAIROBI` : "Product | JOSEN NAIROBI"} />
        <meta name="twitter:description" content={product ? product.description : "Product details for JOSEN NAIROBI."} />
        <meta name="twitter:image" content={product ? (product.imageUrls?.[0] || product.image || "/logo1.jpg") : "https://www.josenleather.com/hero2.jpg"} />
        {productStructuredData && (
          <script type="application/ld+json">{JSON.stringify(productStructuredData)}</script>
        )}
      </Helmet>
      <style>{`
        @font-face {
          font-family: 'BankGothic Lt BT';
          src: local('BankGothic Lt BT'), url('/fonts/BankGothicLtBT.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
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
                  src={product.imageUrls?.[0] || product.image || '/logo1.jpg'}
                  alt={product.name}
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
              </div>
            </FloatingElement>
          </div>

          {/* Product Details - Right Side */}
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div>
              <h1 className="text-4xl font-black text-amber-900 mb-4" style={{ fontFamily: "'BankGothic Lt BT', Arial, sans-serif", letterSpacing: '2px', textTransform: 'uppercase' }}>
                {product.name} | JOSEN NAIROBI
              </h1>
              
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
              {product.features && (
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="text-amber-700/80 flex items-center">
                        <span className="text-amber-600 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="glass-card rounded-2xl p-6">
              {/* Belt Size Selector */}
              {product.category === "belts" && (
                <div className="mb-4">
                  <label className="font-semibold text-amber-900 block mb-2">Select Size (inches):</label>
                  <div className="flex flex-wrap gap-2">
                    {[34,36,38,40,42,44,46,48,50,52,54,56,58,60].map((size) => {
                      const available = Array.isArray(product.sizes) && product.sizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={!available}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1 rounded-lg border font-semibold text-sm transition-all duration-200
                            ${selectedSize === size ? "bg-amber-700 text-white border-amber-800" : ""}
                            ${!available ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : "bg-white text-amber-900 border-amber-300 hover:bg-amber-100"}
                          `}
                          style={{ minWidth: 44 }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedSize && (
                    <div className="text-xs text-red-600 mt-1">Please select a size</div>
                  )}
                </div>
              )}

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
                  if (product.category === "belts" && !selectedSize) {
                    setShowPopup(false);
                    alert("Please select a size before adding to cart.");
                    return;
                  }
                  addToCart({
                    id: String(product.id),
                    name: product.name,
                    price: product.price,
                    image: product.imageUrls?.[0] || product.image || '/logo1.jpg',
                    imageUrls: product.imageUrls,
                    ...(product.category === "belts" && { size: selectedSize })
                  }, quantity);
                  setShowPopup(true);
                  setTimeout(() => setShowPopup(false), 3000);
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                disabled={product.category === "belts" && !selectedSize}
                style={{ fontFamily: "'BankGothic Lt BT', Arial, sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}
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
