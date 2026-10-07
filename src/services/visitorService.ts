import { STORAGE_KEYS } from '../constants/storageKeys';
import { getStorageData, setStorageData } from './storageService';

export interface VisitEvent {
  id: string;
  type: 'page_view' | 'click';
  name: string;
  path: string;
  timestamp: string; // ISO string
  details?: Record<string, string>;
  device: 'mobile' | 'desktop' | 'tablet';
  visitorId: string;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  visits: number;
  unique: number;
  clicks: number;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  totalClicks: number;
  lastUpdated: string;
  pageBreakdown: Record<string, number>;
  clickBreakdown: Record<string, number>;
  dailyStats: DailyStat[];
}

const DEFAULT_STATS: VisitorStats = {
  totalVisits: 0,
  uniqueVisitors: 0,
  todayVisits: 0,
  totalClicks: 0,
  lastUpdated: new Date().toISOString(),
  pageBreakdown: {},
  clickBreakdown: {},
  dailyStats: [],
};

/**
 * Get or initialize persistent anonymous visitor ID
 */
export function getVisitorId(): { id: string; isNew: boolean } {
  if (typeof window === 'undefined') return { id: 'ssr-visitor', isNew: false };
  try {
    let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
    let isNew = false;
    if (!visitorId) {
      visitorId = `v_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
      isNew = true;
    }
    return { id: visitorId, isNew };
  } catch {
    return { id: `v_anon_${Date.now().toString(36)}`, isNew: true };
  }
}

/**
 * Detect client device type
 */
function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Get formatted current date string YYYY-MM-DD
 */
function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retrieve visitor analytics stats
 */
export function getVisitorStats(): VisitorStats {
  const stats = getStorageData<VisitorStats>(STORAGE_KEYS.VISIT_STATS, DEFAULT_STATS);
  if (!stats) return DEFAULT_STATS;

  // Calculate today's visits dynamically
  const todayStr = getTodayDateString();
  const todayEntry = stats.dailyStats?.find((d) => d.date === todayStr);
  const todayVisits = todayEntry ? todayEntry.visits : 0;

  return {
    ...stats,
    todayVisits,
  };
}

/**
 * Retrieve recent events log (page views + clicks)
 */
export function getRecentVisitEvents(limit = 30): VisitEvent[] {
  const events = getStorageData<VisitEvent[]>(STORAGE_KEYS.VISIT_EVENTS, []);
  if (!Array.isArray(events)) return [];
  return events.slice(0, limit);
}

/**
 * Record a public page visit / view event
 */
export function recordPageVisit(pathname: string): void {
  if (typeof window === 'undefined') return;

  // Do not count internal admin routes as public visitors
  if (pathname.startsWith('/admin') || pathname.startsWith('/owner')) {
    return;
  }

  try {
    const { id: visitorId, isNew } = getVisitorId();
    const todayStr = getTodayDateString();
    const now = new Date().toISOString();
    const device = getDeviceType();

    // Check if session has already counted this path in the last 2 seconds (debounce duplicate route triggers)
    const sessionKey = `visit_seen_${pathname}_${Date.now().toString().slice(0, -4)}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    sessionStorage.setItem(sessionKey, '1');

    const stats = getStorageData<VisitorStats>(STORAGE_KEYS.VISIT_STATS, { ...DEFAULT_STATS });
    const currentStats: VisitorStats = stats || { ...DEFAULT_STATS };

    // 1. Update total and unique
    currentStats.totalVisits = (currentStats.totalVisits || 0) + 1;
    if (isNew) {
      currentStats.uniqueVisitors = (currentStats.uniqueVisitors || 0) + 1;
    } else if (currentStats.uniqueVisitors === 0) {
      currentStats.uniqueVisitors = 1;
    }

    // 2. Update page breakdown
    const cleanPath = pathname || '/';
    currentStats.pageBreakdown = currentStats.pageBreakdown || {};
    currentStats.pageBreakdown[cleanPath] = (currentStats.pageBreakdown[cleanPath] || 0) + 1;

    // 3. Update daily stats
    currentStats.dailyStats = currentStats.dailyStats || [];
    const existingDayIdx = currentStats.dailyStats.findIndex((d) => d.date === todayStr);
    if (existingDayIdx >= 0) {
      currentStats.dailyStats[existingDayIdx].visits += 1;
      if (isNew) {
        currentStats.dailyStats[existingDayIdx].unique += 1;
      }
    } else {
      currentStats.dailyStats.push({
        date: todayStr,
        visits: 1,
        unique: isNew ? 1 : 1,
        clicks: 0,
      });
    }

    // Keep last 30 days
    if (currentStats.dailyStats.length > 30) {
      currentStats.dailyStats = currentStats.dailyStats.slice(-30);
    }

    currentStats.lastUpdated = now;
    setStorageData(STORAGE_KEYS.VISIT_STATS, currentStats);

    // 4. Record event log
    const event: VisitEvent = {
      id: `ev_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'page_view',
      name: `Kunjungan Halaman ${cleanPath}`,
      path: cleanPath,
      timestamp: now,
      device,
      visitorId,
    };

    const existingEvents = getStorageData<VisitEvent[]>(STORAGE_KEYS.VISIT_EVENTS, []) || [];
    const updatedEvents = [event, ...existingEvents].slice(0, 50);
    setStorageData(STORAGE_KEYS.VISIT_EVENTS, updatedEvents);

    // Dispatch custom event for real-time reactivity in current tab
    window.dispatchEvent(new CustomEvent('tinyrealms:visitor_update'));
  } catch (err) {
    console.warn('[visitorService] Failed to record visit:', err);
  }
}

/**
 * Record an interactive click event (e.g., Marketplace button, Artwork click, Share link)
 */
export function recordClickEvent(
  eventName: string,
  path: string = window.location.pathname,
  details?: Record<string, string>
): void {
  if (typeof window === 'undefined') return;

  try {
    const { id: visitorId } = getVisitorId();
    const todayStr = getTodayDateString();
    const now = new Date().toISOString();
    const device = getDeviceType();

    const stats = getStorageData<VisitorStats>(STORAGE_KEYS.VISIT_STATS, { ...DEFAULT_STATS });
    const currentStats: VisitorStats = stats || { ...DEFAULT_STATS };

    currentStats.totalClicks = (currentStats.totalClicks || 0) + 1;
    currentStats.clickBreakdown = currentStats.clickBreakdown || {};
    currentStats.clickBreakdown[eventName] = (currentStats.clickBreakdown[eventName] || 0) + 1;

    // Update daily stats clicks
    currentStats.dailyStats = currentStats.dailyStats || [];
    const existingDayIdx = currentStats.dailyStats.findIndex((d) => d.date === todayStr);
    if (existingDayIdx >= 0) {
      currentStats.dailyStats[existingDayIdx].clicks = (currentStats.dailyStats[existingDayIdx].clicks || 0) + 1;
    } else {
      currentStats.dailyStats.push({
        date: todayStr,
        visits: 1,
        unique: 1,
        clicks: 1,
      });
    }

    currentStats.lastUpdated = now;
    setStorageData(STORAGE_KEYS.VISIT_STATS, currentStats);

    // Add click event to log
    const event: VisitEvent = {
      id: `clk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'click',
      name: eventName,
      path: path || '/',
      timestamp: now,
      details,
      device,
      visitorId,
    };

    const existingEvents = getStorageData<VisitEvent[]>(STORAGE_KEYS.VISIT_EVENTS, []) || [];
    const updatedEvents = [event, ...existingEvents].slice(0, 50);
    setStorageData(STORAGE_KEYS.VISIT_EVENTS, updatedEvents);

    // Dispatch event
    window.dispatchEvent(new CustomEvent('tinyrealms:visitor_update'));
  } catch (err) {
    console.warn('[visitorService] Failed to record click:', err);
  }
}

/**
 * Reset visitor stats (for admin maintenance)
 */
export function resetVisitorStats(): void {
  if (typeof window === 'undefined') return;
  setStorageData(STORAGE_KEYS.VISIT_STATS, DEFAULT_STATS);
  setStorageData(STORAGE_KEYS.VISIT_EVENTS, []);
  window.dispatchEvent(new CustomEvent('tinyrealms:visitor_update'));
}
