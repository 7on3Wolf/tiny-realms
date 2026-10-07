import { Collection } from '../types';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageService';
import { collectionsData } from '../data/collections';

/**
 * Default collections list
 */
export const DEFAULT_COLLECTIONS: Collection[] = collectionsData;

/**
 * Get all collections from LocalStorage with safe fallback
 */
export function getCollections(): Collection[] {
  const stored = getStorageData<Collection[]>(STORAGE_KEYS.COLLECTIONS);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  if (Array.isArray(collectionsData) && collectionsData.length > 0) {
    setStorageData(STORAGE_KEYS.COLLECTIONS, collectionsData);
    return collectionsData;
  }

  return [];
}

/**
 * Get a single collection by ID
 */
export function getCollectionById(id: string): Collection | null {
  const collections = getCollections();
  return collections.find((c) => c.id === id) || null;
}

/**
 * Create a new collection
 */
export function createCollection(
  data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>
): Collection {
  const collections = getCollections();
  const now = new Date().toISOString();
  const newCollection: Collection = {
    ...data,
    id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [...collections, newCollection];
  setStorageData(STORAGE_KEYS.COLLECTIONS, updated);
  return newCollection;
}

/**
 * Update an existing collection with cascade update for linked artworks
 */
export function updateCollection(
  id: string,
  data: Partial<Omit<Collection, 'id' | 'createdAt'>>
): Collection | null {
  const collections = getCollections();
  let updatedCollection: Collection | null = null;

  const updated = collections.map((col) => {
    if (col.id === id) {
      updatedCollection = {
        ...col,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return updatedCollection;
    }
    return col;
  });

  if (!updatedCollection) return null;

  setStorageData(STORAGE_KEYS.COLLECTIONS, updated);
  return updatedCollection;
}

/**
 * Delete a collection
 */
export function deleteCollection(id: string): { success: boolean; error?: string } {
  const collections = getCollections();
  const updated = collections.filter((c) => c.id !== id);
  setStorageData(STORAGE_KEYS.COLLECTIONS, updated);
  return { success: true };
}
