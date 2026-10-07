// TEMPORARY PROTOTYPE STORAGE
// Replace with Firebase Storage in production.
// Production should use Firebase Storage or another object storage provider.

import { Artwork, ArtworkFormData, ArtworkFilter } from '../types';
import { getStorageData, setStorageData, STORAGE_KEYS } from './storageService';
import { artworksData } from '../data/artworks';

export function getInitialArtworksPreset(): Artwork[] {
  return artworksData;
}

/**
 * Retrieve all artworks from LocalStorage with safe fallback
 */
export function getArtworks(): Artwork[] {
  const stored = getStorageData<Artwork[]>(STORAGE_KEYS.ARTWORKS);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  if (Array.isArray(artworksData) && artworksData.length > 0) {
    setStorageData(STORAGE_KEYS.ARTWORKS, artworksData);
    return artworksData;
  }

  return [];
}

/**
 * Retrieve a single artwork by its ID, slug, or code
 */
export function getArtworkById(id: string | number): Artwork | null {
  const artworks = getArtworks();
  const searchId = String(id).trim().toLowerCase();
  return (
    artworks.find(
      (art) =>
        String(art.id).toLowerCase() === searchId ||
        (art.code && art.code.toLowerCase().replace(/\s+/g, '') === searchId.replace(/\s+/g, '')) ||
        (art.title && art.title.toLowerCase().replace(/\s+/g, '-') === searchId) ||
        (art.title && art.title.toLowerCase() === searchId)
    ) || null
  );
}

/**
 * Retrieve only published artworks for the public site
 */
export function getPublishedArtworks(): Artwork[] {
  const artworks = getArtworks();
  return artworks.filter((art) => art.published !== false);
}

/**
 * Check if artwork code is unique (case-insensitive and trimmed)
 */
export function isArtworkCodeUnique(code: string, excludeId?: string | number): boolean {
  const artworks = getArtworks();
  const targetCode = code.trim().toLowerCase();
  const targetExcludeId = excludeId ? String(excludeId) : null;

  return !artworks.some(
    (art) =>
      art.code &&
      art.code.trim().toLowerCase() === targetCode &&
      (!targetExcludeId || String(art.id) !== targetExcludeId)
  );
}

/**
 * Create a new artwork and persist to LocalStorage
 */
export function createArtwork(
  data: ArtworkFormData
): { success: boolean; data?: Artwork; error?: string } {
  const artworks = getArtworks();

  const effectiveCode = (data.code && data.code.trim()) || getNextArtworkCode();
  // Validate unique code
  if (!isArtworkCodeUnique(effectiveCode)) {
    return { success: false, error: 'Artwork code already exists.' };
  }

  const now = new Date().toISOString();
  const newId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newArtwork: Artwork = {
    id: newId,
    code: effectiveCode,
    title: data.title.trim(),
    description: (data.description && data.description.trim()) || `${data.title.trim()} - 1-of-1 Digital Artwork`,
    image: data.image.trim(),
    dimensions: (data.dimensions && data.dimensions.trim()) || '2400 x 2400 px',
    collectionId: data.collectionId || 'col_tiny_realms',
    collection: (data.collection && data.collection.trim()) || 'Tiny Realms',
    year: Number(data.year) || 2026,
    category: (data.category && data.category.trim()) || 'Digital Character',
    status: data.status || 'Available',
    nftUrl: (data.nftUrl && data.nftUrl.trim()) || '',
    published: Boolean(data.published),
    createdAt: now,
    updatedAt: now,
    isFeatured: data.isFeatured ?? false,
    tags: data.tags || ['Tiny Realms', 'Anime Art'],
  };

  const updated = [newArtwork, ...artworks];
  const saved = setStorageData(STORAGE_KEYS.ARTWORKS, updated);

  if (!saved) {
    return {
      success: false,
      error: 'Storage limit reached. Please remove unused artwork or move to cloud storage.',
    };
  }

  return { success: true, data: newArtwork };
}

/**
 * Update an existing artwork
 */
export function updateArtwork(
  id: string | number,
  data: Partial<Artwork>
): { success: boolean; data?: Artwork; error?: string } {
  const artworks = getArtworks();
  const targetId = String(id);

  // If code is being updated, check uniqueness
  if (data.code && !isArtworkCodeUnique(data.code, targetId)) {
    return { success: false, error: 'Artwork code already exists.' };
  }

  let updatedArtwork: Artwork | null = null;

  const updatedList = artworks.map((art) => {
    if (String(art.id) === targetId) {
      updatedArtwork = {
        ...art,
        ...data,
        id: targetId, // preserve id
        createdAt: art.createdAt, // preserve original createdAt!
        updatedAt: new Date().toISOString(), // update updatedAt!
      };
      return updatedArtwork;
    }
    return art;
  });

  if (!updatedArtwork) {
    return { success: false, error: 'Artwork not found.' };
  }

  const saved = setStorageData(STORAGE_KEYS.ARTWORKS, updatedList);
  if (!saved) {
    return {
      success: false,
      error: 'Storage limit reached. Please remove unused artwork or move to cloud storage.',
    };
  }

  return { success: true, data: updatedArtwork };
}

/**
 * Delete an artwork by ID
 */
export function deleteArtwork(id: string | number): boolean {
  const artworks = getArtworks();
  const targetId = String(id);
  const filtered = artworks.filter((art) => String(art.id) !== targetId);

  if (filtered.length === artworks.length) {
    return false; // nothing removed
  }

  return setStorageData(STORAGE_KEYS.ARTWORKS, filtered);
}

