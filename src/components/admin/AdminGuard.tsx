import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useApp } from '../../context/AppContext';
import { isAuthorizedAdminEmail } from '../../services/authService';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard component to protect admin routes.
 * Strictly verifies Firebase Authentication state and ensures ONLY the authorized
 * email (afrizaladamm12345@gmail.com) is permitted.
 * If user is not authenticated or not authorized, redirects to /owner immediately.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, authLoading, user } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#696866] flex flex-col items-center justify-center text-[#F5EBDD] p-6">
        <div className="w-full max-w-sm bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton circle width={36} height={36} />
            <div className="flex-1 space-y-1.5">
              <Skeleton width="65%" height={16} borderRadius={4} />
              <Skeleton width="40%" height={12} borderRadius={4} />
            </div>
          </div>
          <Skeleton count={2} height={12} borderRadius={4} />
          <div className="pt-2">
            <Skeleton height={38} borderRadius={10} />
          </div>
        </div>
      </div>
    );
  }

  // Strict multi-layer gate: user MUST be authenticated AND have the exact authorized email
  const isAuthorized = Boolean(isAuthenticated && user?.email && isAuthorizedAdminEmail(user.email));

  if (!isAuthorized) {
    return <Navigate to="/owner" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
