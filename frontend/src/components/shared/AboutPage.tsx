import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';

// Types
interface NavLink {
  label: string;
  href: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  description: string;
  category: string;
  rating: number;
}

interface Collection {
  icon: string;
  name: string;
  desc: string;
}

interface MousePosition {
  x: number;
  y: number;
}

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  amplitude?: number;
}

// Constants
const NAV_LINKS: NavLink[] = [
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Leather Bag",
    price: 15900,
    imageUrls: ["/brown_bag.jpg"],
    description: "Premium brown leather bag with elegant design",
    category: "bags",
    rating: 4.8
  },
  {
    id: "3",
    name: "Premium Leather Bag",
    price: 18700,
    imageUrls: ["/blue_bag.jpg"],
    description: "Elegant blue leather bag with premium craftsmanship",
    category: "bags",
    rating: 4.9
  },
  {
    id: "5",
    name: "Classic Belt",
    price: 4200,
    imageUrls: ["/belt.jpg"],
    description: "Full-grain leather with silver buckle",
    category: "belts",
    rating: 4.5
  },
  {
    id: "9",
    name: "Premium Leather Belt",
    price: 5200,
    imageUrls: ["/hero4.jpg"],
    description: "Handcrafted premium leather belt with polished brass buckle. Made from full-grain Italian leather, this belt combines durability with sophisticated style. Perfect for both formal and casual occasions, featuring precise stitching and a timeless design that complements any wardrobe.",
    category: "belts",
    rating: 4.9
  }
];

const FEATURES: string[] = [
  "✅ Full-Grain Leather – Premium quality that ages beautifully",
  "✅ Waxed Canvas – Weather-resistant and built for the elements",
  "✅ Handcrafted Details – Precision-made with care and integrity",
  "✅ Functional Design – Designed to serve, built to endure"
];

const WHY_CHOOSE_US: string[] = [
  "🌱 Sustainably sourced materials"
];

const COMPANY_INFO = {
  name: "JOSEN LEATHER AND CANVAS",
  logo: "/logo.jpg",
  heroImage: "blue_bag.jpg",
  oneSignalAppId: "9c2b21d1-2a24-4fdc-b253-2af835698b62",
  safariWebId: "web.onesignal.auto.1947bcbb-3df5-45a5-b464-0be0e15f4a2c"
};

const ABOUT_CONTENT = {
  title: "About Josen Leather and Canvas",
  paragraphs: [
    "At Josen Leather and Canvas, we believe that the things we carry should carry meaning. Each piece in our collection is a testament to craftsmanship, character, and the enduring pursuit of quality. We do not just make bags and belts — we create heirloom-quality goods that evolve with you over time, telling your story through every scratch, stain, and journey.",
    "Rooted in the tradition of meticulous handcrafting, Josen combines premium full-grain leather, resilient waxed canvas, and solid, high-grade hardware to ensure every product stands the test of time. Every stitch and cut reflects our commitment to integrity, function, and style — modern designs shaped by timeless ideals.",
    "At Josen, form follows purpose. We design not for trends, but for people — people who value stories over statements, substance over excess. Our products are made to be lived in, worn proud, and passed down.",
  ],
  collections: {
    "Malkia Signature": "tote bags are minimalist yet expressive, crafted for those who find beauty in simplicity and power in elegance.",
    "Binti Mfalme Class": "handbags are the embodiment of elegance — thoughtfully designed and exquisitely crafted to accentuate grace, confidence, and refined style in every detail.",
    "Mfalme Classic": "leather briefcases bridge the past and future, offering refined compartments and sleek silhouettes tailored for today's professionals — from boardroom to café.",
    "Expeditioner": "duffle bags, built for the traveler with intent, are more than just carriers — they're companions that absorb the dust and discovery of every road taken.",
    "Hakuna Matata": "sling bags are for the spirited wanderer — dynamic, lightweight, and effortlessly bold, they move with you like a second skin, ready for spontaneity and adventure.",
    "Ventura Leather Belts": "embody luxury, style, and timeless class — meticulously crafted to complement the modern lady and gentleman with understated sophistication and enduring quality.",
    "Ventura wallets": "evoke the golden age of refinement, where ladies and gentlemen carried not just accessories, but symbols of grace, dignity, and timeless class."
  },
  closingStatement: "Josen Leather and Canvas — Crafted with soul. Carried with purpose. Built for a lifetime of journeys."
};

