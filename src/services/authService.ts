/**
 * Auth Service
 * Strictly manages admin authentication via Firebase Authentication (Email & Password).
 * Enforces email validation to allow only the designated administrator to access the admin panel.
 */

import { removeStorageData, STORAGE_KEYS } from './storageService';
import { auth, fbSignOut, type FirebaseUser } from './firebase';

export interface AdminUser {
  username: string;
  name: string;
  role: string;
  avatar: string;
  loginAt: string;
  email?: string;
  uid?: string;
  isFirebase: true;
}

/**
 * List of authorized Admin Emails.
 * Only Google accounts with these emails are granted access to the Studio Admin Panel.
 */
export const AUTHORIZED_ADMIN_EMAILS: string[] = [
  'afrizaladamm12345@gmail.com',
  'belyfernando21@gmail.com',
];

/**
 * Verify whether an email is in the authorized admin whitelist
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return AUTHORIZED_ADMIN_EMAILS.some(
    (allowed) => allowed.toLowerCase().trim() === email.toLowerCase().trim()
  );
}

/**
 * Check if current user is authenticated exclusively via Firebase Auth AND authorized
 */
export function isAuthenticated(): boolean {
  if (!auth.currentUser) return false;
  return isAuthorizedAdminEmail(auth.currentUser.email);
}

export function getOwnerDefaultUser(): AdminUser {
  return {
    username: 'belyfernando21@gmail.com',
    name: 'Studio Owner (AGIP)',
    role: 'Studio Owner',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    loginAt: new Date().toISOString(),
    email: 'belyfernando21@gmail.com',
    uid: 'owner_agip_admin',
    isFirebase: true,
  };
}

/**
 * Retrieve current active admin user from Firebase Auth if authorized, or null
 */
export function getCurrentUser(): AdminUser | null {
  if (auth.currentUser && isAuthorizedAdminEmail(auth.currentUser.email)) {
    return {
      username: auth.currentUser.email || auth.currentUser.uid,
      name: auth.currentUser.displayName || 'Tiny Realms Admin',
      role: 'Studio Admin (Firebase)',
      avatar:
        auth.currentUser.photoURL ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      loginAt: new Date().toISOString(),
      email: auth.currentUser.email || undefined,
      uid: auth.currentUser.uid,
      isFirebase: true,
    };
  }
  return null;
}

/**
 * Format Firebase user into AdminUser model
 */
export function mapFirebaseUserToAdmin(fbUser: FirebaseUser): AdminUser {
  return {
    username: fbUser.email || fbUser.uid,
    name: fbUser.displayName || 'Tiny Realms Admin',
    role: 'Studio Admin (Firebase)',
    avatar:
      fbUser.photoURL ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    loginAt: new Date().toISOString(),
    email: fbUser.email || undefined,
    uid: fbUser.uid,
    isFirebase: true,
  };
}

/**
 * Perform logout exclusively via Firebase Authentication
 */
export async function logout(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.warn('Firebase signout warning:', err);
  } finally {
    removeStorageData(STORAGE_KEYS.ADMIN_SESSION);
  }
}
