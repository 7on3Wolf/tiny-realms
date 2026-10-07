/**
 * XRPL & XRP.Cafe Automatic Collection Sync Service
 * Issuer: rE2JpSMhkj6vToaXE8hLzqyhEV8xhozQk8 (Tiny Realms)
 *
 * Automatically fetches live minted NFTs from XRPL / XRP.Cafe, converts
 * IPFS metadata & image URIs, and synchronizes them directly into the
 * Tiny Realms Collection & Gallery without requiring manual entry in Admin Panel.
 */

import { Artwork } from '../types';
import { getArtworks } from './artworkService';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageService';
import { TINY_REALMS_CONFIG } from './xrplHolderService';

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  addedCount: number;
  updatedCount: number;
  message: string;
  error?: string;
  lastSyncedAt: string;
}

// Key for caching last sync timestamp
export const XRPL_SYNC_META_KEY = 'tiny_realms_xrpl_sync_meta';
const IPFS_META_CACHE_KEY = 'tiny_realms_ipfs_meta_cache_v1';
const XRPL_SYNC_TTL_MS = 30 * 60 * 1000; // 30 minutes cache TTL

/**
 * Read cached IPFS metadata map from LocalStorage
 */
function getIpfsMetaCache(): Record<string, { name?: string; description?: string; image?: string }> {
  try {
    return getStorageData<Record<string, any>>(IPFS_META_CACHE_KEY) || {};
  } catch {
    return {};
  }
}

/**
 * Save new entries to IPFS metadata map in LocalStorage
 */
function saveIpfsMetaCache(cache: Record<string, { name?: string; description?: string; image?: string }>): void {
  try {
    setStorageData(IPFS_META_CACHE_KEY, cache);
  } catch {
    // Ignore storage quota error
  }
}

/**
 * Check if XRPL synchronization is currently due based on 30-minute TTL
 */
export function isXRPLSyncDue(): boolean {
  try {
    const meta = getStorageData<{ lastSyncedAt?: string }>(XRPL_SYNC_META_KEY);
    if (!meta || !meta.lastSyncedAt) return true;
    const lastSyncTime = new Date(meta.lastSyncedAt).getTime();
    if (isNaN(lastSyncTime)) return true;
    return Date.now() - lastSyncTime > XRPL_SYNC_TTL_MS;
  } catch {
    return true;
  }
}

/**
 * Utility to convert IPFS URIs or raw hash URIs into clean HTTPS gateway URLs
 */
export function formatIPFSUrl(uri: string): string {
  if (!uri) return '';
  
  const cleanUri = uri.trim();
  
  if (cleanUri.startsWith('ipfs://')) {
    const hash = cleanUri.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  }

  if (cleanUri.startsWith('Qm') || cleanUri.startsWith('bafy')) {
    return `https://ipfs.io/ipfs/${cleanUri}`;
  }

  // Hex encoded URI fallback check
  if (/^[0-9A-Fa-f]+$/.test(cleanUri) && cleanUri.length % 2 === 0 && cleanUri.length > 20) {
    try {
      let str = '';
      for (let i = 0; i < cleanUri.length; i += 2) {
        str += String.fromCharCode(parseInt(cleanUri.substring(i, i + 2), 16));
      }
      if (str.startsWith('ipfs://') || str.startsWith('http')) {
        return formatIPFSUrl(str);
      }
    } catch {
      // Ignore conversion error
    }
  }

  return cleanUri;
}

/**
 * Fetch live NFTs (Disabled: collection is managed locally)
 */
export async function fetchLiveXRPLNFTs(): Promise<Partial<Artwork>[]> {
  return [];
}

/**
 * Execute synchronization between collection store and local storage
 * (External sync with XRPL / XRP.Cafe is disabled)
 */
export async function syncXRPLArtworks(_force = false): Promise<SyncResult> {
  const now = new Date().toISOString();
  const existingArtworks = getStorageData<Artwork[]>(STORAGE_KEYS.ARTWORKS) || [];

  return {
    success: true,
    syncedCount: existingArtworks.length,
    addedCount: 0,
    updatedCount: 0,
    message: 'Collection artworks are managed locally.',
    lastSyncedAt: now,
  };
}

/**
 * Get last sync metadata (e.g. timestamp)
 */
export function getXRPLSyncMeta(): { lastSyncedAt?: string; count?: number } | null {
  return getStorageData<{ lastSyncedAt?: string; count?: number }>(XRPL_SYNC_META_KEY);
}
