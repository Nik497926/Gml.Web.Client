"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  authService,
  getStorageAccessToken,
  removeStorageProfile,
  removeStorageTokens,
} from "@/shared/services";
import { DASHBOARD_PAGES } from "@/shared/routes";
import { isTokenExpired } from "@/shared/lib/utils";

/**
 * On the auth page, if a refresh token (HttpOnly cookie) exists and the access token is
 * missing/expired, try to refresh immediately so the user is auto-signed in.
 * If refresh fails, clear local leftovers and keep the user on the sign-in page.
 */
export function AutoRefreshOnAuthPage() {
  const router = useRouter();
  const tried = useRef(false);

  useEffect(() => {
    if (tried.current) return;
    tried.current = true;

    const accessToken = getStorageAccessToken();
    // Уже есть валидный access — не дёргаем refresh (и не гоняемся с ручным логином)
    let accessValid = false;
    try {
      accessValid = Boolean(accessToken && !isTokenExpired(accessToken));
    } catch {
      accessValid = false;
    }
    if (accessValid) {
      router.replace(DASHBOARD_PAGES.HOME);
      return;
    }

    authService
      .refresh()
      .then(() => {
        router.replace(DASHBOARD_PAGES.HOME);
      })
      .catch(() => {
        removeStorageTokens();
        removeStorageProfile();
      });
  }, [router]);

  return null;
}
