import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNav from './SidebarNav';
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
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/*
const MOCK_PRODUCTS: Product[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    name: "Leather Bag",
    price: 15900,
    imageUrls: ["/brown_bag.jpg"],
    description: "Premium brown leather bag with elegant design",
    category: "bags",
    rating: 4.8
  },

  {
    id: "b2c3d4e5-f6a1-8907-bcda-2345678901bc",
    name: "Premium Leather Bag",
    price: 18700,
    imageUrls: ["/blue_bag.jpg"],
    description: "Elegant blue leather bag with premium craftsmanship",
    category: "bags",
    rating: 4.9
  },

  {
    id: "c3d4e5f6-a1b2-9078-cdab-3456789012cd",
    name: "Classic Leather Belt",
    price: 4200,
    imageUrls: ["/belt.jpg"],
    description: "Full-grain leather with silver buckle",
    category: "belts",
    rating: 4.5
  },

  {
    id: "d4e5f6a1-b2c3-0789-dabc-4567890123de",
    name: "Premium Leather Belt",
    price: 5200,
    imageUrls: ["/hero4.jpg"],
    description: "Handcrafted premium leather belt with polished brass buckle. Made from full-grain Italian leather, this belt combines durability with sophisticated style. Perfect for both formal and casual occasions, featuring precise stitching and a timeless design that complements any wardrobe.",
    category: "belts",
    rating: 4.9
  },
  {
    id: "e5f6a1b2-c3d4-7890-abcd-5678901234ef",
    name: "Classic Dark Brown Leather Belt",
    price: 4500,
    imageUrls: ["/dark_brown_belt.jpg"],
    description: "Timeless classic dark brown leather belt with a sleek design. Made from high-quality full-grain leather, this belt is perfect for both formal and casual wear. Its durable construction ensures it will last for years, while the elegant buckle adds a touch of sophistication.",
    category: "belts",
    rating: 4.7
  }

];
*/

const HERO_IMAGES = [
  '/hero1.jpg',
  '/hero2.jpg',
  '/hero3.jpg'
];

const ProductPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { getTotalItems, addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | number | null>(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const fetchRate = async () => {
      const rate = await fetchKshToUsdRate();
      setUsdRate(rate);
    };
    fetchRate();

    // Hero image carousel
    const heroTimer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(heroTimer);
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
      <Helmet>
        <title>Shop Leather Bags, Belts, Wallets & Accessories | Josen Leather</title>
        <meta name="description" content="Browse our collection of premium leather bags, belts, wallets, and accessories. Handcrafted for durability, style, and timeless elegance. Shop Josen Leather today." />
        <link rel="canonical" href="https://www.josenleather.com/products" />
        <meta property="og:title" content="Shop Leather Bags, Belts, Wallets & Accessories | Josen Leather" />
        <meta property="og:description" content="Browse our collection of premium leather bags, belts, wallets, and accessories. Handcrafted for durability, style, and timeless elegance. Shop Josen Leather today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.josenleather.com/products" />
        <meta property="og:image" content="https://www.josenleather.com/leather_bag.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shop Leather Bags, Belts, Wallets & Accessories | Josen Leather" />
        <meta name="twitter:description" content="Browse our collection of premium leather bags, belts, wallets, and accessories. Handcrafted for durability, style, and timeless elegance. Shop Josen Leather today." />
        <meta name="twitter:image" content="https://www.josenleather.com/leather_bag.jpg" />
        <script type="application/ld+json">{JSON.stringify(productStructuredData)}</script>
      </Helmet>
      <div className="relative overflow-x-hidden min-h-screen">
        <style>{`
          .glass-card {
            backdrop-filter: blur(25px);
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
        `}</style>
        
        {/* Background with Parallax */}
        <div className="fixed inset-0 -z-20">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/background.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/70 to-yellow-100/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-orange-900/10" />
        </div>

        {/* Floating geometric shapes */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl" />
          <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 rounded-lg rotate-45 blur-lg" />
          <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-r from-orange-400/40 to-red-500/40 rounded-full blur-md" />
        </div>
        
        {/* Success Notification */}
        {addedProductId !== null && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] success-notification">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] max-w-[90vw] backdrop-blur-sm border border-green-400/30">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Added to cart!</p>
                <p className="text-xs text-green-100">Product successfully added</p>
              </div>
              <Link
                to="/cart"
                className="flex-shrink-0 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <SidebarNav />



        {/* Hero Image Section */}
        <section className="pt-0 relative">
          <div className="relative h-screen overflow-hidden">
            {/* Hero Background Images */}
            {HERO_IMAGES.map((image, index) => (
              <div 
                key={index}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                  index === currentHeroImage ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url('${image}')`,
                }}
              />
            ))}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
            
            {/* Hero Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {HERO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentHeroImage ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  Premium Leather & Canvas Goods
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-md">
                  Crafted for durability & timeless style
                </p>
              </div>
              
              <button 
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white/20"
              >
                Browse Collection
              </button>
            </div>
          </div>
        </section>

        {/* Quick Filter Buttons */}
        <section className="px-3 sm:px-4 md:px-8 max-w-7xl mx-auto mb-6 mt-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
            <button 
              onClick={() => setSelectedCategory('')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedCategory === '' ? 'bg-amber-600 text-white' : 'bg-white/50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              All Products
            </button>
            <button 
              onClick={() => setSelectedCategory('bags')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'bags' ? 'bg-amber-600 text-white' : 'bg-white/50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              Leather Bags
            </button>
            <button 
              onClick={() => setSelectedCategory('belts')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'belts' ? 'bg-amber-600 text-white' : 'bg-white/50 text-amber-900 hover:bg-amber-100'
              }`}
            >
             Belts
            </button>
            <button 
              onClick={() => setSelectedCategory('wallets')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'wallets' ? 'bg-amber-600 text-white' : 'bg-white/50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              New Arrivals
            </button>
          
              
            
          </div>
        </section>

        {/* Products Section */}
        <section id="products-section" className="px-3 sm:px-4 md:px-8 max-w-7xl mx-auto">
          {/* Horizontal Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 glass-card rounded-xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 sm:py-2 border border-amber-300/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-amber-400 text-xs sm:text-sm w-48 sm:w-64"
                placeholder="Search..."
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 py-1.5 sm:py-2 border border-amber-300/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-amber-400 text-xs sm:text-sm"
              >
                <option value="">All Categories</option>
                <option value="bags">Bags</option>
                <option value="wallets">Wallets</option>
                <option value="belts">Belts</option>
                <option value="accessories">Accessories</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1.5 sm:py-2 border border-amber-300/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-amber-400 text-xs sm:text-sm"
              >
                <option value="">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            <div className="text-amber-800 font-medium text-xs sm:text-sm">
              {filteredProducts.length} products
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-amber-900 font-medium">Loading products...</p>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <Link 
                key={product.id}
                to={`/product/${product.id}`}
                className="glass-card rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 cursor-pointer group hover:scale-105 transition-transform duration-300"
              >
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-4">
                  {product.imageUrls && product.imageUrls.length > 1 ? (
                    <ProductImageCarousel imageUrls={product.imageUrls} productName={product.name} />
                  ) : (
                    <img
                      src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/logo.jpg'}
                      alt={product.name}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-amber-900 mb-1 sm:mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-amber-700/80 mb-2 sm:mb-3 text-xs sm:text-sm line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  {/* Show both KES and USD for Bag and Belt */}
<span className="text-base sm:text-lg md:text-xl font-bold flex flex-col items-start">
  <span>
    KES {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </span>
  <span className="text-xs text-amber-700/80">
    {usdRate !== null
      ? `US$ ${convertKshToUsd(product.price, usdRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : ""}
  </span>
</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-xs sm:text-sm text-amber-700 ml-1">{product.rating}</span>
                  </div>
                </div>
                <button
                  className="w-full glass-card px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-amber-900 hover:bg-amber-100/20 text-xs sm:text-sm font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof product.id === 'string' && product.id.trim() !== '') {
                      addToCart(
                        {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '',
                          imageUrls: product.imageUrls || [],
                        },
                        1
                      );
                      setAddedProductId(product.id);
                      setTimeout(() => setAddedProductId(null), 3000);
                    } else {
                      alert('Product ID is invalid and cannot be added to cart.');
                    }
                  }}
                >
                  {addedProductId === product.id ? "Added!" : "Add to Cart"}
                </button>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 py-12 px-8 bg-gradient-to-r from-amber-900/90 to-orange-800/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Josen Logo" className="h-12 w-auto" />
                <div>
                  <h3 className="text-xl font-bold text-white">JOSEN LEATHER & CANVAS</h3>
                  <p className="text-white/80 text-sm">Crafted with care since 2025</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-white">
                <Link to="/about" className="hover:text-amber-200 transition-colors font-medium">About Us</Link>
                <Link to="/cart" className="hover:text-amber-200 transition-colors font-medium">Cart</Link>
                <a href="#contact" className="hover:text-amber-200 transition-colors font-medium">Contact</a>
                <a href="#shipping" className="hover:text-amber-200 transition-colors font-medium">Shipping</a>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 text-center text-white/60 text-sm">
              © 2025 Josen Leather & Canvas. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
};

/** Carousel component for product images */
const ProductImageCarousel: React.FC<{ imageUrls: string[]; productName: string }> = ({ imageUrls, productName }) => {
  const [current, setCurrent] = React.useState(0);

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
    <div className="relative w-full h-48 sm:h-56 md:h-64 flex items-center justify-center">
      <img
        src={imageUrls[current]}
        alt={productName}
        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-700"
      />
      <button
        onClick={prevImage}
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 sm:p-1.5 shadow hover:bg-white z-10 text-xs sm:text-sm"
        style={{ display: imageUrls.length > 1 ? 'block' : 'none' }}
        aria-label="Previous image"
      >
        ←
      </button>
      <button
        onClick={nextImage}
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 sm:p-1.5 shadow hover:bg-white z-10 text-xs sm:text-sm"
        style={{ display: imageUrls.length > 1 ? 'block' : 'none' }}
        aria-label="Next image"
      >
        →
      </button>
      <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {imageUrls.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${idx === current ? 'bg-orange-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
