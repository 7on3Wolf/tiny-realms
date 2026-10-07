import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export default function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/owner', { replace: true });
  };

  const getSectionInfo = () => {
    const path = location.pathname;
    if (path.includes('/admin/artworks')) {
      return {
        section: 'Catalogue',
        title: 'Collections Management',
        badge: 'Collection Records'
      };
    }
    if (path.includes('/admin/collections')) {
      return {
        section: 'Curation',
        title: 'Collections',
        badge: 'Series Groups'
      };
    }
    if (path.includes('/admin/settings')) {
      return {
        section: 'System',
        title: 'Settings & Studio',
        badge: 'Configuration'
      };
    }
    return {
      section: 'Overview',
      title: 'Dashboard',
      badge: 'Realtime'
    };
  };

  const { section, title } = getSectionInfo();

  return (
    <header className="sticky top-0 z-30 bg-[#24170F]/95 backdrop-blur-md border-b border-[#5A351E]">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#F5EBDD] hover:bg-[#4A2D1A] border border-[#5A351E] transition-colors cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#CDBCA8] hidden sm:inline">{section}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#5A351E] hidden sm:inline" />
            <h1 className="font-bold text-sm sm:text-base text-[#F5EBDD] truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Quick actions & profile indicator */}
        <div className="flex items-center gap-2.5">
          {/* View Public Live Site button */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[#4A2D1A] hover:bg-[#70431F] text-[#F5EBDD] border border-[#5A351E] transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C69B5A]" />
          </Link>

          {/* Session badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#5A351E]">
            <div className="w-8 h-8 rounded-xl bg-[#4A2D1A] border border-[#5A351E] flex items-center justify-center text-xs font-bold text-[#F5EBDD]">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#F5EBDD] leading-none">
                {user?.name || 'Artist / Curator'}
              </span>
              <span className="text-[10px] font-mono text-[#C69B5A] leading-none mt-1">
                {user?.role || 'Admin'}
              </span>
            </div>
          </div>

          {/* Logout shortcut on desktop */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className="p-2 rounded-xl text-[#CDBCA8] hover:text-rose-400 hover:bg-[#4A2D1A] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
