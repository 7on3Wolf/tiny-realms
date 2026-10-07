import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Artwork, ArtworkFormData, Collection } from '../types';
import * as artworkService from '../services/artworkService';
import * as collectionService from '../services/collectionService';
import * as authService from '../services/authService';
import { syncXRPLArtworks, SyncResult } from '../services/xrplSyncService';
import { setStorageData, STORAGE_KEYS } from '../services/storageService';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  type FirebaseUser,
} from '../services/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

export interface User {
  username: string;
  name: string;
  role: string;
  avatar: string;
  email?: string;
  uid?: string;
  isFirebase: true;
}

interface AppContextType {
  artworks: Artwork[];
  publishedArtworks: Artwork[];
  collections: Collection[];
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  loginWithEmailPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addArtwork: (artwork: ArtworkFormData) => { success: boolean; data?: Artwork; error?: string };
  updateArtwork: (id: string | number, updatedFields: Partial<Artwork>) => { success: boolean; data?: Artwork; error?: string };
  deleteArtwork: (id: string | number) => boolean;
  togglePublished: (id: string | number) => boolean;
  batchSetPublished: (ids: string[], published: boolean) => number;
  batchDeleteArtworks: (ids: string[]) => number;
  duplicateArtwork: (id: string | number) => Artwork | null;
  createCollection: (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) => Collection;
  updateCollection: (id: string, data: Partial<Collection>) => Collection | null;
  deleteCollection: (id: string) => { success: boolean; error?: string };
  resetArtworksToDefault: () => void;
  refreshData: () => void;
  syncWithXRPL: () => Promise<SyncResult>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for artworks
  const [artworks, setArtworks] = useState<Artwork[]>(() => artworkService.getArtworks());

  // State for collections
  const [collections, setCollections] = useState<Collection[]>(() => collectionService.getCollections());

  // Auth loading state
  const [authLoading, setAuthLoading] = useState(true);

  // Auth state synchronized exclusively with Firebase Auth
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  const refreshData = useCallback(() => {
    setArtworks(artworkService.getArtworks());
    setCollections(collectionService.getCollections());
  }, []);

  // Listen to Firebase Auth state transitions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const email = fbUser.email?.toLowerCase().trim();
        if (authService.isAuthorizedAdminEmail(email)) {
          setUser(authService.mapFirebaseUserToAdmin(fbUser));
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen strictly to cross-tab storage changes (instant cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (e.key.startsWith('agip_') || e.key.startsWith('tiny_realms_'))) {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshData]);

