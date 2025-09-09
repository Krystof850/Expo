# Expo Firebase Auth Project

## Co je hotové
- ✅ Email+heslo sign-in, sign-up, forgot password
- ✅ Perzistence session přes AsyncStorage 
- ✅ Protected routes s automatickým přesměrováním
- ✅ Validace formulářů s Formik + Yup
- ✅ Mapování Firebase chyb na české texty
- ✅ TypeScript podpora

## Instalace

1. Nainstaluj závislosti:
```bash
npm install
```

2. Spusť vývojový server:
```bash
npx expo start --web
```

## Konfigurace Firebase

### 1. Vytvoř Firebase projekt
1. Jdi na [Firebase Console](https://console.firebase.google.com/)
2. Klikni na "Add project"
3. Zadej název projektu a dokončí setup

### 2. Přidej aplikaci
1. V Firebase Console klikni na ikonu "Web" (</>)
2. Zadej nickname pro app (např. "my-expo-app")
3. Zkopíruj si config objekt s těmito hodnotami:
   - `apiKey`
   - `authDomain` 
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 3. Povol Email/Password autentizaci
1. V Firebase Console jdi na "Authentication" → "Sign-in method"
2. Klikni na "Email/Password"
3. Povol první možnost "Email/Password"
4. Ulož změny

### 4. Nastav prostředí

#### Pro lokální vývoj:
1. Zkopíruj `.env.example` na `.env`:
```bash
cp .env.example .env
```

2. Vyplň `.env` soubor s Firebase config hodnotami:
```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

#### Pro produkci (EAS Build):
```bash
# Nastav secrets pro EAS
eas secret:create --scope project --name FIREBASE_API_KEY --value "your_api_key"
eas secret:create --scope project --name FIREBASE_AUTH_DOMAIN --value "your_project.firebaseapp.com"
eas secret:create --scope project --name FIREBASE_PROJECT_ID --value "your_project_id"
eas secret:create --scope project --name FIREBASE_STORAGE_BUCKET --value "your_project.appspot.com"
eas secret:create --scope project --name FIREBASE_MESSAGING_SENDER_ID --value "123456789"
eas secret:create --scope project --name FIREBASE_APP_ID --value "1:123456789:web:abcdef123456"
```

## Struktura projektu

```
app/
├── (auth)/                 # Auth screens
│   ├── sign-in.tsx         # Přihlášení
│   ├── sign-up.tsx         # Registrace
│   └── forgot.tsx          # Obnova hesla
├── (protected)/            # Chráněné stránky
│   └── index.tsx           # Domovská stránka po přihlášení
├── (tabs)/                 # Původní tab navigace
└── _layout.tsx             # Root layout s AuthProvider

src/
├── lib/
│   └── firebase.ts         # Firebase konfigurace a inicializace
├── services/
│   └── auth.ts             # Auth funkce (sign-in, sign-up, atd.)
├── context/
│   └── AuthContext.tsx     # React Context pro user state
└── components/
    └── Protected.tsx       # Ochrana chráněných rout
```

## Použití

### Autentizace
- Uživatel bez přihlášení je automaticky přesměrován na `/(auth)/sign-in`
- Po úspěšném přihlášení je přesměrován na `/(protected)/`
- Session se automaticky obnovuje díky AsyncStorage persistence

### Navigace mezi auth screens
- **Sign In** → Sign Up: "Nemáš účet? Registrace"  
- **Sign In** → Forgot: "Zapomenuté heslo"
- **Sign Up** → Sign In: "Už máš účet? Přihlásit"
- **Forgot** → Sign In: "Zpět na přihlášení"

## Běžné problémy a řešení

### "Missing Firebase config" warning
- Ujisti se, že máš vyplněné všechny FIREBASE_* proměnné v `.env` nebo EAS secrets
- Restartuj Metro bundler: `r` v terminálu nebo `npx expo start --clear`

### Auth persistence nefunguje
- Ujistí se, že používáš `initializeAuth` s `getReactNativePersistence(AsyncStorage)`
- Zkontroluj, že `@react-native-async-storage/async-storage` je správně nainstalovaný

### HMR problémy s Firebase auth
- Firebase auth někdy potřebuje restart při HMR
- Refreshni stránku nebo restartuj dev server

### Type errors po updatech
- Spusť `npx expo install --fix` pro opravu verzí balíčků
- Případně smaž `node_modules` a spusť `npm install`

## Další kroky (volitelné)

### Security Rules
Nastav Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### App Check (doporučeno pro produkci)
- Povol App Check v Firebase Console
- Přidej reCAPTCHA pro web
- Nastav App Attest pro iOS a Play Integrity pro Android

### Další auth providers
- Google Sign-In
- Apple Sign-In  
- Facebook Login
- Phone number auth

## TODO Checklist

### Firebase Console kroky:
- [ ] Vytvořen Firebase projekt
- [ ] Přidána web aplikace
- [ ] Povolen Email/Password provider v Authentication
- [ ] (Volitelně) Nastaveny Firestore rules
- [ ] (Volitelně) Povolen App Check

### Projekt kroky:  
- [ ] Zkopírován `.env.example` na `.env`
- [ ] Vyplněny Firebase config hodnoty do `.env`
- [ ] Spuštěn `npm install`
- [ ] Spuštěn `npx expo start`
- [ ] Otestováno přihlášení/registrace
- [ ] (Pro produkci) Nastaveny EAS secrets

## Podpora

Pokud máš problémy:
1. Zkontroluj Firebase Console logs v "Authentication" → "Users"
2. Otevři developer tools v prohlížeči a koukni do console
3. Ujisti se, že máš všechny ENV proměnné správně nastavené
4. Restartuj dev server (`npx expo start --clear`)