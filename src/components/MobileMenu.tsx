import { Link, useLocation } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import TinyRealmsLogo from './TinyRealmsLogo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();

  if (!isOpen) return null;

  // Order requested: 1. About, 2. Collection, 3. Team
  const navLinks = [
    { name: 'About', path: '/info', num: '01' },
    { name: 'Collection', path: '/collection', num: '02' },
    { name: 'Team', path: '/team', num: '03' },
  ];

  return (
    <div
      id="mobile-menu-overlay"
      className="fixed inset-0 z-[150] bg-[#24170F]/70 backdrop-blur-sm md:hidden flex justify-end"
      onClick={onClose}
    >
      <div
        id="mobile-menu-drawer"
        className="w-[82%] max-w-xs h-full bg-[#696866] border-l border-[#5A351E] p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Top header: TINY REALMS */}
          <div className="flex items-center justify-between pb-5 border-b border-[#5A351E]">
            <Link
              to="/"
              onClick={onClose}
              title="Tiny Realms Home"
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4A2D1A] flex items-center justify-center p-1.5 shadow-2xs border border-[#5A351E] group-hover:border-[#C69B5A] transition-colors">
                <TinyRealmsLogo size={18} color="#C69B5A" />
              </div>
              <span className="font-display font-black text-base tracking-tight text-[#F5EBDD] group-hover:text-[#D9A85C] transition-colors">
                TINY REALMS
              </span>
            </Link>
            <button
              id="mobile-menu-close-btn"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#3D2214]/90 hover:bg-[#52301D] border border-[#6B4226] flex items-center justify-center text-[#F5EBDD] transition-all focus:outline-none cursor-pointer active:scale-90 shadow-xs"
              aria-label="Close navigation menu"
            >
              <FiX className="w-4 h-4 text-[#F5EBDD]" />
            </button>
          </div>

          {/* Navigation Links: About, Collection, Gallery, Team */}
          <nav className="py-6 space-y-2">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-2 py-3 border-b border-[#5A351E]/50 transition-colors ${
                    isActive
                      ? 'text-[#D9A85C] font-bold'
                      : 'text-[#F5EBDD] hover:text-[#D9A85C]'
                  }`}
                >
                  <span className="font-hero-title text-base">{item.name}</span>
                  <span className="font-mono text-xs text-[#C69B5A]">{item.num}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer Info */}
        <div className="pt-6 border-t border-[#5A351E]">
          <div className="flex items-center justify-between text-xs font-mono text-[#CDBCA8]/80">
            <span>© 2025 TINY REALMS</span>
            <span className="text-[#C69B5A]">XRPL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
