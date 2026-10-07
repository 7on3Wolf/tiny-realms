import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import { AppProvider } from './context/AppContext';
import VisitorTracker from './components/common/VisitorTracker';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Guard
import AdminGuard from './components/admin/AdminGuard';

// Primary Public Pages (Eagerly loaded for instant first paint)
import Home from './pages/Home';
import Info from './pages/Info';
import Collection from './pages/Collection';
import Team from './pages/Team';

// Secondary Public Pages (Lazy loaded on demand)
const Holders = lazy(() => import('./pages/Holders'));
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail'));

// Admin Pages (Lazy loaded exclusively when accessed)
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminArtworks = lazy(() => import('./pages/admin/Artworks'));
const AdminArtworkEdit = lazy(() => import('./pages/admin/ArtworkEdit'));
const AdminArtworkPreviewPage = lazy(() => import('./pages/admin/ArtworkPreviewPage'));
const AdminCollections = lazy(() => import('./pages/admin/Collections'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminDiagnostics = lazy(() => import('./pages/admin/Diagnostics'));

// Minimalist fast loading fallback
const RouteLoadingFallback = () => (
  <div className="flex-1 w-full min-h-[50vh] flex items-center justify-center bg-[#696866]" aria-label="Loading page">
    <div className="w-8 h-8 rounded-full border-2 border-[#C69B5A]/30 border-t-[#C69B5A] animate-spin" />
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <SkeletonTheme baseColor="#2B180E" highlightColor="#6B4226">
        <Router>
          <VisitorTracker />
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              {/* ======================================================== */}
              {/* PUBLIC SITE (Home, Info, Collection, Gallery, Team)       */}
              {/* Public site has strictly NO login or authentication UI    */}
              {/* ======================================================== */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/info" element={<Info />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/team" element={<Team />} />
                <Route path="/holders" element={<Holders />} />
                <Route path="/artwork/:id" element={<ArtworkDetail />} />
                {/* Legacy about redirect */}
                <Route path="/about" element={<Navigate to="/info" replace />} />
              </Route>

              {/* ======================================================== */}
              {/* SECRET OWNER LOGIN GATEWAY                               */}
              {/* Secret entry exclusively at /owner                       */}
              {/* ======================================================== */}
              <Route path="/owner" element={<AdminLogin />} />
              <Route path="/admin/login" element={<Navigate to="/owner" replace />} />

              {/* ======================================================== */}
              {/* PROTECTED ADMIN PANEL                                    */}
              {/* Protected by AdminGuard & rendered in AdminLayout        */}
              {/* /admin redirects to /admin/dashboard or /admin/login      */}
              {/* ======================================================== */}
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="artworks" element={<AdminArtworks />} />
                <Route path="artworks/new" element={<AdminArtworkEdit isNew />} />
                <Route path="artworks/:id/edit" element={<AdminArtworkEdit />} />
                <Route path="artworks/:id/preview" element={<AdminArtworkPreviewPage />} />
                <Route path="collections" element={<AdminCollections />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="diagnostics" element={<AdminDiagnostics />} />
              </Route>

              {/* Catch-all route -> redirect to public home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </SkeletonTheme>
    </AppProvider>
  );
}
