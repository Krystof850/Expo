import React, { useState } from "react";
import { router, Redirect } from "expo-router";
import { View, Text, Alert, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { signInWithGoogle } from "../../src/services/auth";
import { useAuth } from "../../src/context/AuthContext";
import { FirebaseConfigBanner } from "../../src/components/FirebaseConfigBanner";
import { AuthErrorBoundary } from "../../src/components/AuthErrorBoundary";
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function SignIn() {
  const { user } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const insets = useSafeAreaInsets();


  const handleGoogleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Google Sign In failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      // TODO: Implement Apple Sign In with Firebase
      Alert.alert("Apple Sign In", "Apple Sign In coming soon!");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Apple Sign In failed.");
    }
  };

  const handleEmailSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/email-signin');
  };

  if (user) return <Redirect href="/(tabs)/" />;

  return (
    <AuthErrorBoundary>
      <AppBackground>
        <FirebaseConfigBanner />
        <View style={styles.container}>
          <View style={[styles.content, { paddingTop: insets.top + SPACING.xl * 2 }]}>
            <View style={[styles.header, { overflow: 'visible' }]}>
              <TitleText style={[styles.title, { fontSize: 32, lineHeight: Math.round(32 * 1.25) }]}>Sign In</TitleText>
              <DescriptionText style={styles.subtitle}>Choose your preferred sign-in method</DescriptionText>
            </View>

            <View style={styles.buttonContainer}>
              {/* Apple Sign In Button */}
              <HapticButton 
                style={styles.signInButton}
                onPress={handleAppleSignIn}
              >
                <Ionicons name="logo-apple" size={24} color="#000000" style={styles.buttonIcon} />
                <TitleText style={styles.buttonText}>Continue with Apple</TitleText>
              </HapticButton>

              {/* Google Sign In Button */}
              <HapticButton 
                style={[styles.signInButton, googleLoading && styles.disabledButton]}
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
              >
                <Text style={styles.googleIcon}>G</Text>
                <TitleText style={styles.buttonText}>
                  {googleLoading ? "Signing in..." : "Continue with Google"}
                </TitleText>
              </HapticButton>

              {/* Email Sign In Button */}
              <HapticButton 
                style={styles.signInButton}
                onPress={handleEmailSignIn}
              >
                <Ionicons name="mail" size={20} color="#000000" style={styles.buttonIcon} />
                <TitleText style={styles.buttonText}>Continue with Email</TitleText>
              </HapticButton>
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
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285f4',
    marginRight: SPACING.sm,
    width: 20,
    textAlign: 'center',
  },
});