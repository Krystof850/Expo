# Overview

This is an Expo React Native application with Firebase Authentication integration. The app implements email/password authentication with persistent user sessions using AsyncStorage. It features a clean TypeScript architecture with protected routes, form validation, and Czech language error mapping. The application uses expo-router for navigation and includes both public authentication screens and protected user areas.

**Recent Updates (Sep 9, 2025):**
- ✅ Complete Firebase Auth implementation with email/password authentication
- ✅ Session persistence using AsyncStorage for React Native
- ✅ Protected routes with automatic redirects
- ✅ Auth screens: Sign In, Sign Up, Forgot Password
- ✅ Form validation with Formik + Yup
- ✅ Czech language error mapping for Firebase auth errors
- ✅ Comprehensive README with Firebase setup instructions

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Expo SDK ~53.0.9 with React Native 0.79.2 and React 19.0.0
- **Navigation**: expo-router with file-based routing supporting typed routes
- **TypeScript**: Full TypeScript support with strict compilation
- **UI Components**: Custom themed components with light/dark mode support
- **Form Management**: Formik for form handling with Yup schema validation
- **State Management**: React Context for authentication state management
- **Persistence**: AsyncStorage for maintaining user sessions across app restarts

## Route Structure
- **Public Routes**: `(auth)` stack containing sign-in, sign-up, and forgot password screens
- **Protected Routes**: `(protected)` stack for authenticated user content
- **Tab Navigation**: `(tabs)` stack with home and explore screens
- **Route Protection**: Automatic redirects based on authentication state

## Authentication System
- **Provider**: Firebase Auth v12.2.1 with React Native persistence
- **Session Management**: initializeAuth with getReactNativePersistence using AsyncStorage
- **Error Handling**: Custom Czech language error mapping for Firebase auth errors
- **Form Validation**: Email format validation and password strength requirements (min 6 characters)
- **Auth Flow**: Email/password sign-up, sign-in, and password reset functionality

## Component Architecture
- **Themed Components**: ThemedText and ThemedView components supporting light/dark modes
- **Protected Component**: Higher-order component for route protection with loading states
- **Auth Context**: Centralized authentication state with user object and logout functionality
- **Platform-Specific Icons**: SF Symbols on iOS, Material Icons on Android/web

## Configuration Management
- **Environment Variables**: Firebase configuration through app.config.ts extra fields
- **Development Safety**: Graceful degradation when Firebase keys are missing (warnings instead of crashes)
- **Platform Support**: Web, iOS, and Android with platform-specific optimizations

# External Dependencies

## Firebase Services
- **Firebase Auth**: Email/password authentication with session persistence
- **Configuration Required**: 
  - FIREBASE_API_KEY
  - FIREBASE_AUTH_DOMAIN
  - FIREBASE_PROJECT_ID
  - FIREBASE_STORAGE_BUCKET
  - FIREBASE_MESSAGING_SENDER_ID
  - FIREBASE_APP_ID

## Core Libraries
- **@react-native-async-storage/async-storage**: Local storage for session persistence
- **formik**: Form state management and submission handling
- **yup**: Schema validation for forms
- **expo-constants**: Access to app configuration and environment variables

## Expo SDK Modules
- **expo-router**: File-based navigation system
- **expo-font**: Custom font loading (SpaceMono)
- **expo-splash-screen**: App startup screen configuration
- **@expo/vector-icons**: Icon library for UI components
- **expo-blur**: iOS blur effects for tab bar
- **expo-haptics**: Tactile feedback for interactions

## Navigation
- **@react-navigation/native**: Core navigation functionality
- **@react-navigation/bottom-tabs**: Tab-based navigation
- **react-native-screens**: Native screen management
- **react-native-safe-area-context**: Safe area handling across devices

## Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting with Expo configuration
- **Jest**: Testing framework setup