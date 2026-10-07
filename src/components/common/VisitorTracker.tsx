import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recordPageVisit, recordClickEvent } from '../../services/visitorService';

/**
 * VisitorTracker Component
 * Automatically tracks page route views and interactive clicks across public site pages.
 */
export default function VisitorTracker() {
  const location = useLocation();

  // 1. Automatically track page visits on route change
  useEffect(() => {
    recordPageVisit(location.pathname);
  }, [location.pathname]);

  // 2. Global event delegation for interactive link / button clicks
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find closest tracked element or link
      const trackedEl = target.closest('[data-track-click]') as HTMLElement | null;
      if (trackedEl) {
        const eventName = trackedEl.getAttribute('data-track-click') || 'User Click';
        recordClickEvent(eventName, window.location.pathname);
        return;
      }

      // Check if external link like xrp.cafe, Twitter/X, Instagram
      const linkEl = target.closest('a') as HTMLAnchorElement | null;
      if (linkEl && linkEl.href) {
        const href = linkEl.href;
        if (href.includes('xrp.cafe')) {
          recordClickEvent('Klik Marketplace xrp.cafe', window.location.pathname, { href });
        } else if (href.includes('twitter.com') || href.includes('x.com')) {
          recordClickEvent('Klik Twitter/X Official', window.location.pathname, { href });
        } else if (href.includes('instagram.com')) {
          recordClickEvent('Klik Instagram Official', window.location.pathname, { href });
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, { passive: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return null;
}
