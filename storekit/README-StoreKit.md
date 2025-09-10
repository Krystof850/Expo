# StoreKit Testing Setup

Pro lokální testování In-App Purchases v iOS simulátoru použijte StoreKit Configuration.

## Kroky pro nastavení v Xcode:

### 1. Vytvoření StoreKit Configuration souboru:
1. V Xcode otevřete projekt `ios/ProcrastinationApp.xcworkspace`
2. Klikněte pravým tlačítkem na projekt v navigátoru 
3. Vyberte **New File** → **Resource** → **StoreKit Configuration File**
4. Pojmenujte ho `StoreKit.storekit`

### 2. Přidání produktů:
V `StoreKit.storekit` souboru přidejte tyto Auto-Renewable Subscriptions:

#### Annual Subscription:
- **Product ID**: `Annual_S`
- **Reference Name**: `Annual Subscription`
- **Price**: `$9.99` (nebo libovolná cena)
- **Subscription Duration**: `1 Year`

#### Monthly Subscription:
- **Product ID**: `Monthly_S` 
- **Reference Name**: `Monthly Subscription`
- **Price**: `$0.99` (nebo libovolná cena)
- **Subscription Duration**: `1 Month`

### 3. Nastavení v Xcode Scheme:
1. V Xcode menu: **Product** → **Scheme** → **Edit Scheme**
2. V sekci **Run** → **Options**
3. V **StoreKit Configuration** vyberte `StoreKit.storekit`

### 4. Testování:
- Spusťte aplikaci v iOS simulátoru
- Platby budут probíhat lokálně bez skutečných transakcí
- Můžete testovat purchase flow, restore purchases, atd.

## Synchronizace s App Store Connect:
Ujistěte se, že Product IDs v:
1. `StoreKit.storekit` (lokální testování)  
2. App Store Connect (sandbox/production)
3. `src/config/iap.ts` (v aplikaci)
4. Superwall Dashboard

jsou identické!