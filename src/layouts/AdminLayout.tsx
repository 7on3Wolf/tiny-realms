import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminMobileMenu from '../components/admin/AdminMobileMenu';

/**
 * AdminLayout
 * Clean Modern CMS Layout for AGIP — ANIME ART Admin Panel
 *
 * Official Tiny Realm Palette:
 * - Background: Warm Gray (#696866)
 * - Panels: Chocolate Brown (#4A2D1A)
 * - Text: Cream (#F5EBDD)
 * - Borders: Dark Brown (#5A351E)
 */
export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#696866] text-[#F5EBDD] flex font-sans antialiased selection:bg-[#4A2D1A] selection:text-[#F5EBDD]">
      {/* 1. Desktop Sidebar (Hidden on mobile/tablet < 1024px) */}
      <AdminSidebar className="hidden lg:flex min-h-screen sticky top-0" />

      {/* 2. Mobile Drawer Menu */}
      <AdminMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* 3. Main Body Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Content Area with generous top/bottom clearance */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>

        {/* CMS Footer */}
        <footer className="border-t border-[#5A351E] bg-[#24170F] py-4 px-4 sm:px-6 lg:px-8 text-xs text-[#CDBCA8]">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-center sm:text-left">
              <span className="font-semibold text-[#F5EBDD]">TINY REALMS</span>
              <span className="text-[#5A351E]">•</span>
              <span>Owner / Artist: <strong className="text-[#F5EBDD]">AGIP</strong></span>
              <span className="text-[#5A351E]">•</span>
              <span>Developer: <strong className="text-[#F5EBDD]">LIEBE</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#CDBCA8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7FAF45] animate-pulse" />
              <span>Studio CMS v2.5 (Firebase Auth Active)</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
