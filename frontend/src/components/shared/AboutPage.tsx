import React, { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Executive Briefcase",
    price: "KSh 15,900",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    description: "Premium Italian leather with brass hardware"
  },
  {
    id: 2,
    name: "Vintage Messenger",
    price: "KSh 12,500",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&crop=center",
    description: "Handcrafted canvas and leather blend"
  },
  {
    id: 3,
    name: "Travel Duffle",
    price: "KSh 18,700",
    image: "https://images.unsplash.com/photo-1553735491-c5c7a065da9b?w=400&h=400&fit=crop&crop=center",
    description: "Spacious weekend companion"
  }
];

const FEATURES = [
  "✅ Full-Grain Leather – Premium quality that ages beautifully",
  "✅ Waxed Canvas – Weather-resistant and built for the elements",
  "✅ Handcrafted Details – Precision-made with care and integrity",
  "✅ Functional Design – Designed to serve, built to endure"
];

const COLLECTIONS = [
  { icon: "👜", name: "Malkia Collection", desc: "Minimalist, expressive, and elegant — perfect for those who find strength in simplicity." },
  { icon: "🌿", name: "Safari Collection", desc: "Raw elegance — perfect blend with nature, agility and simplicity." },
  { icon: "👑", name: "Binti Mfalme Collection", desc: "A refined leather handbag that balances classic beauty with modern grace." },
  { icon: "🧳", name: "Mfalme Classic Collection", desc: "Bridging tradition and innovation — ideal for professionals on the move." },
  { icon: "🌍", name: "Expeditioner Travel Collection", desc: "Durable, stylish, and travel-ready — designed for those who explore with purpose." },
  { icon: "🎒", name: "Hakuna Matata Collection", desc: "Lightweight and adventurous — a perfect match for on-the-go lifestyles." },
  { icon: "👔", name: "Ventura Leather Belt and Wallet Collection", desc: "Timeless accessories that add understated luxury to any wardrobe." }
];

const WHY_CHOOSE = [
  "🌱 Sustainably sourced materials"
];

const AboutPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject OneSignal SDK and initialize for users
    const script = document.createElement('script');
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    document.body.appendChild(script);

    (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];
    (window as any).OneSignalDeferred.push(async function(OneSignal: any) {
      await OneSignal.init({
        appId: "9c2b21d1-2a24-4fdc-b253-2af835698b62",
        safari_web_id: "web.onesignal.auto.1947bcbb-3df5-45a5-b464-0be0e15f4a2c",
        notifyButton: {
          enable: true,
        },
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = Math.floor(window.scrollY / (window.innerHeight * 0.8));
      setActiveSection(Math.min(sections, 3));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <div ref={containerRef} className="relative overflow-x-hidden">
      {/* Custom CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(101, 67, 33, 0.3); }
          50% { box-shadow: 0 0 40px rgba(101, 67, 33, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .glass-nav {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
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
        .glow-button {
          animation: glow 2s ease-in-out infinite;
          background: linear-gradient(135deg, #8B4513 0%, #654321 50%, #3D2817 100%);
        }
        .parallax-bg {
          transform: translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002});
          opacity: ${Math.max(0.1, 1 - scrollY * 0.001)};
        }
        .hero-3d {
          transform: perspective(1000px) 
                    rotateX(${mousePos.y * 5}deg) 
                    rotateY(${mousePos.x * 10}deg) 
                    translateZ(${Math.abs(mousePos.x) * 50}px);
          transition: transform 0.1s ease-out;
        }
        .text-3d {
          text-shadow: 
            0 1px 0 #8B4513,
            0 2px 0 #654321,
            0 3px 0 #3D2817,
            0 4px 5px rgba(0,0,0,0.3),
            0 8px 10px rgba(0,0,0,0.2),
            0 15px 20px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Background with Parallax */}
      <div className="fixed inset-0 -z-20">
        <div 
          className="parallax-bg w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-orange-900/10"
          style={{
            transform: `translateY(${scrollY * -0.3}px)`
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} amplitude={30}>
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={2} amplitude={25}>
          <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 rounded-lg rotate-45 blur-lg" />
        </FloatingElement>
        <FloatingElement delay={4} amplitude={20}>
          <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-r from-orange-400/40 to-red-500/40 rounded-full blur-md" />
        </FloatingElement>
      </div>

      {/* Glassmorphism Navigation */}
      <nav className="glass-nav fixed top-0 w-full z-50 px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold shimmer-text flex items-center gap-2" style={{ fontFamily: "'Edu NSW ACT Foundation', cursive", fontStyle: "italic" }}>
            <img src="/logo.jpg" alt="Josen Logo" className="h-8 w-auto" />
            JOSEN LEATHER AND CANVAS
          </div>
          <div className="flex gap-8">
            {NAV_LINKS.map((link, index) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-amber-900 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-110 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-amber-900 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-110 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300" />
                </a>
              )
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Effects */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center pt-20 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-black text-3d leading-tight text-amber-900">
                Handcrafted Leather Bags & Waxed Canvas Goods Made to Last a Lifetime
              </h1>
              <p className="text-xl text-amber-800/80 leading-relaxed max-w-lg">
                Josen Leather and Canvas creates heirloom-quality bags, belts, wallets, and accessories handcrafted with full-grain leather,
                rugged waxed canvas, and high-grade hardware. Every piece is built with soul, carried with purpose, and designed to stand the test
                of time.
              </p>
              <h2 className="text-2xl font-bold text-amber-900 mt-4">
                Timeless Design. Exceptional Craftsmanship.
              </h2>
              <p className="text-lg text-amber-800">
                We don&#39;t just make leather goods we craft meaningful companions for your everyday life and lifelong journeys. Our products
                blend tradition and utility, with every cut and stitch reflecting a commitment to quality, durability, and style.
              </p>
            </div>

            {/* Floating Features */}
            <div className="flex flex-wrap gap-4">
              {FEATURES.map((feature, index) => (
                <FloatingElement key={feature} delay={index} amplitude={10}>
                  <div className="glass-card px-4 py-2 rounded-full text-sm font-medium text-amber-900">
                    {feature}
                  </div>
                </FloatingElement>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-6">
              <button className="glow-button px-8 py-4 text-white font-bold rounded-full text-lg hover:scale-105 transition-all duration-300 shadow-2xl">
                Explore Collection
              </button>
              <button className="glass-card px-8 py-4 text-amber-900 font-bold rounded-full text-lg hover:scale-105 transition-all duration-300 border border-amber-300/30">
                Watch Craftsmanship
              </button>
            </div>
          </div>

          {/* 3D Product Showcase */}
          <div className="relative">
            <div 
              className="hero-3d relative z-10"
              style={{
                transform: `perspective(1200px) 
                          rotateY(${mousePos.x * 15}deg) 
                          rotateX(${-mousePos.y * 10}deg) 
                          translateZ(${Math.abs(mousePos.x + mousePos.y) * 30}px)
                          scale(${1 + Math.abs(mousePos.x) * 0.1})`
              }}
            >
              <div className="glass-card p-8 rounded-3xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop&crop=center"
                  alt="Premium Leather Bag"
                  className="w-full h-auto rounded-2xl shadow-xl"
                  style={{
                    filter: 'drop-shadow(0 20px 40px rgba(101,67,33,0.3))'
                  }}
                />
              </div>
              
              {/* Floating Price Tag */}
              <FloatingElement delay={1} amplitude={15}>
                <div className="absolute -top-4 -right-4 glass-card px-4 py-2 rounded-full">
                  <span className="text-lg font-bold text-amber-900">KSh 15,900</span>
                </div>
              </FloatingElement>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-3xl scale-150 -z-10" />
          </div>
        </div>
      </section>

      {/* Products Section with Interactive 3D Grid */}
      <section id="products" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black shimmer-text mb-4">
              Explore Our Signature Leather & Canvas Collections
            </h2>
            <p className="text-xl text-amber-800/80 max-w-2xl mx-auto">
              {COLLECTIONS.map((col, idx) => (
                <span key={col.name} className="block mb-2">
                  {col.icon} <b>{col.name}</b> - {col.desc}
                </span>
              ))}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PRODUCTS.map((product, index) => (
              <FloatingElement key={product.id} delay={index * 0.5} amplitude={12}>
                <div 
                  className="glass-card rounded-3xl p-6 hover:scale-105 transition-all duration-500 cursor-pointer group"
                  style={{
                    transform: `perspective(800px) rotateY(${mousePos.x * 3}deg) rotateX(${-mousePos.y * 2}deg)`
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-amber-700/80 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold shimmer-text">
                      {product.price}
                    </span>
                    <button className="glass-card px-4 py-2 rounded-full text-amber-900 hover:bg-amber-100/20 transition-all duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Morphing Text */}
      <section className="py-32 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black text-3d mb-8">
                Why Choose Josen?
              </h2>
              <ul className="list-none space-y-4 text-lg text-amber-900">
                {WHY_CHOOSE.map((why, idx) => (
                  <li key={idx}>{why}</li>
                ))}
              </ul>
              <div className="space-y-6 mt-8">
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    🏆 Award-Winning Design
                  </h3>
                  <p className="text-amber-800/80">
                    Recognized internationally for innovative leather craftsmanship and sustainable practices.
                  </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    🚚 Express Delivery
                  </h3>
                  <p className="text-amber-800/80">
                    Same-day delivery in Nairobi, nationwide shipping with real-time tracking.
                  </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    💳 Secure Payments
                  </h3>
                  <p className="text-amber-800/80">
                    M-Pesa integration, VISA/MasterCard support with bank-level security.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <FloatingElement amplitude={25}>
                <div 
                  className="hero-3d glass-card p-8 rounded-3xl"
                  style={{
                    transform: `perspective(1000px) rotateY(${-mousePos.x * 10}deg) rotateX(${mousePos.y * 5}deg)`
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop&crop=center"
                    alt="Craftsmanship"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </FloatingElement>
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-amber-400/40 to-orange-500/40 rounded-full blur-lg floating-element" />
              <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-yellow-400/50 to-amber-500/50 rounded-lg rotate-45 blur-md floating-element" style={{animationDelay: '1s'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action with Animated Background */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-orange-800" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl font-black text-white mb-8 text-3d">
            READY TO ELEVATE YOUR STYLE?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've discovered the perfect blend 
            of luxury, functionality, and timeless design.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="glow-button text-white px-12 py-4 bg-white font-bold rounded-full text-xl hover:scale-105 transition-all duration-300 shadow-2xl">
              Shop Now
            </button>
            <button className="glass-card px-12 py-4 text-white font-bold rounded-full text-xl hover:scale-105 transition-all duration-300 border border-white/30">
              Book Consultation
            </button>
          </div>
        </div>
        <FloatingElement delay={0} amplitude={20}>
          <div className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={2} amplitude={30}>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-yellow-400/20 rounded-lg rotate-45 blur-lg" />
        </FloatingElement>
      </section>
    </div>
  );
};

export default AboutPage;
