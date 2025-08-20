'use client';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

const NavBarItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleViewItems = () => {
    console.log('Viewing products');
    navigate('/products');
  };

  return (
    <div className='h-screen w-screen overflow-hidden leather-bg leather-pattern leather-grain leather-texture'>
      {/* Navigation Bar */}
      <div className='absolute top-0 left-0 right-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md border-b border-amber-900/30'>
        {NavBarItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className='text-amber-100 py-4 px-8 hover:bg-amber-900/20 transition-all duration-300 flex-1 text-center font-medium tracking-wide hover:text-amber-50'
          >
            {item.name}
          </a>
        ))}
      </div>

      {/* Full Screen Hero Section with 3D Scene */}
      <div className='h-full w-full flex items-center justify-center relative pt-16'>
        {/* Main Content Card - Full Screen */}
        <div className="w-full h-full leather-card relative overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="#D4AF37"
          />
          
          {/* Content Grid */}
          <div className="h-full grid grid-cols-1 lg:grid-cols-2">
            {/* Left content - E-commerce messaging */}
            <div className="flex flex-col justify-center p-8 lg:p-16 relative z-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
                    Handcrafted Excellence
                  </p>
                  <h1 className="text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300 leading-tight">
                    Premium
                  </h1>
                  <h1 className="text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-300 via-amber-200 to-amber-400 leading-tight">
                    Leather
                  </h1>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-light text-amber-100 tracking-wide">
                  Crafted to Perfection
                </h2>
                
                <p className="text-lg text-amber-200/80 max-w-lg leading-relaxed">
                  Discover our exquisite collection of handcrafted leather goods. 
                  Each piece tells a story of quality, durability, and timeless elegance 
                  that transcends generations.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className='leather-button text-amber-50 px-10 py-4 rounded-lg font-semibold text-lg tracking-wide'
                  onClick={handleViewItems}
                >
                  Explore Collection
                </button>
                <button className='bg-transparent border-2 border-amber-600/50 text-amber-200 px-10 py-4 rounded-lg font-semibold text-lg tracking-wide hover:bg-amber-900/20 hover:border-amber-500 transition-all duration-300'>
                  Our Story
                </button>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-amber-900/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-300">100%</div>
                  <div className="text-sm text-amber-200/70">Genuine Leather</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-300">25+</div>
                  <div className="text-sm text-amber-200/70">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-300">1000+</div>
                  <div className="text-sm text-amber-200/70">Happy Customers</div>
                </div>
              </div>
            </div>
            
            {/* Right content - 3D Scene */}
            <div className="relative h-full">
              <div className="absolute inset-4 rounded-2xl overflow-hidden border border-amber-900/30 bg-black/20 backdrop-blur-sm">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-8 right-8 w-32 h-32 border border-amber-600/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-8 right-16 w-16 h-16 border border-amber-500/20 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Bottom feature strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-amber-900/30 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <span className="text-amber-400 text-xl">✦</span>
                </div>
                <div>
                  <h3 className="text-amber-100 font-semibold">Premium Quality</h3>
                  <p className="text-amber-200/70 text-sm">Hand-selected materials and expert craftsmanship</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <span className="text-amber-400 text-xl">◆</span>
                </div>
                <div>
                  <h3 className="text-amber-100 font-semibold">Timeless Design</h3>
                  <p className="text-amber-200/70 text-sm">Classic styles that never go out of fashion</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <span className="text-amber-400 text-xl">♦</span>
                </div>
                <div>
                  <h3 className="text-amber-100 font-semibold">Sustainable Craft</h3>
                  <p className="text-amber-200/70 text-sm">Ethically sourced and environmentally conscious</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;