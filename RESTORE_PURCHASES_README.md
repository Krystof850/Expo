# Restore Purchases Implementation

## Current Implementation Status

✅ **Basic functionality implemented** using `expo-in-app-purchases`
✅ **UI button added** to Profile screen with loading states
✅ **Platform checks** - only works on iOS/Android native
✅ **Error handling** with user-friendly messages
✅ **Product ID filtering** for subscription products only

## Important Limitations & Considerations

### ⚠️ Package Deprecation
- `expo-in-app-purchases` is **deprecated** and not actively maintained
- For production apps, consider migrating to:
  - **RevenueCat** (recommended for subscription apps)
  - **Superwall** (already integrated in your app)
  - `react-native-iap` (community maintained)

### 🔧 Current Implementation Gaps

1. **No Server-Side Validation**
   - Current implementation only does client-side checks
   - For production, implement receipt validation on your backend
   - Consider Apple's App Store Server API for real-time subscription status

2. **Limited Subscription Validation**
   - Does not check subscription expiry dates
   - Cannot validate subscription renewal status
   - May grant access to expired subscriptions

3. **No Cross-Device Sync**
   - Subscription status only stored locally
   - Does not persist across app reinstalls
   - Should sync with your backend/Firebase

## App Store Compliance ✅

The current implementation meets **minimum App Store requirements**:
- ✅ Restore button is visible and accessible
- ✅ Calls platform restore API (`getPurchaseHistoryAsync`)
- ✅ Handles user feedback appropriately
- ✅ Works only on supported platforms
- ✅ Filters by subscription product IDs

## Configuration Required

Update the product IDs in `src/context/AuthContext.tsx`:

```typescript
const SUBSCRIPTION_PRODUCT_IDS = [
  'your_monthly_subscription_id',
  'your_yearly_subscription_id',
  // Add your actual App Store Connect product IDs
];
```

## Usage

Users can restore purchases by:
1. Going to Profile tab
2. Tapping "Restore Purchases" button
3. Following App Store prompts (iOS only)

## Recommended Next Steps

1. **Configure Product IDs** - Update with your actual subscription product IDs
2. **Test on Physical Device** - Test with actual App Store purchases
3. **Consider Migration** - Plan migration to RevenueCat or Superwall restore
4. **Add Backend Validation** - Implement server-side receipt validation
5. **Monitor Edge Cases** - Handle expired subscriptions, refunds, etc.

## Testing

⚠️ **Note**: Restore purchases functionality can only be tested with:
- Real App Store purchases (production)
- App Store Sandbox purchases (TestFlight)
- Cannot be tested in Expo Go or development mode