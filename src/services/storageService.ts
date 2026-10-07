/**
 * Storage Service
 * Abstraction layer for interacting with browser localStorage safely with JSON serialization.
 *
 * // TEMPORARY PROTOTYPE STORAGE
 * // Replace with Firebase Storage in production.
 * // Production should use Firebase Storage or another object storage provider.
 */
import { STORAGE_KEYS } from '../constants/storageKeys';

export { STORAGE_KEYS };

export interface StorageOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Safely retrieve parsed JSON data from localStorage
 */
export function getStorageData<T>(key: string, fallback: T | null = null): T | null {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined || item === '') {
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`[storageService] Error reading key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely serialize and store data into localStorage with QuotaExceededError protection
 */
export function setStorageData<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error: unknown) {
    const err = error as { name?: string; code?: number };
    if (
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014
    ) {
      console.error(
        '[storageService] Storage limit reached. Please remove unused artwork or move to cloud storage.',
        error
      );
      return false;
    }

    console.error(`[storageService] Error writing key "${key}":`, error);
    return false;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageData(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[storageService] Error removing key "${key}":`, error);
    return false;
  }
}

/**
 * Check if a key exists in localStorage
 */
export function hasStorageData(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

/**
 * Calculate LocalStorage storage usage in bytes and percentage against ~5MB quota
 */
export interface StorageUsageReport {
  bytesUsed: number;
  maxBytes: number;
  percentage: number;
  formattedUsed: string;
  formattedMax: string;
  isHighUsage: boolean;
  isCritical: boolean;
}

export function getLocalStorageUsage(): StorageUsageReport {
  const maxBytes = 5 * 1024 * 1024; // Standard 5MB browser quota
  if (typeof window === 'undefined') {
    return {
      bytesUsed: 0,
      maxBytes,
      percentage: 0,
      formattedUsed: '0 KB',
      formattedMax: '5.0 MB',
      isHighUsage: false,
      isCritical: false,
    };
  }

  let totalChars = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        totalChars += key.length + val.length;
      }
    }
  } catch (e) {
    console.error('[storageService] Failed to read localStorage size', e);
  }

  // 1 char roughly equals 1-2 bytes depending on encoding
  const bytesUsed = totalChars * 2;
  const percentage = Math.min(100, Math.round((bytesUsed / maxBytes) * 100));

  const formattedUsed =
    bytesUsed > 1024 * 1024
      ? `${(bytesUsed / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(bytesUsed / 1024)} KB`;

  const formattedMax = '5.0 MB';

  return {
    bytesUsed,
    maxBytes,
    percentage,
    formattedUsed,
    formattedMax,
    isHighUsage: percentage >= 70,
    isCritical: percentage >= 90,
  };
}

/**
 * Export all artworks and collections as a downloadable JSON backup file
 */
export function exportAllDataAsJSON(): { success: boolean; filename: string; error?: string } {
  try {
    const artworks = getStorageData(STORAGE_KEYS.ARTWORKS, []);
    const collections = getStorageData(STORAGE_KEYS.COLLECTIONS, []);

    const backupData = {
      app: 'Tiny Realms Studio',
      schemaVersion: '2.4',
      exportedAt: new Date().toISOString(),
      artworks,
      collections,
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const filename = `tiny-realms-backup-${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to export backup.';
    console.error('[storageService] Export error:', err);
    return { success: false, filename: '', error: errorMsg };
  }
}

/**
 * Import and restore artworks & collections from JSON backup string
 */
export function importDataFromJSON(jsonString: string): {
  success: boolean;
  artworksCount: number;
  collectionsCount: number;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, artworksCount: 0, collectionsCount: 0, error: 'Invalid JSON format.' };
    }

    const importedArtworks = Array.isArray(parsed.artworks) ? parsed.artworks : null;
    const importedCollections = Array.isArray(parsed.collections) ? parsed.collections : null;

    if (!importedArtworks && !importedCollections) {
      return {
        success: false,
        artworksCount: 0,
        collectionsCount: 0,
        error: 'Backup file does not contain valid "artworks" or "collections" data.',
      };
    }

    if (importedArtworks) {
      setStorageData(STORAGE_KEYS.ARTWORKS, importedArtworks);
    }

    if (importedCollections) {
      setStorageData(STORAGE_KEYS.COLLECTIONS, importedCollections);
    }

    return {
      success: true,
      artworksCount: importedArtworks ? importedArtworks.length : 0,
      collectionsCount: importedCollections ? importedCollections.length : 0,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to parse JSON file.';
    return { success: false, artworksCount: 0, collectionsCount: 0, error: errorMsg };
  }
}

/**
 * Clear all storage items managed by this application
 */
export function clearStorageData(): void {
  removeStorageData(STORAGE_KEYS.ARTWORKS);
  removeStorageData(STORAGE_KEYS.COLLECTIONS);
  removeStorageData(STORAGE_KEYS.ADMIN_SESSION);
}