const SERVICE_FEATURES = [
  {
    icon: "🏆",
    title: "Award-Winning Design",
    description: "Recognized internationally for innovative leather craftsmanship and sustainable practices."
  },
  {
    icon: "🚚",
    title: "Express Delivery",
    description: "Same-day delivery in Nairobi, nationwide shipping with real-time tracking."
  },
  {
    icon: "💳",
    title: "Secure Payments",
    description: "M-Pesa integration, VISA/MasterCard support with bank-level security."
  }
];

// Styles
const COMPONENT_STYLES = `
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
  .text-3d {
    text-shadow: 
      0 1px 0 #8B4513,
      0 2px 0 #654321,
      0 3px 0 #3D2817,
      0 4px 5px rgba(0,0,0,0.3),
      0 8px 10px rgba(0,0,0,0.2),
      0 15px 20px rgba(0,0,0,0.1);
  }
`;

// Components
const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  delay = 0, 
  amplitude = 20 
}) => (
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

const Navigation: React.FC = () => (
  <nav className="glass-nav fixed top-0 w-full z-50 px-4 sm:px-8 py-3 sm:py-4">
    <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-2 sm:gap-0">
      <div
        className="text-xl sm:text-2xl font-bold shimmer-text flex items-center gap-2"
        style={{ fontFamily: "'Edu NSW ACT Foundation', cursive", fontStyle: "italic" }}
      >
        <img
          src={COMPANY_INFO.logo}
          alt="Josen Logo"
          className="h-7 sm:h-8 w-auto"
        />
        <span className="hidden sm:inline">{COMPANY_INFO.name}</span>
        <span className="inline sm:hidden">JOSEN</span>
      </div>
      <div className="flex gap-4 sm:gap-8">
        {NAV_LINKS.map((link) =>
          link.href.startsWith('/') ? (
            <Link
              key={link.label}
              to={link.href}
              className="text-amber-900 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-110 relative group text-base sm:text-lg"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="text-amber-900 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-110 relative group text-base sm:text-lg"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300" />
            </a>
          )
        )}
      </div>
    </div>
  </nav>
);

const BackgroundElements: React.FC<{ scrollY: number }> = ({ scrollY }) => (
  <>
    {/* Background with Parallax */}
    <div className="fixed inset-0 -z-20">
      <div 
        className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100"
        style={{
          transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`,
          opacity: Math.max(0.1, 1 - scrollY * 0.001)
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-orange-900/10"
        style={{ transform: `translateY(${scrollY * -0.3}px)` }}
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
  </>
);

const AboutContent: React.FC = () => (
  <div className="glass-card p-8 rounded-3xl shadow-2xl text-amber-900 text-lg leading-relaxed max-w-2xl mx-auto">
    <h1 className="text-4xl lg:text-5xl font-black text-3d mb-6 text-center">
      {ABOUT_CONTENT.title}
    </h1>
    
    {/* Main paragraphs */}
    {ABOUT_CONTENT.paragraphs.slice(0, 2).map((paragraph, index) => (
      <p key={index} className={index > 0 ? "mt-4" : ""}>
        {paragraph}
      </p>
    ))}
    
    {/* Collections section */}
    <p className="mt-4">
      Our collection is diverse, yet unified by purpose.<br />
      {Object.entries(ABOUT_CONTENT.collections).map(([name, description], index) => (
        <span key={name}>
          <b>{name}</b> {description}
          {index < Object.entries(ABOUT_CONTENT.collections).length - 1 && <br />}
        </span>
      ))}
    </p>
    
    {/* Final paragraphs */}
    {ABOUT_CONTENT.paragraphs.slice(2).map((paragraph, index) => (
      <p key={index + 2} className="mt-4">
        {paragraph}
      </p>
    ))}
    
    <p className="mt-4 font-bold text-center">
      {ABOUT_CONTENT.closingStatement}
    </p>
  </div>
);

const HeroSection: React.FC<{ mousePos: MousePosition }> = ({ mousePos }) => (
  <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-2 sm:px-4 md:px-8 overflow-hidden">
    {/* Hero Background Image and Overlay */}
    <div className="absolute inset-0 -z-10">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero1.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
    </div>
    <div className="w-full flex flex-col items-center justify-center z-10">
      <img src={COMPANY_INFO.logo} alt="Josen Logo" className="h-14 sm:h-20 w-auto mb-4 sm:mb-6 mx-auto drop-shadow-lg" />
      <div className="glass-card p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl text-white text-base sm:text-lg leading-relaxed w-full max-w-xs sm:max-w-lg md:max-w-2xl mx-auto" style={{ background: "rgba(30, 30, 30, 0.25)" }}>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 text-center" style={{ fontFamily: "serif", letterSpacing: "1px" }}>
          {ABOUT_CONTENT.title}
        </h1>
        {/* Main paragraphs */}
        {ABOUT_CONTENT.paragraphs.slice(0, 2).map((paragraph, index) => (
          <p key={index} className={index > 0 ? "mt-4" : ""}>
            {paragraph}
          </p>
        ))}
        {/* Collections section */}
        <p className="mt-4">
          Our collection is diverse, yet unified by purpose.<br />
          {Object.entries(ABOUT_CONTENT.collections).map(([name, description], index) => (
            <span key={name}>
              <b>{name}</b> {description}
              {index < Object.entries(ABOUT_CONTENT.collections).length - 1 && <br />}
            </span>
          ))}
        </p>
        {/* Final paragraphs */}
        {ABOUT_CONTENT.paragraphs.slice(2).map((paragraph, index) => (
          <p key={index + 2} className="mt-4">
            {paragraph}
          </p>
        ))}
        {/* Product Prices */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="glass-card px-4 py-2 rounded-full text-white text-base font-semibold flex flex-col items-center min-w-[120px]">
            <span className="font-bold">Bag</span>
            <span>KES 18,500</span>
            <span>US$ 145</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-full text-white text-base font-semibold flex flex-col items-center min-w-[120px]">
            <span className="font-bold">Belt</span>
            <span>KES 4,500</span>
            <span>US$ 35</span>
          </div>
        </div>
        <p className="mt-4 font-bold text-center">
          {ABOUT_CONTENT.closingStatement}
        </p>
      </div>
    </div>
  </section>
);

const FeaturesSection: React.FC<{ mousePos: MousePosition }> = ({ mousePos }) => (
  <section className="py-32 px-8 relative">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-5xl font-black text-3d mb-8">
            Why Choose Josen?
          </h2>
          <ul className="list-none space-y-4 text-lg text-amber-900">
            {WHY_CHOOSE_US.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <div className="space-y-6 mt-8">
            {SERVICE_FEATURES.map((feature, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl">
                <h3 className="text-2xl font-bold text-amber-900 mb-2">
                  {feature.icon} {feature.title}
                </h3>
                <p className="text-amber-800/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
       
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-amber-400/40 to-orange-500/40 rounded-full blur-lg floating-element" />
          <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-yellow-400/50 to-amber-500/50 rounded-lg rotate-45 blur-md floating-element" style={{animationDelay: '1s'}} />
        </div>
      </div>
    </div>
  </section>
);

const CallToActionSection: React.FC = () => (
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
);

// Main Component
const AboutPage: React.FC = () => {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<number>(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize OneSignal
  const initializeOneSignal = useCallback(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    document.body.appendChild(script);

    (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];
    (window as any).OneSignalDeferred.push(async function(OneSignal: any) {
      await OneSignal.init({
        appId: COMPANY_INFO.oneSignalAppId,
        safari_web_id: COMPANY_INFO.safariWebId,
        notifyButton: {
          enable: true,
        },
      });
    });
  }, []);

  // Event handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2
    });
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    const sections = Math.floor(currentScrollY / (window.innerHeight * 0.8));
    setActiveSection(Math.min(sections, 3));
  }, []);

  useEffect(() => {
    initializeOneSignal();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll, initializeOneSignal]);

  return (
    <div ref={containerRef} className="relative overflow-x-hidden">
      {/* Custom CSS */}
      <style>{COMPONENT_STYLES}</style>

      <BackgroundElements scrollY={scrollY} />
      <Navigation />
      <HeroSection mousePos={mousePos} />
      <FeaturesSection mousePos={mousePos} />
      <CallToActionSection />
    </div>
  );
};

export default AboutPage;
