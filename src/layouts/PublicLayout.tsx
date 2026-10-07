import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

/**
 * PublicLayout
 * Handles public site layout.
 * Scopes full-page section scrolling ONLY to the Home page ('/').
 * Non-home subpages maintain standard, natural page scrolling.
 */
export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#696866] text-[#F5EBDD] flex flex-col justify-between selection:bg-[#4A2D1A] selection:text-[#F5EBDD]">
      <ScrollToTop />
      <Navbar />
      {/* Container for main content */}
      <div className={`flex-1 flex flex-col ${isHome ? '' : 'pt-16 sm:pt-20 lg:pt-24'}`}>
        <Outlet />
      </div>
      {/* Non-home pages use global Footer here. Home renders Footer inside its scroll container */}
      {!isHome && <Footer />}
    </div>
  );
}
