import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, GRADIENTS, SPACING } from '../constants/theme';

interface OnboardingHeaderProps {
  step: number;
  total: number;
  questionLabel?: string;
}

export function OnboardingHeader({ step, total, questionLabel }: OnboardingHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const progressPercentage = (step / total) * 100;

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back arrow and progress bar row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.mainText} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
        </View>
      </View>
      
      {/* Question label */}
      {questionLabel && (
        <Text style={styles.questionLabel}>{questionLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.page,
    paddingBottom: SPACING.small,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 10,
    backgroundColor: COLORS.progressTrack,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: 5,
    shadowColor: COLORS.progressFill,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  questionLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.questionLabel,
    textAlign: 'center',
    marginTop: SPACING.small,
    // Removed textShadow for better web compatibility
  },
});