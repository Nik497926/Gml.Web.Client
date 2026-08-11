/** Site where the admin opens registration / gets an API key. */
export function getMarketplaceSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_MARKETPLACE_URL || '').replace(/\/$/, '');
}

/**
 * Market API origin for catalog / status.
 * Falls back to the site URL when API is on the same host.
 */
export function getMarketplaceApiUrl(): string {
  const api = (process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || '').replace(/\/$/, '');
  if (api) {
    return api;
  }

  return getMarketplaceSiteUrl();
}
