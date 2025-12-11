import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SidebarNav from './SidebarNav';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import ImpressiveLeatherLoader from './ImpressiveLeatherLoader';

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

const HERO_IMAGES = [
  '/hero5.jpg',
  '/hero1.jpg',
  '/hero2.jpg'
];

const ProductPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { products, loading, error } = useProducts();
  const { getTotalItems, addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | number | null>(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Hero image carousel
  useEffect(() => {
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
    "image": product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : "/logo1.jpg",
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
        <title>Shop Leather Bags, Belts, Wallets & Accessories | JOSEN NAIROBI</title>
        <meta name="description" content="Browse our collection of premium leather bags, belts, wallets, and accessories. Handcrafted for durability, style, and timeless elegance. Shop JOSEN NAIROBI today." />
        <link rel="canonical" href="https://www.josenleather.com/products" />
        <meta property="og:title" content="Shop Leather Bags, Belts, Wallets & Accessories | JOSEN NAIROBI" />
        <meta property="og:description" content="Browse our collection of premium leather bags, belts, wallets, and accessories. Handcrafted for durability, style, and timeless elegance. Shop JOSEN NAIROBI today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.josenleather.com/products" />
        <meta property="og:image" content="https://www.josenleather.com/hero2.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shop Leather Bags, Belts, Wallets & Accessories | JOSEN NAIROBI" />
        <meta name="twitter:description" content="Browse our collection of premium leather bags, belts, wallets, and accessories. Handcrafted for durability, style, and timeless elegance. Shop JOSEN NAIROBI today." />
        <meta name="twitter:image" content="https://www.josenleather.com/hero2.jpg" />
        <script type="application/ld+json">{JSON.stringify(productStructuredData)}</script>
      </Helmet>
      <div className="relative overflow-x-hidden min-h-screen">
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
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] success-notification">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] max-w-[90vw] backdrop-blur-sm border border-green-400/30">
              <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">Added to cart!</p>
                <p className="text-sm text-green-100">Product successfully added</p>
              </div>
              <Link
                to="/cart"
                className="flex-shrink-0 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
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
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
              {HERO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroImage(index)}
                  className={`transition-all duration-300 ${
                    index === currentHeroImage 
                      ? 'w-8 h-3 bg-white rounded-full' 
                      : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                  Premium Leather & Canvas Goods
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl text-white/95 font-light drop-shadow-lg max-w-2xl mx-auto">
                  Crafted for durability & timeless style
                </p>
                <button 
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 sm:px-14 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white/20"
                >
                  Browse Collection
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Filter Buttons */}
        <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-8">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <button 
              onClick={() => setSelectedCategory('')}
              className={`px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg ${
                selectedCategory === '' 
                  ? 'bg-amber-600 text-white shadow-amber-600/50 scale-105' 
                  : 'bg-white/60 text-amber-900 hover:bg-white/80 hover:scale-105'
              }`}
            >
              All Products
            </button>
            <button 
              onClick={() => setSelectedCategory('bags')}
              className={`px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg ${
                selectedCategory === 'bags' 
                  ? 'bg-amber-600 text-white shadow-amber-600/50 scale-105' 
                  : 'bg-white/60 text-amber-900 hover:bg-white/80 hover:scale-105'
              }`}
            >
              Leather Bags
            </button>
            <button 
              onClick={() => setSelectedCategory('belts')}
              className={`px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg ${
                selectedCategory === 'belts' 
                  ? 'bg-amber-600 text-white shadow-amber-600/50 scale-105' 
                  : 'bg-white/60 text-amber-900 hover:bg-white/80 hover:scale-105'
              }`}
            >
              Belts
            </button>
            <button 
              onClick={() => setSelectedCategory('wallets')}
              className={`px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg ${
                selectedCategory === 'wallets' 
                  ? 'bg-amber-600 text-white shadow-amber-600/50 scale-105' 
                  : 'bg-white/60 text-amber-900 hover:bg-white/80 hover:scale-105'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </section>

        {/* Products Section */}
        <section id="products-section" className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto pb-16">
          {/* Horizontal Filter Bar */}
          <div className="glass-card bg-white rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-amber-300/30 rounded-xl bg-white/60 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base placeholder:text-amber-700/50"
                  placeholder="Search products..."
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-amber-300/30 rounded-xl bg-white/60 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base font-medium"
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
                  className="px-4 py-3 border-2 border-amber-300/30 rounded-xl bg-white/60 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm sm:text-base font-medium"
                >
                  <option value="">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="bg-amber-600 text-white px-5 py-3 rounded-xl font-bold text-sm sm:text-base shadow-lg">
                  {filteredProducts.length} Products
                </div>
              </div>
            </div>
          </div>

          {/* Impressive Math-Themed Loader */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <ImpressiveLeatherLoader />
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product, index) => (
              <Link 
                key={product.id}
                to={`/product/${product.id}`}
className="glass-card bg-white/80 rounded-3xl p-5 cursor-pointer group hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl mb-5 shadow-lg aspect-square bg-gray-50">
                  {product.imageUrls && product.imageUrls.length > 1 ? (
                    <ProductImageCarousel imageUrls={product.imageUrls} productName={product.name} />
                  ) : (
                    <img
                      src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/logo1.jpg'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-amber-900 line-clamp-2 leading-snug min-h-[3rem]">
                    {product.name}
                  </h3>
                  
                  <p className="text-amber-700/80 text-sm line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl sm:text-2xl font-bold text-amber-900">
                      KES {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1 bg-yellow-100/50 px-3 py-1 rounded-full">
                      <span className="text-yellow-500 text-base">⭐</span>
                      <span className="text-sm font-semibold text-amber-800">{product.rating}</span>
                    </div>
                  </div>
                  
                  <button
                    className="w-full glass-card px-5 py-3 rounded-full text-amber-900 hover:bg-amber-100/30 text-sm font-bold transition-all duration-300 hover:scale-105 mt-4"
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
                    {addedProductId === product.id ? "✓ Added!" : "Add to Cart"}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 py-16 px-6 bg-gradient-to-r from-amber-900/90 to-orange-800/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Logo and Tagline */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <img src="/logo1.jpg" alt="JOSEN NAIROBI Logo" className="h-16 w-auto" />
                <p className="text-white/90 text-base text-center md:text-left">
                  Crafted with care
                </p>
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-col items-center">
                <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                <div className="flex flex-col gap-3 text-white/80">
                  <Link to="/about" className="hover:text-amber-200 transition-colors font-medium text-center">
                    About Us
                  </Link>
                  <Link to="/cart" className="hover:text-amber-200 transition-colors font-medium text-center">
                    Cart
                  </Link>
                  <a href="#contact" className="hover:text-amber-200 transition-colors font-medium text-center">
                    Contact
                  </a>
                  <a href="#shipping" className="hover:text-amber-200 transition-colors font-medium text-center">
                    Shipping
                  </a>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="flex flex-col items-center md:items-end">
                <h3 className="text-white font-bold text-lg mb-4">Connect With Us</h3>
                <div className="text-white/80 text-center md:text-right space-y-2">
                  <p className="font-medium">Nairobi, Kenya</p>
                  <p>Premium Leather Goods</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/20 text-center">
              <p className="text-white/70 text-sm">
                © {new Date().getFullYear()} JOSEN NAIROBI. All rights reserved.
              </p>
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
    <div className="relative w-full h-full flex items-center justify-center group bg-gray-50">
      <img
        src={imageUrls[current]}
        alt={productName}
        className="w-full h-full object-contain transition-transform duration-700"
      />
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ display: imageUrls.length > 1 ? 'block' : 'none' }}
        aria-label="Previous image"
      >
        <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ display: imageUrls.length > 1 ? 'block' : 'none' }}
        aria-label="Next image"
      >
        <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {imageUrls.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-2 h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-orange-500 w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
