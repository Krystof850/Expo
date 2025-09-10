/**
 * In-App Purchase Product IDs
 * 
 * These IDs must match:
 * 1. App Store Connect Product IDs 
 * 2. StoreKit Configuration file (.storekit)
 * 3. Superwall Dashboard Product IDs
 */

export const IAP_IDS = {
  ANNUAL: "Annual_S",
  MONTHLY: "Monthly_S"
} as const;

export type IAPProductId = typeof IAP_IDS[keyof typeof IAP_IDS];

/**
 * Helper function to get all product IDs as array
 */
export const getAllProductIds = (): IAPProductId[] => {
  return Object.values(IAP_IDS);
};