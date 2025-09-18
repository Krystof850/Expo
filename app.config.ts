import { ConfigContext, ExpoConfig } from "expo/config";

// Load environment variables directly
const firebaseApiKey = process.env.FIREBASE_API_KEY;
const superwallApiKey = process.env.SUPERWALL_API_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const iosGoogleClientId = process.env.IOS_GOOGLE_CLIENT_ID;
const supportEmail = process.env.SUPPORT_EMAIL || 'unloop.app.tech@gmail.com';

console.log('🔧 Loading environment variables:', {
  firebaseApiKey: firebaseApiKey ? 'loaded' : 'missing',
  superwallApiKey: superwallApiKey ? 'loaded' : 'missing',
  googleClientId: googleClientId ? 'loaded' : 'missing',
  iosGoogleClientId: iosGoogleClientId ? 'loaded' : 'missing',
  supportEmail: supportEmail ? 'loaded' : 'missing'
});

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "Unloop Dev",
  slug: config.slug ?? "unloop-dev",
  owner: 'krystofkapka1',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.jpg',
  scheme: 'unloop',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,

  ios: {
    ...(config.ios ?? {}),
    supportsTablet: true,
    bundleIdentifier: "com.unloopapp",
    infoPlist: {
      ...(config.ios?.infoPlist ?? {}),
      ITSAppUsesNonExemptEncryption: false,
    },
    entitlements: {
      "com.apple.developer.applesignin": ["Default"],
    },
    usesAppleSignIn: true,
  },

  android: {
    ...(config.android ?? {}),
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: "com.unloopapp",
  },

  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-dev-client',
    'expo-router',
    'expo-web-browser',
    '@react-native-google-signin/google-signin',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 26,
        },
        ios: {
          deploymentTarget: '15.1',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },

  extra: {
    ...(config.extra ?? {}),
    FIREBASE_API_KEY: firebaseApiKey,
    FIREBASE_AUTH_DOMAIN: "procrastination-app-ddf27.firebaseapp.com",
    FIREBASE_PROJECT_ID: "procrastination-app-ddf27",
    FIREBASE_STORAGE_BUCKET: "procrastination-app-ddf27.firebasestorage.app",
    FIREBASE_MESSAGING_SENDER_ID: "576633089196",
    FIREBASE_APP_ID: "1:576633089196:web:cab74d64e4665a735fc309",
    GOOGLE_CLIENT_ID: googleClientId,
    IOS_GOOGLE_CLIENT_ID: iosGoogleClientId,
    SUPERWALL_API_KEY: superwallApiKey,
    SUPPORT_EMAIL: supportEmail,
  },
});