import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as Haptics from 'expo-haptics';
import { useAuth } from "../../src/context/AuthContext";
import { Protected } from "../../src/components/Protected";
import HapticButton from '../../components/HapticButton';
import { TitleText, DescriptionText } from '../../components/Text';
import { COLORS, SPACING } from '@/constants/theme';

export default function Home() {
  const { user, logout } = useAuth();

  const handleShowPaywall = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Paywall", 
      "For Expo Go version, paywall is disabled. Use development build for full functionality.",
      [
        { text: "OK", style: "default" }
      ]
    );
  };

  const handleLogout = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logout();
  };

  return (
    <Protected>
      <View style={styles.container}>
        <TitleText style={styles.title}>Welcome to the protected area!</TitleText>
        <DescriptionText style={styles.email}>Signed in as: {user?.email}</DescriptionText>
        
        <View style={styles.paywallSection}>
          <TitleText style={styles.subtitle}>Premium Features</TitleText>
          <DescriptionText style={styles.description}>
            Get access to advanced features to increase productivity.
          </DescriptionText>
          <HapticButton 
            style={styles.paywallButton}
            onPress={handleShowPaywall}
          >
            <TitleText style={styles.paywallButtonText}>Show Paywall (Demo)</TitleText>
          </HapticButton>
          <DescriptionText style={styles.templateInfo}>
            Note: Paywall is disabled in Expo Go
          </DescriptionText>
        </View>
        
        <View style={styles.logoutSection}>
          <HapticButton style={styles.logoutButton} onPress={handleLogout}>
            <TitleText style={styles.logoutButtonText}>Sign Out</TitleText>
          </HapticButton>
        </View>
      </View>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  paywallSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    textAlign: "center",
    marginBottom: SPACING.md,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  paywallButton: {
    backgroundColor: COLORS.primaryAction,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: COLORS.primaryAction,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  paywallButtonText: {
    color: COLORS.mainText,
    fontSize: 16,
    fontWeight: '600',
  },
  templateInfo: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: SPACING.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
  logoutSection: {
    marginTop: SPACING.lg,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: COLORS.mainText,
    fontSize: 16,
    fontWeight: '600',
  },
});