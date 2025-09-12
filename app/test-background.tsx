import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/AppBackground';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

export default function TestBackground() {
  const insets = useSafeAreaInsets();
  const [touchCount, setTouchCount] = useState(0);

  const handleTouch = () => {
    setTouchCount(prev => prev + 1);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AppBackground>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AppBackground Test</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>Testing Component Fixes:</Text>
          
          <View style={styles.testSection}>
            <Text style={styles.testLabel}>✅ Layering Fix:</Text>
            <Text style={styles.testDescription}>
              Background doesn't block touch interactions
            </Text>
          </View>

          <View style={styles.testSection}>
            <Text style={styles.testLabel}>✅ Animated Gradient:</Text>
            <Text style={styles.testDescription}>
              15s color cycling animation overlay
            </Text>
          </View>

          <View style={styles.testSection}>
            <Text style={styles.testLabel}>✅ Staggered Animations:</Text>
            <Text style={styles.testDescription}>
              Blur balls animate with natural delays
            </Text>
          </View>

          <View style={styles.testSection}>
            <Text style={styles.testLabel}>✅ Performance:</Text>
            <Text style={styles.testDescription}>
              Android-optimized shadows and blur effects
            </Text>
          </View>

          {/* Interactive test button */}
          <TouchableOpacity 
            style={styles.testButton}
            onPress={handleTouch}
          >
            <Text style={styles.testButtonText}>
              Touch Test: {touchCount} taps
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            If you can tap this button, touch interactions work correctly!
          </Text>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.page,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.small,
    marginBottom: SPACING.large,
  },
  backButton: {
    padding: SPACING.small,
    marginRight: SPACING.small,
  },
  backButtonText: {
    ...TYPOGRAPHY.buttonSelect,
    color: COLORS.primaryAction,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.title,
    fontSize: 20,
    marginBottom: SPACING.large,
  },
  testSection: {
    marginBottom: SPACING.gap,
    alignItems: 'center',
  },
  testLabel: {
    ...TYPOGRAPHY.buttonSelect,
    color: COLORS.accentGreen,
    marginBottom: 8,
  },
  testDescription: {
    ...TYPOGRAPHY.description,
    textAlign: 'center',
    maxWidth: 300,
  },
  testButton: {
    backgroundColor: COLORS.primaryAction,
    paddingVertical: SPACING.button,
    paddingHorizontal: SPACING.large,
    borderRadius: 50,
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
  },
  testButtonText: {
    ...TYPOGRAPHY.buttonNext,
    color: COLORS.ctaText,
  },
  note: {
    ...TYPOGRAPHY.description,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 280,
  },
});