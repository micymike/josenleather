import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../lib/api';
import { fetchKshToUsdRate, convertKshToUsd } from '../../lib/utils';

interface Product {
  id: string | number;
  name: string;
  price: number;
  imageUrls: string[];
  description: string;
  category: string;
  rating: number;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const ProductPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const { getTotalItems, addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | number | null>(null);

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
    // Fetch products from API on mount
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();

    // Fetch exchange rate on mount
    const fetchRate = async () => {
      const rate = await fetchKshToUsdRate();
      setUsdRate(rate);
    };
    fetchRate();
  }, []);

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

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

  // Schema.org Product structured data
  const productStructuredData = filteredProducts.map((product) => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : "/logo.jpg",
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
  }));

  return (
    <React.Fragment>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }} />
      <div className="relative overflow-x-hidden min-h-screen">
        <style>{`
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
        <nav className="glass-nav fixed top-0 w-full z-50 px-4 md:px-8 py-4" style={{
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-2 md:gap-0">
            <Link to="/" className="text-2xl font-bold shimmer-text flex items-center gap-2" style={{ fontFamily: "'Edu NSW ACT Foundation', cursive", fontStyle: "italic" }}>
              <img src="/logo.jpg" alt="Josen Logo" className="h-8 w-auto" />
              <span className="hidden sm:inline">JOSEN LEATHER AND CANVAS</span>
              <span className="inline sm:hidden">JOSEN</span>
            </Link>
            <div className="flex gap-4 md:gap-8 items-center mt-2 md:mt-0">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-amber-900 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-110 relative group text-base md:text-lg"
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
        <div className="pt-24 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black shimmer-text mb-4">OUR COLLECTION</h1>
            <p className="text-base sm:text-lg md:text-xl text-amber-800/80">Discover premium leather craftsmanship</p>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-8">
            {/* Products Grid - Left Side */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <FloatingElement key={product.id} delay={index * 0.2} amplitude={12}>
                    <div 
                      className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 hover:scale-105 transition-all duration-500 cursor-pointer group animate-in slide-in-from-bottom duration-500"
                      style={{
                        transform: `perspective(800px) rotateY(${mousePos.x * 3}deg) rotateX(${-mousePos.y * 2}deg)`,
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="relative overflow-hidden rounded-xl md:rounded-2xl mb-4 md:mb-6">
                        {/* Image Carousel */}
                        {product.imageUrls && product.imageUrls.length > 1 ? (
                          <ProductImageCarousel imageUrls={product.imageUrls} productName={product.name} />
                        ) : (
                          <img
                            src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/logo.jpg'}
                            alt={product.name}
                            className="w-full h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Link
                          to={`/product/${product.id}`}
                          className="absolute top-2 md:top-3 right-2 md:right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          👁️
                        </Link>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-amber-900 mb-1 md:mb-2">{product.name}</h3>
                      <p className="text-amber-700/80 mb-2 md:mb-3 text-xs md:text-sm">{product.description}</p>
                      <div className="flex justify-between items-center mb-1 md:mb-2">
                        <span className="text-lg md:text-xl font-bold shimmer-text">
                          {usdRate !== null
                            ? `$${convertKshToUsd(product.price, usdRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '...'}
                        </span>
                        <div className="flex items-center">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-xs md:text-sm text-amber-700 ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <button
                        className="w-full glass-card px-3 py-2 md:px-4 md:py-2 rounded-full text-amber-900 hover:bg-amber-100/20 transition-all duration-300 text-xs md:text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Convert id to number, skip if not a valid number
                          const cartId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
                          if (typeof cartId === 'number' && !isNaN(cartId)) {
                            addToCart(
                              {
                                id: cartId,
                                name: product.name,
                                price: usdRate !== null ? Number((convertKshToUsd(product.price, usdRate)).toFixed(2)) : product.price,
                                image: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '',
                                imageUrls: product.imageUrls || [],
                              },
                              1
                            );
                            setAddedProductId(product.id);
                            setTimeout(() => setAddedProductId(null), 1200);
                          } else {
                            alert('Product ID is invalid and cannot be added to cart.');
                          }
                        }}
                      >
                        {addedProductId === product.id ? "Added!" : "Add to Cart"}
                      </button>
                    </div>
                  </FloatingElement>
                ))}
              </div>
            </div>
            {/* Filters - Right Side (becomes top on mobile) */}
            <div className="w-full md:w-80 mb-4 md:mb-0">
              <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 md:sticky md:top-24">
                <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-4 md:mb-6">Filters</h3>
                {/* Search */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-xs md:text-sm font-medium text-amber-800 mb-1 md:mb-2">Search Products</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 md:p-3 border border-amber-300/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent text-xs md:text-base"
                    placeholder="Search..."
                  />
                </div>
                {/* Category Filter */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-xs md:text-sm font-medium text-amber-800 mb-1 md:mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 md:p-3 border border-amber-300/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-amber-400 text-xs md:text-base"
                  >
                    <option value="">All Categories</option>
                    <option value="bags">Bags</option>
                    <option value="wallets">Wallets</option>
                    <option value="belts">Belts</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                {/* Price Range */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-xs md:text-sm font-medium text-amber-800 mb-1 md:mb-2">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs md:text-sm text-amber-700">
                      <span>KSh 0</span>
                      <span>KSh {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {/* Sort By */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-xs md:text-sm font-medium text-amber-800 mb-1 md:mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 md:p-3 border border-amber-300/30 rounded-xl bg-white/50 focus:ring-2 focus:ring-amber-400 text-xs md:text-base"
                  >
                    <option value="">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                {/* Results Count */}
                <div className="text-center text-amber-800">
                  <span className="font-medium text-xs md:text-base">{filteredProducts.length} products found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

/** Carousel component for product images */
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
    <div className="relative w-full h-40 md:h-48 flex items-center justify-center">
      <img
        src={imageUrls[current]}
        alt={productName}
        className="w-full h-40 md:h-48 object-cover transition-transform duration-700"
      />
      {/* Left arrow */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
        style={{ display: imageUrls.length > 1 ? 'block' : 'none' }}
        aria-label="Previous image"
      >
        &#8592;
      </button>
      {/* Right arrow */}
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
        style={{ display: imageUrls.length > 1 ? 'block' : 'none' }}
        aria-label="Next image"
      >
        &#8594;
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {imageUrls.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-orange-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
