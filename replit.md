# Overview

This is an Expo React Native application with Firebase Authentication integration. The app implements email/password authentication with persistent user sessions using AsyncStorage. It features a clean TypeScript architecture with protected routes, form validation, and Czech language error mapping. The application uses expo-router for navigation and includes both public authentication screens and protected user areas.

**Recent Updates (Sep 11, 2025):**
- ✅ **NEW: 10-Question Procrastination Assessment System** - Complete onboarding redesign
- ✅ Removed welcome screens - Direct flow from app start to procrastination assessment
- ✅ 9 focused procrastination questions with progressive difficulty and relevance
- ✅ Final data collection screen with name and age input fields (improved layout for keyboard visibility)
- ✅ **NEW: Results Analysis Screen** - Static procrastination assessment results with visual score comparison
- ✅ Animated waiting screen with 10-second calculation timer - now navigates to results screen
- ✅ Blue gradient design system maintained across all onboarding screens (COLORS, TYPOGRAPHY, SPACING)  
- ✅ Progress tracking (1/10 through 10/10) with cyan progress bar and back arrow navigation
- ✅ Hardware back button blocking on Android for forced linear progression
- ✅ AsyncStorage persistence for all 10 assessment responses with dedicated keys including user name and age
- ✅ **NEW: Symptoms Selection Screen** - Multi-select symptoms interface for procrastination assessment
- ✅ **NEW: Goals Selection Screen** - Multi-select goals interface for tracking personal objectives
- ✅ Complete onboarding flow: Assessment → Waiting → Results → Symptoms → Goals → Authentication
- ✅ Complete Firebase Auth implementation with email/password authentication
- ✅ Session persistence using AsyncStorage for React Native  
- ✅ Protected routes with automatic redirects
- ✅ Auth screens: Sign In, Sign Up, Forgot Password
- ✅ Form validation with Formik + Yup
- ✅ Czech language error mapping for Firebase auth errors
- ✅ **Google Sign In integration** - Full OAuth flow with expo-auth-session
- ✅ Google Sign In UI components in both sign-in and sign-up screens
- ✅ Firebase credential integration for Google OAuth tokens
- ✅ **Superwall Integration** - Complete paywall system integration
- ✅ SuperwallProvider configured in root layout with API key management
- ✅ Paywall hooks integrated in protected area with placement "campaign_trigger"
- ✅ EAS Build configuration ready for development builds
- ✅ expo-build-properties configured for iOS 14.0+ and Android SDK 26+

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
- **Onboarding Routes**: `(onboarding)` stack with 10-question procrastination assessment (question1-question10, waiting screen)
- **Public Routes**: `(auth)` stack containing sign-in, sign-up, and forgot password screens
- **Protected Routes**: `(protected)` stack for authenticated user content
- **Tab Navigation**: `(tabs)` stack with home and explore screens
- **Route Protection**: Automatic redirects based on onboarding completion and authentication state

## Onboarding Assessment System
- **Purpose**: 10-question procrastination assessment to understand user behavioral patterns
- **Design**: Blue gradient background (#6BB6FF → #5B9BD5 → #4682B4) with cyan progress bar (#4DD0E1)
- **Navigation**: Linear progression with hardware back blocking, only back arrow navigation allowed
- **Questions**: Gender, scrolling habits, control cycles, daily procrastination frequency, task difficulty, delay patterns, triggers, self-worth impact, life improvement beliefs
- **Data Collection**: Final screen collects user name and age with input validation
- **Processing Screen**: 10-second animated waiting screen with circular progress bar and "Calculating" message
- **Persistence**: Each response stored in AsyncStorage with dedicated keys (onboarding_gender, onboarding_scroll_distract, onboarding_name, onboarding_age, etc.)
- **Completion**: Sets onboarding_complete='true' and redirects to authentication after waiting screen

## Authentication System
- **Provider**: Firebase Auth v12.2.1 with React Native persistence
- **Session Management**: initializeAuth with getReactNativePersistence using AsyncStorage
- **Error Handling**: Custom Czech language error mapping for Firebase auth errors
- **Form Validation**: Email format validation and password strength requirements (min 6 characters)
- **Auth Methods**: 
  - Email/password sign-up, sign-in, and password reset functionality
  - **Google Sign In**: OAuth flow using expo-auth-session with Firebase credential integration
- **OAuth Configuration**: Google Client ID integration for seamless Google authentication

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
  - **GOOGLE_CLIENT_ID** (for Google Sign In functionality)

## Superwall Integration
- **expo-superwall**: Paywall system for subscription management
- **SuperwallProvider**: Configured at root level with loading states
- **Placement Integration**: Uses "campaign_trigger" placement in protected area
- **Configuration Required**:
  - SUPERWALL_API_KEY (Public API Key from Superwall dashboard)

## Core Libraries
- **@react-native-async-storage/async-storage**: Local storage for session persistence
- **formik**: Form state management and submission handling
- **yup**: Schema validation for forms
- **expo-constants**: Access to app configuration and environment variables
- **expo-auth-session**: OAuth authentication flows for Google Sign In
- **expo-web-browser**: Web browser integration for auth flows
- **expo-crypto**: Cryptographic operations for OAuth PKCE flow
- **expo-superwall**: Superwall SDK for paywall presentation and subscription management
- **expo-build-properties**: Configuration plugin for minimum platform versions

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