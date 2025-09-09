# Firebase Auth Smoke Test

Postupný test pro ověření funkčnosti Firebase Auth v Expo aplikaci.

## Prerekvizity

1. Firebase projekt vytvořený v [Firebase Console](https://console.firebase.google.com/)
2. Email/Password authentication povolen v Authentication → Sign-in method
3. Firebase konfigurace (API keys) k dispozici

## Test Setup (1-2 minuty)

### Krok 1: Konfigurace prostředí
```bash
# 1. Zkopíruj konfigurační template
cp .env.example .env

# 2. Vyplň Firebase hodnoty do .env
# FIREBASE_API_KEY=your_api_key_here
# FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# FIREBASE_PROJECT_ID=your_project_id
# FIREBASE_STORAGE_BUCKET=your_project.appspot.com
# FIREBASE_MESSAGING_SENDER_ID=123456789
# FIREBASE_APP_ID=1:123456789:web:abcdef123456

# 3. Nainstaluj závislosti
npm i

# 4. Spusť vývojový server s clear cache
npm run reset
```

### Krok 2: Ověř startování aplikace
```bash
# Server by měl běžet bez chyb
# V konzoli by měl být log: [Firebase] Config loaded: { hasApiKey: true, ... }
# Webová aplikace by měla být dostupná na localhost:5000
```

## Test Scenarios

### 🧪 Test 1: Registrace nového uživatele
1. **Akce**: Otevři aplikaci → automatický redirect na `/(auth)/sign-in`
2. **Očekávání**: Zobrazí se přihlašovací obrazovka s linkami
3. **Akce**: Klikni "Nemáš účet? Registrace"
4. **Očekávání**: Redirect na `/(auth)/sign-up`
5. **Akce**: Vyplň email (např. `test@example.com`) a heslo (min. 6 znaků)
6. **Akce**: Klikni "Zaregistrovat"
7. **Očekávání**: 
   - Úspěšná registrace → automatický redirect na `/(protected)/`
   - Zobrazí se "Ahoj, test@example.com" a tlačítko "Odhlásit"
   - V Firebase Console → Authentication → Users se objeví nový uživatel

### 🧪 Test 2: Session persistence
1. **Akce**: Refresh stránky (F5 nebo Cmd+R)
2. **Očekávání**: Uživatel zůstane přihlášený, zůstane na `/(protected)/`
3. **Akce**: Zavři tab a otevři aplikaci znovu
4. **Očekávání**: Stále přihlášený (díky AsyncStorage persistence)

### 🧪 Test 3: Odhlášení a přihlášení
1. **Akce**: Klikni "Odhlásit"
2. **Očekávání**: Redirect na `/(auth)/sign-in`
3. **Akce**: Vyplň stejný email a heslo jako při registraci
4. **Akce**: Klikni "Přihlásit"
5. **Očekávání**: Úspěšné přihlášení → redirect na `/(protected)/`

### 🧪 Test 4: Reset hesla
1. **Akce**: Na sign-in obrazovce klikni "Zapomenuté heslo"
2. **Očekávání**: Redirect na `/(auth)/forgot`
3. **Akce**: Vyplň email z Test 1
4. **Akce**: Klikni "Odeslat reset email"
5. **Očekávání**: 
   - Zobrazí se alert "Hotovo, Poslali jsme ti email..."
   - Email by měl dorazit na zadanou adresu (zkontroluj i spam)

### 🧪 Test 5: Validace formulářů
1. **Akce**: Zkus zadat neplatný email na sign-up
2. **Očekávání**: Zobrazí se "Neplatný email"
3. **Akce**: Zkus zadat heslo kratší než 6 znaků
4. **Očekávání**: Zobrazí se "Min. 6 znaků"
5. **Akce**: Zkus se přihlásit s neexistujícím emailem
6. **Očekávání**: Zobrazí se alert s chybou "Špatný email nebo heslo"

### 🧪 Test 6: Error mapping
1. **Akce**: Zkus se registrovat s již použitým emailem (z Test 1)
2. **Očekávání**: Zobrazí se alert "Email je již registrován"
3. **Akce**: Zkus se přihlásit se špatným heslem
4. **Očekávání**: Zobrazí se alert "Špatný email nebo heslo"

## Časové nároky

- **Setup**: 2-3 minuty
- **Test scenarios**: 5-7 minut
- **Celkem**: ~10 minut

## Troubleshooting

### ❌ Chyba: "Missing Firebase config"
- **Řešení**: Zkontroluj `.env` soubor a restart `npm run reset`
- **Debug**: Zavolej `logFirebaseConfigDebug()` v konzoli

### ❌ Chyba: "Firebase: Error (auth/invalid-api-key)"
- **Řešení**: Zkontroluj `FIREBASE_API_KEY` v `.env` → musí být správná hodnota z Firebase Console

### ❌ Session se neudrží po refreshi
- **Řešení**: Zkontroluj, že používáš `initializeAuth` s `getReactNativePersistence(AsyncStorage)`
- **Poznámka**: Na webu funguje jinak než v native app

### ❌ HMR (hot reload) konflikty
- **Řešení**: Spusť `npm run reset` pro clean restart Metro bundleru

## Success Criteria

✅ **Úspěšný test znamená:**
- Registrace nového uživatele bez chyb
- Session persistence funguje (refresh + close/open)
- Přihlášení/odhlášení bez problémů  
- Reset hesla odešle email
- Validace zobrazuje české chyby
- Firebase Console ukazuje registrované uživatele

## Poznámky

- Test funguje nejlépe v **incognito/private** módu (čistý stav)
- V production prostředí použij **EAS Secrets** místo `.env`
- `storageBucket` s doménou `*.firebasestorage.app` je OK (nová Firebase doména)