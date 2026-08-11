const DEFAULT_MARKETPLACE_SITE_URL = 'https://marketplace.unicorecms2.ru';
const DEFAULT_MARKETPLACE_API_URL = 'https://marketplace-api.unicorecms2.ru';

/** Site where the admin opens registration / gets an API key. */
export function getMarketplaceSiteUrl(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_MARKETPLACE_URL || '').replace(/\/$/, '');
  return fromEnv || DEFAULT_MARKETPLACE_SITE_URL;
}

/**
 * Market API origin for catalog / status.
 * Falls back to NEXT_PUBLIC_MARKETPLACE_URL, then built-in default.
 */
export function getMarketplaceApiUrl(): string {
  const api = (process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || '').replace(/\/$/, '');
  if (api) {
    return api;
  }

  const site = (process.env.NEXT_PUBLIC_MARKETPLACE_URL || '').replace(/\/$/, '');
  if (site) {
    return site;
  }

  return DEFAULT_MARKETPLACE_API_URL;
}
