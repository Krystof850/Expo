# iOS Development Build Setup

Projekt je připravený pro iOS development build se simulátorem a StoreKit testingem.

## ✅ Co je hotové:

### **Balíčky:**
- ✅ expo-dev-client (development build)
- ✅ expo-updates (OTA updates)
- ✅ expo-application (app info)
- ✅ expo-build-properties (iOS 15.1+)

### **Konfigurace:**
- ✅ **bundleIdentifier**: `com.kkdigitalsolutions.procrastination`
- ✅ **scheme**: `procrastination`
- ✅ **name**: "Procrastination App"
- ✅ **EAS development profile** s iOS simulator podporou

### **IAP Konstanty:**
- ✅ `src/config/iap.ts` s Product IDs: `Annual_S`, `Monthly_S`

### **StoreKit Testing:**
- ✅ `storekit/README-StoreKit.md` s instrukcemi pro Xcode

---

## 🚀 Příkazy pro spuštění (Mac):

### **A) Lokální development build pro simulátor:**
```bash
# 1. Prebuild iOS projektu
npm run prebuild:ios

# 2. Otevřít v Xcode
open ios/ProcrastinationApp.xcworkspace

# 3. V Xcode: Product → Run (nebo ⌘+R)
```

### **B) Rychlé spuštění přes Expo CLI:**
```bash
# Spustí iOS simulátor automaticky
npm run ios
```

### **C) Lokální EAS build:**
```bash
# Vytvoří .ipa soubor pro development
npm run build:ios:dev:local
```

---

## 🧪 StoreKit Testing:

### **1. Nastavení v Xcode:**
1. Otevřete `ios/ProcrastinationApp.xcworkspace`
2. Vytvořte **StoreKit Configuration File**: `StoreKit.storekit`
3. Přidejte produkty:
   - **Annual_S** - Annual Subscription ($9.99/year)
   - **Monthly_S** - Monthly Subscription ($0.99/month)

### **2. Spuštění s StoreKit:**
1. **Product** → **Scheme** → **Edit Scheme**
2. **Run** → **Options** → **StoreKit Configuration** → `StoreKit.storekit`
3. **Run** aplikaci

### **3. Testování:**
- Platby probíhají lokálně bez skutečných transakcí
- Můžete testovat purchase flow, restore purchases
- IAP Product IDs: `Annual_S`, `Monthly_S`

---

## 🔧 Troubleshooting:

### **Prebuild selhává:**
```bash
# Alternativa - ruční prebuild
npx expo install --fix
npx expo prebuild -p ios --clear
```

### **Xcode chyby:**
```bash
# Reinstall CocoaPods
cd ios && pod install --repo-update
```

### **Simulator není nalezen:**
```bash
# Ověřte iOS simulátory
xcrun simctl list devices available
```

---

## 📱 Další kroky:

1. **App Store Connect**: Synchronizujte Product IDs (`Annual_S`, `Monthly_S`)
2. **Superwall Dashboard**: Aktualizujte Product IDs na `Annual_S`, `Monthly_S`
3. **Real Device Testing**: Vytvořte provisioning profile pro fyzické zařízení

---

**Bundle ID**: `com.kkdigitalsolutions.procrastination`  
**Scheme**: `procrastination`  
**IAP IDs**: `Annual_S`, `Monthly_S`