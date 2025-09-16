import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../src/context/AuthContext';
import PremiumButton from '../src/components/PremiumButton';

export default function Index() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();

  // If user is already authenticated, go to homepage
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  if (loading) {
    return null; // Show nothing while loading
  }

  const handleStartQuiz = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(onboarding)/question1');
  };

  const handleSkipToLogin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/sign-in');
  };



  return (
    <LinearGradient
      colors={['#87CEEB', '#5DADE2', '#3498DB']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        
        {/* Logo/Title Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Unloop AI</Text>
          <Text style={styles.subtitle}>Overcome procrastination forever</Text>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={80} color="rgba(255, 255, 255, 0.8)" />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartQuiz}>
            <Ionicons name="play-circle-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Start Assessment Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSkipToLogin}>
            <Ionicons name="log-in-outline" size={20} color="#2C3E50" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Skip to Login</Text>
          </TouchableOpacity>

          <PremiumButton />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Take our 5-minute assessment to get personalized insights
          </Text>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34495E',
    textAlign: 'center',
    opacity: 0.8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#2980B9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: 'rgba(41, 128, 185, 0.4)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  paywallButton: {
    backgroundColor: 'rgba(230, 126, 34, 0.1)',
    borderWidth: 2,
    borderColor: '#E67E22',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: 'rgba(230, 126, 34, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  paywallButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E67E22',
  },
  footerText: {
    fontSize: 14,
    color: '#5A6C7D',
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
  },
});