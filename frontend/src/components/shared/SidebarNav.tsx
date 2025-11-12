import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Cart", href: "/cart"}
];

const COMPANY_INFO = {
 
  logo: "/logo1.jpg",
};

const SidebarNav: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <>
      {/* Hamburger menu button (mobile only) */}
      <button
        className="fixed top-4 left-4 z-[100] sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-lg border border-amber-200"
        aria-label="Open menu"
        onClick={() => setSidebarOpen(true)}
        style={{ backdropFilter: "blur(8px)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect y="5" width="24" height="2.5" rx="1.25" fill="#e36913ff"/>
          <rect y="11" width="24" height="2.5" rx="1.25" fill="#e36913ff"/>
          <rect y="17" width="24" height="2.5" rx="1.25" fill="#e36913ff"/>
        </svg>
      </button>

      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-black/30 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-[100] transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:hidden`}
        style={{ backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-amber-100">
          <img src={COMPANY_INFO.logo} alt="JOSEN NAIROBI Logo" className="h-8 w-auto" />
        </div>
        <nav className="flex flex-col gap-2 px-6 py-4">
          {NAV_LINKS.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-amber-900 hover:text-amber-700 font-medium py-2 px-2 rounded transition-all duration-200 relative flex items-center"
                onClick={() => setSidebarOpen(false)}
              >
                {link.label}
                {link.label === "Cart" && cartItemCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-amber-900 hover:text-amber-700 font-medium py-2 px-2 rounded transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                {link.label}
              </a>
            )
          )}
        </nav>
      </aside>

      {/* Top nav bar (desktop only) */}
      <style>{`
        @font-face {
          font-family: 'BankGothic Lt BT';
          src: local('BankGothic Lt BT'), url('/fonts/BankGothicLtBT.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
      <nav className="glass-nav bg-white border-b fixed top-0 w-full z-50 px-4 sm:px-8 py-3 sm:py-4 hidden sm:block">
        <div className="flex flex-row justify-between items-center max-w-7xl mx-auto gap-2">
          <div
            className="text-2xl font-bold shimmer-text flex items-center gap-2"
            style={{ fontFamily: "'Edu NSW ACT Foundation', cursive", fontStyle: "italic" }}
          >
            <img
              src={COMPANY_INFO.logo}
              alt="JOSEN NAIROBI Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex gap-8">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-amber-900 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-110 relative group text-lg flex items-center"
                >
                  {link.label}
                  {link.label === "Cart" && cartItemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-amber-900 hover:text-amber-700 font-medium transition-all duration-300 hover:scale-110 relative group text-lg"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300" />
                </a>
              )
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default SidebarNav;
