import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { COLORS, GRADIENTS, SPACING } from '../constants/theme';

interface OnboardingHeaderProps {
  step: number;
  total: number;
  questionLabel?: string;
}

export interface OnboardingHeaderRef {
  runExitAnimation: (callback: () => void) => void;
}

export const OnboardingHeader = forwardRef<OnboardingHeaderRef, OnboardingHeaderProps>(
  ({ step, total, questionLabel }, ref) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    // Animated progress value (fraction 0-1)
    const progressFraction = useSharedValue(0);
    const questionOpacity = useSharedValue(0);
    const questionScale = useSharedValue(0.9);
    
    // Calculate target progress fraction
    const targetFraction = step / total;

    // Animate progress when step changes
    useEffect(() => {
      progressFraction.value = withTiming(targetFraction, {
        duration: 250,
      });
      
      // Animate question label appearance
      questionOpacity.value = withTiming(1, {
        duration: 300,
      });
      
      questionScale.value = withSpring(1, {
        damping: 12,
        stiffness: 100,
      });
    }, [step, targetFraction]);

    // Expose exit animation method for question label
    useImperativeHandle(ref, () => ({
      runExitAnimation: (callback: () => void) => {
        questionOpacity.value = withTiming(0, { duration: 300 });
        questionScale.value = withTiming(0.8, { 
          duration: 300 
        }, (finished) => {
          if (finished) {
            runOnJS(callback)();
          }
        });
      },
    }));

    // Animated styles for progress bar
    const progressAnimatedStyle = useAnimatedStyle(() => {
      return {
        width: `${progressFraction.value * 100}%`,
      };
    });

    // Animated styles for question label
    const questionAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: questionOpacity.value,
        transform: [
          {
            translateY: interpolate(questionOpacity.value, [0, 1], [10, 0])
          },
          {
            scale: questionScale.value
          }
        ]
      };
    });

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
              <Animated.View
                style={[styles.progressFill, progressAnimatedStyle]}
              />
            </View>
          </View>
        </View>
        
        {/* Question label */}
        {questionLabel && (
          <Animated.Text style={[styles.questionLabel, questionAnimatedStyle]}>
            {questionLabel}
          </Animated.Text>
        )}
      </View>
    );
  }
);

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