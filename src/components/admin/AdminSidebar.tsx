import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderKanban,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import TinyRealmsLogo from '../TinyRealmsLogo';

interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export default function AdminSidebar({ className = '', onNavigate }: AdminSidebarProps) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/owner', { replace: true });
    if (onNavigate) onNavigate();
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Collections', path: '/admin/artworks', icon: ImageIcon },
    { label: 'API Diagnostics', path: '/admin/diagnostics', icon: Activity },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`w-64 bg-[#24170F] border-r border-[#5A351E] flex flex-col justify-between shrink-0 select-none ${className}`}
    >
      {/* Brand & Top section */}
      <div>
        {/* Brand identity */}
        <div className="h-16 px-5 border-b border-[#5A351E] flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-3 group focus:outline-none"
            title="Tiny Realms Studio CMS"
          >
            <div className="w-9 h-9 rounded-lg bg-[#4A2D1A] border border-[#5A351E] flex items-center justify-center p-1.5 group-hover:border-[#C69B5A] transition-colors">
              <TinyRealmsLogo size={22} color="#C69B5A" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-[#F5EBDD] group-hover:text-[#D9A85C] transition-colors leading-tight">
                TINY REALMS
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#C69B5A] uppercase leading-none mt-0.5">
                ADMIN CMS
              </span>
            </div>
          </Link>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#4A2D1A] text-[#C69B5A] border border-[#5A351E]">
            CMS
          </span>
        </div>

        {/* User Session Mini Profile */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-[#4A2D1A] border border-[#5A351E]">
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

        {/* Navigation Items */}
        <div className="px-3">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#CDBCA8]/70">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
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

      {/* Bottom Actions: View Site & Logout */}
      <div className="p-4 border-t border-[#5A351E] space-y-2">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
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
          className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-900 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        <div className="pt-2 text-[10px] font-mono text-[#CDBCA8]/60 text-center">
          Tiny Realms Studio • v2.4
        </div>
      </div>
    </aside>
  );
}
