import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderKanban,
  Settings,
  LogOut,
  ExternalLink,
  X,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import TinyRealmsLogo from '../TinyRealmsLogo';

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminMobileMenu({ isOpen, onClose }: AdminMobileMenuProps) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/owner', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Collections', path: '/admin/artworks', icon: ImageIcon },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#24170F]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#24170F] border-r border-[#5A351E] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
        <div>
          {/* Top Header */}
          <div className="h-16 px-4 border-b border-[#5A351E] flex items-center justify-between">
            <Link
              to="/admin/dashboard"
              onClick={onClose}
              className="flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#4A2D1A] border border-[#5A351E] flex items-center justify-center p-1.5">
                <TinyRealmsLogo size={20} color="#C69B5A" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-[#F5EBDD] leading-tight">
                  TINY REALMS
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#C69B5A] uppercase leading-none">
                  ADMIN CMS
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#4A2D1A] transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Session Widget */}
          <div className="p-3 mx-3 my-4 rounded-xl bg-[#4A2D1A] border border-[#5A351E]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#70431F] flex items-center justify-center text-[#F5EBDD] font-bold text-xs">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-[#F5EBDD] truncate">
                  {user?.name || 'AGIP Admin'}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FAF45]" />
                  <span className="text-[10px] font-mono text-[#CDBCA8] uppercase">
                    {user?.role || 'Curator'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <div className="px-3">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#CDBCA8]/70">
              CMS Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#4A2D1A] text-[#F5EBDD] border border-[#C69B5A] shadow-xs'
                          : 'text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#4A2D1A]/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#5A351E] space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#4A2D1A] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-[#C69B5A]" />
              <span>View Public Site</span>
            </div>
            <span className="text-[10px] font-mono text-[#C69B5A]">Live</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
