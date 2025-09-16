import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

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
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: "procrastination-app-ddf27.firebaseapp.com",
    FIREBASE_PROJECT_ID: "procrastination-app-ddf27",
    FIREBASE_STORAGE_BUCKET: "procrastination-app-ddf27.firebasestorage.app",
    FIREBASE_MESSAGING_SENDER_ID: "576633089196",
    FIREBASE_APP_ID: "1:576633089196:web:cab74d64e4665a735fc309",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    SUPERWALL_API_KEY: process.env.SUPERWALL_API_KEY,
  },
});