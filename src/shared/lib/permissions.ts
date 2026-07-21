import { getStorageProfile } from '@/shared/services';

export const hasPermission = (permission: string): boolean => {
  const profile = getStorageProfile();
  if (!profile) return false;

  if (profile.role === 'Admin') return true;

  const perms = profile.perm;
  if (!perms) return false;

  if (Array.isArray(perms)) {
    return perms.some((p) => p?.toLowerCase() === permission.toLowerCase());
  }

  // JWT sometimes serializes a single claim as a string
  if (typeof perms === 'string') {
    return perms.toLowerCase() === permission.toLowerCase();
  }

  return false;
};

export const PERMISSIONS = {
  FILES_GLOBAL_MANAGE: 'files.global.manage',
  FILES_PROFILE_MANAGE: 'files.profile.manage',
} as const;
