import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    description: "Premium Italian leather with brass hardware",
    category: "bags",
    rating: 4.8
  },
  {
    id: 2,
    name: "Vintage Messenger",
    price: 12500,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&crop=center",
    description: "Handcrafted canvas and leather blend",
    category: "bags",
    rating: 4.6
  },
  {
    id: 3,
    name: "Travel Duffle",
    price: 18700,
    image: "https://images.unsplash.com/photo-1553735491-c5c7a065da9b?w=400&h=400&fit=crop&crop=center",
    description: "Spacious weekend companion",
    category: "bags",
    rating: 4.9
  },
  {
    id: 4,
    name: "Leather Wallet",
    price: 4500,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop&crop=center",
    description: "Slim design with RFID protection",
    category: "wallets",
    rating: 4.7
  },
  {
    id: 5,
    name: "Classic Belt",
    price: 3200,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=400&fit=crop&crop=center",
    description: "Genuine leather with silver buckle",
    category: "belts",
    rating: 4.5
  },
  {
    id: 6,
    name: "Key Holder",
    price: 1800,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
    description: "Compact leather key organizer",
    category: "accessories",
    rating: 4.4
  }
];

const ProductPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let filtered = PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const FloatingElement = ({ children, delay = 0, amplitude = 20 }: { children: React.ReactNode, delay?: number, amplitude?: number }) => (
    <div
      className="floating-element"
      style={{
        transform: `translateY(${Math.sin(Date.now() * 0.001 + delay) * amplitude}px) rotate(${Math.sin(Date.now() * 0.0008 + delay) * 5}deg)`,
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
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
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

      {/* Glassmorphism Navigation */}
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
          <h1 className="text-5xl font-black shimmer-text mb-4">OUR COLLECTION</h1>
          <p className="text-xl text-amber-800/80">Discover premium leather craftsmanship</p>
        </div>

        <div className="flex gap-8">
          {/* Products Grid - Left Side */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <FloatingElement key={product.id} delay={index * 0.2} amplitude={12}>
                  <div 
                    className="glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-500 cursor-pointer group animate-in slide-in-from-bottom duration-500"
                    style={{
                      transform: `perspective(800px) rotateY(${mousePos.x * 3}deg) rotateX(${-mousePos.y * 2}deg)`,
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Link
                        to={`/product/${product.id}`}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        👁️
                      </Link>
                    </div>
                    
                    <h3 className="text-lg font-bold text-amber-900 mb-2">{product.name}</h3>
                    <p className="text-amber-700/80 mb-3 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold shimmer-text">KSh {product.price.toLocaleString()}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-amber-700 ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <button className="w-full glass-card px-4 py-2 rounded-full text-amber-900 hover:bg-amber-100/20 transition-all duration-300 text-sm font-medium">
                      Add to Cart
                    </button>
                  </div>
                </FloatingElement>
              ))}
            </div>
          </div>

          {/* Filters - Right Side */}
          <div className="w-80">
            <div className="glass-card rounded-3xl p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-amber-900 mb-6">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-800 mb-2">Search Products</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-amber-300/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Search..."
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-800 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-amber-300/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">All Categories</option>
                  <option value="bags">Bags</option>
                  <option value="wallets">Wallets</option>
                  <option value="belts">Belts</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-800 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-amber-700">
                    <span>KSh 0</span>
                    <span>KSh {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-800 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-amber-300/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="text-center text-amber-800">
                <span className="font-medium">{filteredProducts.length} products found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;