/**
 * Toggle published state of an artwork
 */
export function togglePublished(id: string | number): Artwork | null {
  const artworks = getArtworks();
  const targetId = String(id);
  let result: Artwork | null = null;

  const updated = artworks.map((art) => {
    if (String(art.id) === targetId) {
      result = {
        ...art,
        published: !art.published,
        updatedAt: new Date().toISOString(),
      };
      return result;
    }
    return art;
  });

  if (result) {
    setStorageData(STORAGE_KEYS.ARTWORKS, updated);
  }

  return result;
}

/**
 * Duplicate an existing artwork
 */
export function duplicateArtwork(id: string | number): Artwork | null {
  const source = getArtworkById(id);
  if (!source) return null;

  const artworks = getArtworks();
  const now = new Date().toISOString();
  const newId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // Generate unique duplicate code
  let newCode = `${source.code || 'TR-001'}-COPY`;
  let counter = 1;
  while (!isArtworkCodeUnique(newCode)) {
    counter++;
    newCode = `${source.code || 'TR-001'}-COPY-${counter}`;
  }

  const duplicatedArtwork: Artwork = {
    ...source,
    id: newId,
    code: newCode,
    title: `${source.title} Copy`,
    published: false,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [duplicatedArtwork, ...artworks];
  const saved = setStorageData(STORAGE_KEYS.ARTWORKS, updated);

  return saved ? duplicatedArtwork : null;
}

/**
 * Search artworks by title, code, collection, category, or year
 */
export function searchArtworks(query: string, list?: Artwork[]): Artwork[] {
  const source = list || getArtworks();
  const q = query.trim().toLowerCase();
  if (!q) return source;

  return source.filter((item) => {
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.code && item.code.toLowerCase().includes(q)) ||
      (item.collection && item.collection.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      String(item.year).includes(q)
    );
  });
}

/**
 * Filter and sort artworks by filter options
 */
export function filterArtworks(filters: ArtworkFilter, list?: Artwork[]): Artwork[] {
  let result = list || getArtworks();

  // Search filter
  if (filters.searchQuery) {
    result = searchArtworks(filters.searchQuery, result);
  }

  // Status filter (All, Available, Sold, Reserved, Archived)
  if (filters.status && filters.status !== 'All') {
    result = result.filter((a) => a.status === filters.status);
  }

  // Published filter (All, Published, Draft)
  if (filters.published && filters.published !== 'All') {
    if (filters.published === 'Published') {
      result = result.filter((a) => a.published === true);
    } else if (filters.published === 'Draft') {
      result = result.filter((a) => a.published === false);
    }
  }

  // Collection filter
  if (filters.collection && filters.collection !== 'All') {
    result = result.filter(
      (a) =>
        (a.collection && a.collection.toLowerCase() === filters.collection?.toLowerCase()) ||
        a.collectionId === filters.collection
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'All') {
    result = result.filter(
      (a) => a.category && a.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  // Sorting
  if (filters.sortBy) {
    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'Newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'Oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'Title A-Z':
          return (a.title || '').localeCompare(b.title || '');
        case 'Title Z-A':
          return (b.title || '').localeCompare(a.title || '');
        case 'Year Newest':
          return (b.year || 0) - (a.year || 0);
        case 'Year Oldest':
          return (a.year || 0) - (b.year || 0);
        default:
          return 0;
      }
    });
  }

  return result;
}

/**
 * Compute aggregate statistics for the dashboard
 */
export function countArtworks(artworksList?: Artwork[]): {
  total: number;
  published: number;
  draft: number;
} {
  const list = artworksList || getArtworks();
  const total = list.length;
  const published = list.filter((a) => a.published !== false).length;
  const draft = list.filter((a) => a.published === false).length;

  return { total, published, draft };
}

/**
 * Reset artworks to empty
 */
export function resetArtworksCatalogue(): Artwork[] {
  setStorageData(STORAGE_KEYS.ARTWORKS, []);
  return [];
}

/**
 * Batch update publication state of multiple artworks
 */
export function batchSetPublished(ids: string[], published: boolean): number {
  const artworks = getArtworks();
  const idSet = new Set(ids.map(String));
  let count = 0;

  const updated = artworks.map((art) => {
    if (idSet.has(String(art.id))) {
      count++;
      return {
        ...art,
        published,
        updatedAt: new Date().toISOString(),
      };
    }
    return art;
  });

  setStorageData(STORAGE_KEYS.ARTWORKS, updated);
  return count;
}

/**
 * Batch delete multiple artworks
 */
export function batchDeleteArtworks(ids: string[]): number {
  const artworks = getArtworks();
  const idSet = new Set(ids.map(String));
  const filtered = artworks.filter((art) => !idSet.has(String(art.id)));
  const deletedCount = artworks.length - filtered.length;

  if (deletedCount > 0) {
    setStorageData(STORAGE_KEYS.ARTWORKS, filtered);
  }

  return deletedCount;
}

/**
 * Automatically compute next available artwork code (e.g. TR-001)
 */
export function getNextArtworkCode(): string {
  const artworks = getArtworks();
  let maxNum = 0;
  for (const art of artworks) {
    const match = art.code ? art.code.match(/(\d+)/) : null;
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum > 0 ? maxNum + 1 : artworks.length + 1;
  return `TR-${String(nextNum).padStart(3, '0')}`;
}
