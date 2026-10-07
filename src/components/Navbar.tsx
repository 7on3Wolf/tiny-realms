import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import MobileMenu from './MobileMenu';
import TinyRealmsLogo from './TinyRealmsLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  // Order requested: 1. About, 2. Collection, 3. Team
  const navLinks = [
    { name: 'About', path: '/info' },
    { name: 'Collection', path: '/collection' },
    { name: 'Team', path: '/team' },
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 inset-x-0 z-[100] w-full transition-all duration-300 select-none ${
          isScrolled
            ? 'bg-[#24170F]/95 backdrop-blur-md border-0 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-0 shadow-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-12 sm:h-14">
            
            {/* 1. Left Brand Container: Planetary Tiny Realms Logo + Title */}
            <Link
              id="navbar-logo-link"
              to="/"
              title="Tiny Realms Home"
              aria-label="Tiny Realms Home"
              className="group flex items-center gap-2 focus:outline-none cursor-pointer shrink-0"
            >
              <TinyRealmsLogo size={32} color="#C69B5A" />
              <span className="font-hero-title font-bold text-lg sm:text-xl tracking-normal text-[#F5EBDD] group-hover:text-[#D9A85C] transition-colors duration-200 drop-shadow-xs">
                Tiny Realms
              </span>
            </Link>

            {/* 2. Center Desktop Navigation Links */}
            <nav
              id="desktop-navbar-nav"
              className="hidden md:flex items-center gap-3 lg:gap-5"
              aria-label="Desktop Navigation"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`py-1 font-hero-title font-bold text-xs sm:text-sm tracking-wide transition-colors ${
                      isActive
                        ? 'text-[#D9A85C]'
                        : 'text-[#F5EBDD] hover:text-[#D9A85C]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* 3. Right Mobile Action Controls: Sleek Compact Hamburger Toggle */}
            <div className="flex md:hidden items-center">
              <button
                id="mobile-menu-open-btn"
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="w-8 h-8 rounded-lg bg-[#3D2214]/90 hover:bg-[#52301D] border border-[#6B4226] flex items-center justify-center text-[#F5EBDD] transition-all focus:outline-none cursor-pointer active:scale-90 shadow-xs"
                aria-label="Open navigation menu"
              >
                <FiMenu className="w-4 h-4 text-[#F5EBDD]" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Modal */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