  // Real-time Firestore sync for artworks and collections across all tabs and devices
  useEffect(() => {
    let unsubscribeArtworks: (() => void) | undefined;
    let unsubscribeCollections: (() => void) | undefined;

    try {
      unsubscribeArtworks = onSnapshot(
        collection(db, 'artworks'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteArtworks: Artwork[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as Artwork;
              remoteArtworks.push({ ...data, id: docSnap.id });
            });
            setArtworks(remoteArtworks);
            setStorageData(STORAGE_KEYS.ARTWORKS, remoteArtworks);
          } else {
            // If cloud Firestore has no artworks yet, auto-seed default MIRELLE preset
            const defaultArtworks = artworkService.getInitialArtworksPreset();
            if (defaultArtworks.length > 0) {
              defaultArtworks.forEach((art) => {
                setDoc(doc(db, 'artworks', art.id), art, { merge: true }).catch(() => {});
              });
            }
          }
        },
        (error) => {
          console.warn('[Firestore] Artworks sync:', error?.message || error);
        }
      );

      unsubscribeCollections = onSnapshot(
        collection(db, 'collections'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteCollections: Collection[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as Collection;
              remoteCollections.push({ ...data, id: docSnap.id });
            });
            setCollections(remoteCollections);
            setStorageData(STORAGE_KEYS.COLLECTIONS, remoteCollections);
          } else {
            // Auto seed default collection
            const defaultCollections = collectionService.DEFAULT_COLLECTIONS;
            if (defaultCollections.length > 0) {
              defaultCollections.forEach((col) => {
                setDoc(doc(db, 'collections', col.id), col, { merge: true }).catch(() => {});
              });
            }
          }
        },
        (error) => {
          console.warn('[Firestore] Collections sync:', error?.message || error);
        }
      );
    } catch (err) {
      console.warn('[Firestore] Realtime subscription init:', err);
    }

    return () => {
      if (unsubscribeArtworks) unsubscribeArtworks();
      if (unsubscribeCollections) unsubscribeCollections();
    };
  }, []);

  // Exclusive Firebase Email & Password Authentication
  const loginWithEmailPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Strict validation: Only authorized admin emails allowed
    if (!authService.isAuthorizedAdminEmail(cleanEmail)) {
      return {
        success: false,
        error: `Akses ditolak: Akun "${cleanEmail || 'ini'}" tidak terdaftar sebagai administrator panel.`,
      };
    }

    if (!password) {
      return {
        success: false,
        error: 'Silakan masukkan kata sandi akun Firebase Anda.',
      };
    }

    try {
      // Must be registered in Firebase first; otherwise Firebase throws error
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (res.user) {
        setUser(authService.mapFirebaseUserToAdmin(res.user));
        return { success: true };
      }
      return { success: false, error: 'Sign in gagal.' };
    } catch (err: unknown) {
      const errCode =
        err && typeof err === 'object' && 'code' in err ? String((err as { code: unknown }).code) : '';
      const errMsg =
        err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : '';

      if (errCode === 'auth/user-not-found' || errMsg.includes('user-not-found')) {
        return {
          success: false,
          error:
            'Akun afrizaladamm12345@gmail.com belum terdaftar di Firebase! Akun wajib didaftarkan terlebih dahulu di Firebase Authentication (Firebase Console) agar dapat digunakan untuk masuk.',
        };
      }

      if (
        errCode === 'auth/wrong-password' ||
        errCode === 'auth/invalid-credential' ||
        errMsg.includes('invalid-credential') ||
        errMsg.includes('wrong-password')
      ) {
        return {
          success: false,
          error:
            'Kata sandi salah atau akun afrizaladamm12345@gmail.com belum terdaftar di Firebase Authentication. Pastikan akun sudah dibuat di Firebase Console.',
        };
      }

      if (errCode === 'auth/operation-not-allowed' || errMsg.includes('operation-not-allowed') || errMsg.includes('PASSWORD_LOGIN_DISABLED')) {
        return {
          success: false,
          error:
            'Metode login "Email/Password" belum diaktifkan di Firebase Console proyek "Tiny Realms" (tiny-real)!\n\nLangkah perbaikan:\n1. Buka Firebase Console > proyek "Tiny Realms".\n2. Masuk ke Authentication > tab "Sign-in method".\n3. Klik "Email/Password" > Aktifkan (Enable) lalu klik Simpan.\n4. Di tab "Users", pastikan akun afrizaladamm12345@gmail.com sudah dibuat.',
        };
      }

      if (errCode === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat lagi.',
        };
      }

      return {
        success: false,
        error: errMsg || 'Gagal melakukan verifikasi akun dengan Firebase Authentication.',
      };
    }
  };

  // Logout handler
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Add new artwork
  const addArtwork = (newArtData: ArtworkFormData) => {
    const result = artworkService.createArtwork(newArtData);
    if (result.success && result.data) {
      setArtworks(artworkService.getArtworks());
      // Sync with Firestore Cloud Database
      setDoc(doc(db, 'artworks', String(result.data.id)), result.data, { merge: true }).catch((err) => {
        console.warn('[Firestore] Background cloud save error:', err);
      });
    }
    return result;
  };

  // Update existing artwork
  const updateArtwork = (id: string | number, updatedFields: Partial<Artwork>) => {
    const result = artworkService.updateArtwork(id, updatedFields);
    if (result.success && result.data) {
      setArtworks(artworkService.getArtworks());
      // Sync with Firestore Cloud Database
      setDoc(doc(db, 'artworks', String(id)), result.data, { merge: true }).catch((err) => {
        console.warn('[Firestore] Background cloud update error:', err);
      });
    }
    return result;
  };

  // Delete artwork
  const deleteArtwork = (id: string | number) => {
    const success = artworkService.deleteArtwork(id);
    if (success) {
      setArtworks(artworkService.getArtworks());
      deleteDoc(doc(db, 'artworks', String(id))).catch((err) => {
        console.warn('[Firestore] Background cloud delete error:', err);
      });
    }
    return success;
  };

  // Toggle published status
  const togglePublished = (id: string | number) => {
    const updated = artworkService.togglePublished(id);
    if (updated) {
      setArtworks(artworkService.getArtworks());
      setDoc(doc(db, 'artworks', String(id)), updated, { merge: true }).catch((err) => {
        console.warn('[Firestore] Background cloud update error:', err);
      });
      return true;
    }
    return false;
  };

  // Batch publish/unpublish
  const batchSetPublished = (ids: string[], published: boolean) => {
    const count = artworkService.batchSetPublished(ids, published);
    if (count > 0) {
      setArtworks(artworkService.getArtworks());
      ids.forEach((id) => {
        const item = artworkService.getArtworkById(id);
        if (item) {
          setDoc(doc(db, 'artworks', String(id)), item, { merge: true }).catch(() => {});
        }
      });
    }
    return count;
  };

  // Batch delete
  const batchDeleteArtworks = (ids: string[]) => {
    const count = artworkService.batchDeleteArtworks(ids);
    if (count > 0) {
      setArtworks(artworkService.getArtworks());
      ids.forEach((id) => {
        deleteDoc(doc(db, 'artworks', String(id))).catch(() => {});
      });
    }
    return count;
  };

  // Duplicate artwork
  const duplicateArtwork = (id: string | number) => {
    const duplicated = artworkService.duplicateArtwork(id);
    if (duplicated) {
      setArtworks(artworkService.getArtworks());
      setDoc(doc(db, 'artworks', String(duplicated.id)), duplicated, { merge: true }).catch(() => {});
    }
    return duplicated;
  };

  // Collections operations
  const createCollection = (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCollection = collectionService.createCollection(data);
    setCollections(collectionService.getCollections());
    setDoc(doc(db, 'collections', String(newCollection.id)), newCollection, { merge: true }).catch(() => {});
    return newCollection;
  };

  const updateCollection = (id: string, data: Partial<Collection>) => {
    const updated = collectionService.updateCollection(id, data);
    if (updated) {
      setCollections(collectionService.getCollections());
      setArtworks(artworkService.getArtworks());
      setDoc(doc(db, 'collections', String(id)), updated, { merge: true }).catch(() => {});
    }
    return updated;
  };

  const deleteCollection = (id: string) => {
    const result = collectionService.deleteCollection(id);
    if (result.success) {
      setCollections(collectionService.getCollections());
      setArtworks(artworkService.getArtworks());
      deleteDoc(doc(db, 'collections', String(id))).catch(() => {});
    }
    return result;
  };

  // Reset to default factory catalogue
  const resetArtworksToDefault = () => {
    artworkService.resetArtworksCatalogue();
    const defaults = artworkService.getArtworks();
    setArtworks(defaults);
    setCollections(collectionService.getCollections());
    // Update firestore with default seed
    defaults.forEach((art) => {
      setDoc(doc(db, 'artworks', art.id), art, { merge: true }).catch(() => {});
    });
  };

  // Safe local-only sync action (external sync disabled)
  const syncWithXRPL = useCallback(async (): Promise<SyncResult> => {
    return {
      success: true,
      syncedCount: artworks.length,
      addedCount: 0,
      updatedCount: 0,
      message: 'Collection artworks are managed locally.',
      lastSyncedAt: new Date().toISOString(),
    };
  }, [artworks.length]);

  // Filtered published artworks for public showcase
  const publishedArtworks = artworks.filter((item) => item.published !== false);

  return (
    <AppContext.Provider
      value={{
        artworks,
        publishedArtworks,
        collections,
        user,
        isAuthenticated: !!user,
        authLoading,
        loginWithEmailPassword,
        logout,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        togglePublished,
        batchSetPublished,
        batchDeleteArtworks,
        duplicateArtwork,
        createCollection,
        updateCollection,
        deleteCollection,
        resetArtworksToDefault,
        refreshData,
        syncWithXRPL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
