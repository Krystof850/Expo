import React, { useState } from "react";
import { router, Redirect, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { signInWithApple, isAppleSignInAvailable } from "../../src/services/auth";
import { useAuth } from "../../src/context/AuthContext";
import { FirebaseConfigBanner } from "../../src/components/FirebaseConfigBanner";
import { AuthErrorBoundary } from "../../src/components/AuthErrorBoundary";
import { useErrorHandler, createAuthError } from "../../src/components/UserFriendlyErrorHandler";
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function SignIn() {
  const { user } = useAuth();
  const { showError } = useErrorHandler();
  const router = useRouter();
  const [appleLoading, setAppleLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const insets = useSafeAreaInsets();

  // Check Apple Sign In availability on component mount
  React.useEffect(() => {
    const checkAppleAvailability = async () => {
      const available = await isAppleSignInAvailable();
      setAppleAvailable(available);
    };
    checkAppleAvailability();
  }, []);



  const handleAppleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      setAppleLoading(true);
      const result = await signInWithApple();
      console.log('[SignIn] Apple Sign In successful for user:', result.user.uid);
    } catch (e: any) {
      console.error('[SignIn] Apple Sign In failed:', e);
      showError(createAuthError(e.message || "Apple Sign In failed. Please try again."));
    } finally {
      setAppleLoading(false);
    }
  };


  if (user) return <Redirect href="/(tabs)/" />;

  return (
    <AuthErrorBoundary>
      <AppBackground>
        <FirebaseConfigBanner />
        <View style={styles.container}>          
          <View style={[styles.content, { paddingTop: insets.top + SPACING.xl }]}>
            <View style={[styles.header, { overflow: 'visible' }]}>
              <TitleText animated={false} style={[styles.title, { fontSize: 32, lineHeight: Math.round(32 * 1.25) }]}>Sign In</TitleText>
              <DescriptionText animated={false} style={styles.subtitle}>Sign in with your Apple ID to continue</DescriptionText>
            </View>

            <View style={styles.buttonContainer}>
              {/* Apple Sign In Button */}
              {appleAvailable && (
                <HapticButton 
                  style={[styles.signInButton, appleLoading && styles.disabledButton]}
                  onPress={handleAppleSignIn}
                  disabled={appleLoading}
                >
                  <Ionicons name="logo-apple" size={24} color="#000000" style={styles.buttonIcon} />
                  <TitleText animated={false} style={styles.buttonText}>
                    {appleLoading ? "Signing in..." : "Continue with Apple"}
                  </TitleText>
                </HapticButton>
              )}

            </View>

          </View>
        </View>
      </AppBackground>
    </AuthErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  signInButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderRadius: 16,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  googleButton: {
    width: '100%',
    height: 48,
  },
});