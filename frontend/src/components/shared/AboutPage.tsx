import React, { useRef, useState, useEffect, useCallback } from "react";
import SidebarNav from "./SidebarNav";

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
  name: "JOSEN NAIROBI",
  logo: "/logo1.jpg",
  heroImage: "blue_bag.jpg",
  oneSignalAppId: "9c2b21d1-2a24-4fdc-b253-2af835698b62",
  safariWebId: "web.onesignal.auto.1947bcbb-3df5-45a5-b464-0be0e15f4a2c"
};

const ABOUT_CONTENT = {
  title: "About Josen Nairobi",
  paragraphs: [
    "At Josen Nairobi, we believe that the things we carry should carry meaning. Each piece in our collection is a testament to craftsmanship, character, and the enduring pursuit of quality. We do not just make bags and belts — we create heirloom-quality goods that evolve with you over time, telling your story through every scratch, stain, and journey.",
    "Rooted in the tradition of meticulous handcrafting, Josen Nairobi combines premium full-grain leather, resilient waxed canvas, and solid, high-grade hardware to ensure every product stands the test of time. Every stitch and cut reflects our commitment to integrity, function, and style — modern designs shaped by timeless ideals.",
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
  closingStatement: "Josen Nairobi — Crafted with soul. Carried with purpose. Built for a lifetime of journeys."
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

/* Navigation component removed, replaced by SidebarNav */

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

/** Contact Section */
const ContactSection: React.FC = () => (
  <section className="py-20 px-4 bg-white/80 border-t border-amber-200">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-amber-900 mb-4">Contact Us</h2>
      <p className="text-lg mb-4">
        Email: <a href="mailto:info@josenleather.com" className="text-amber-700 underline">info@josenleather.com</a>
      </p>
      <div className="flex justify-center gap-6 mt-6">
        <a href="https://instagram.com/josenleather" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-pink-600 hover:text-pink-800 text-3xl">
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.634 2.2 15.25 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.87.312 4.13.54c-.8.25-1.48.58-2.16 1.26-.68.68-1.01 1.36-1.26 2.16C.312 4.87.128 5.77.07 7.052.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.282.242 2.182.47 2.922.25.8.58 1.48 1.26 2.16.68.68 1.36 1.01 2.16 1.26.74.228 1.64.412 2.922.47C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.282-.058 2.182-.242 2.922-.47.8-.25 1.48-.58 2.16-1.26.68-.68 1.01-1.36 1.26-2.16.228-.74.412-1.64.47-2.922.058-1.28.07-1.684.07-4.948s-.012-3.668-.07-4.948c-.058-1.282-.242-2.182-.47-2.922-.25-.8-.58-1.48-1.26-2.16-.68-.68-1.36-1.01-2.16-1.26-.74-.228-1.64-.412-2.922-.47C15.668.012 15.264 0 12 0z"/><path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 1 0 12 5.838zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
        </a>
        <a href="https://facebook.com/josenleather" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-700 hover:text-blue-900 text-3xl">
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692V11.01h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
        </a>
        <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-green-600 hover:text-green-800 text-3xl">
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 0 1 2.1 11.513C2.073 6.706 6.067 2.675 10.88 2.675c2.636 0 5.104 1.027 6.963 2.887a9.825 9.825 0 0 1 2.893 6.943c.016 5.807-3.978 9.838-8.685 9.838m8.413-18.252A11.815 11.815 0 0 0 10.88 0C4.885 0 .021 4.877 0 10.875c0 1.918.504 3.786 1.463 5.428L.057 23.925a1.003 1.003 0 0 0 1.225 1.225l7.617-2.004a11.822 11.822 0 0 0 5.417 1.378h.005c6 0 10.864-4.877 10.885-10.875a10.86 10.86 0 0 0-3.184-7.938"/></svg>
        </a>
      </div>
    </div>
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
      <SidebarNav />
      <HeroSection mousePos={mousePos} />
      <FeaturesSection mousePos={mousePos} />
      <CallToActionSection />
      <ContactSection />
    </div>
  );
};

export default AboutPage;
