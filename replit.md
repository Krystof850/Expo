# Overview

This Expo React Native application integrates Firebase Authentication and an OpenAI-powered micro-task generation system. It features email/password authentication with persistent user sessions, a clean TypeScript architecture, protected routes, form validation, and an automatic sign-in/registration flow. The app utilizes expo-router for navigation, includes an optional onboarding assessment, and offers a comprehensive "I feel tempted" procrastination workflow with AI-generated micro-tasks. The project is configured for Replit, running an Expo web server on port 5000 with tunnel mode and includes production-ready error handling and paywall integration via Superwall.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Expo SDK with React Native and React.
- **Navigation**: expo-router for file-based routing and typed routes.
- **Language**: Full TypeScript support with strict compilation.
- **UI/UX**: Custom themed components supporting light/dark modes, professional page transitions, animated progress bars, and staggered content animations. Blue gradient design system is used across onboarding screens. Haptic feedback is integrated throughout the application.
- **Form Management**: Formik for form handling with Yup schema validation.
- **State Management**: React Context for authentication.
- **Persistence**: AsyncStorage for user sessions.

## Route Structure
- **Onboarding Routes**: `(onboarding)` stack for a 10-question procrastination assessment.
- **Public Routes**: `(auth)` stack for sign-in, sign-up, and forgot password.
- **Protected Routes**: `(protected)` stack for authenticated user content.
- **Tab Navigation**: `(tabs)` stack for main app navigation.
- **Route Protection**: Automatic redirects based on onboarding completion and authentication state.

## Onboarding Assessment System
- **Purpose**: A 10-question assessment to understand user procrastination patterns.
- **Flow**: Linear progression, collecting user data (name, age) and persisting responses in AsyncStorage.
- **Completion**: Marks onboarding as complete and redirects to authentication.

## Authentication System
- **Provider**: Firebase Auth with React Native persistence using AsyncStorage.
- **Error Handling**: Custom error mapping for Firebase auth errors and user-friendly error popups.
- **Form Validation**: Email format and password strength validation using Formik and Yup.
- **Auth Methods**: Email/password sign-up, sign-in, password reset, and Google Sign In (OAuth flow via expo-auth-session with Firebase credential integration).

## OpenAI Integration
- **Functionality**: Server-side API endpoint for secure micro-task generation using GPT-5.
- **Security**: OpenAI API key secured on the server-side.
- **Robustness**: Includes a robust error handling system with fallback to rule-based task generation.

## Component Architecture
- **Animations**: Utilizes React Native Reanimated for page transitions, staggered content reveals, and smooth progress bar animations.
- **Theming**: ThemedText and ThemedView components for consistent light/dark mode support.
- **Route Protection**: Higher-order components for protecting routes.
- **Context**: Centralized authentication state via Auth Context.

## Configuration Management
- **Environment Variables**: Firebase configuration via app.config.ts extra fields.
- **Platform Support**: Web, iOS, and Android with platform-specific optimizations.

# External Dependencies

## Firebase Services
- **Firebase Auth**: Email/password authentication, session persistence, and Google Sign In.
- **Configuration Required**: FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, GOOGLE_CLIENT_ID.

## Superwall Integration
- **expo-superwall**: Paywall system for subscription management.
- **Configuration Required**: SUPERWALL_API_KEY.

## Core Libraries
- **@react-native-async-storage/async-storage**: Local storage.
- **formik**: Form state management.
- **yup**: Schema validation.
- **expo-auth-session**: OAuth authentication flows.
- **expo-web-browser**: Web browser integration.
- **expo-crypto**: Cryptographic operations for OAuth PKCE flow.
- **expo-haptics**: Tactile feedback.
- **react-native-reanimated**: Animations.

## Expo SDK Modules
- **expo-router**: Navigation.
- **expo-font**: Custom font loading.
- **expo-splash-screen**: Startup screen.
- **@expo/vector-icons**: Icon library.
- **expo-blur**: iOS blur effects.

## Navigation
- **@react-navigation/native**: Core navigation.
- **@react-navigation/bottom-tabs**: Tab navigation.
- **react-native-screens**: Native screen management.
- **react-native-safe-area-context**: Safe area handling.