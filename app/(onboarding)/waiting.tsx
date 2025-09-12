import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TitleText, DescriptionText } from '../../components/Text';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 120;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2 - 10;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function OnboardingWaiting() {
  const [progress, setProgress] = useState<number>(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const strokeDashoffset = useRef(new Animated.Value(CIRCUMFERENCE)).current;

  // Block hardware back button on Android only
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') {
        return; // BackHandler only works on Android
      }
      
      const onBackPress = () => {
        return true; // Block hardware back - user cannot go back during loading
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  useEffect(() => {
    // Progress bar and percentage animation
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    // Stroke-dashoffset animation for circular progress
    Animated.timing(strokeDashoffset, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();

    // Progress animation for percentage display
    Animated.timing(progressAnimation, {
      toValue: 100,
      duration: duration,
      useNativeDriver: false,
    }).start();

    // Listener for progress text updates
    const progressListener = progressAnimation.addListener(({ value }) => {
      setProgress(Math.round(value));
    });

    // Timeout for completion
    const completionTimer = setTimeout(async () => {
      try {
        // Mark onboarding as completed
        await AsyncStorage.setItem('onboarding_complete', 'true');
        console.log('📝 Onboarding completed - navigating to results...');
        // Navigate to results
        router.push('/(onboarding)/results');
      } catch (error) {
        console.log('Error completing onboarding:', error);
        // Continue to results even on error
        router.push('/(onboarding)/results');
      }
    }, duration);

    // Cleanup
    return () => {
      progressAnimation.removeListener(progressListener);
      clearTimeout(completionTimer);
    };
  }, []);

  return (
    <AppBackground>
      <View style={styles.container}>
      <View style={styles.content}>
        {/* Circular Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.circleContainer}>
            {/* Background circle */}
            <View style={styles.backgroundCircle} />
            
            {/* Progress circle using border animation */}
            <Animated.View 
              style={[
                styles.progressCircle,
                {
                  borderColor: COLORS.progressFill,
                  transform: [
                    {
                      rotate: progressAnimation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]} 
            />
            
            {/* Center content */}
            <View style={styles.centerContent}>
              <Text style={styles.percentageText}>{progress}%</Text>
            </View>
          </View>
        </View>

        {/* Text content */}
        <View style={styles.textSection}>
          <TitleText animated={false} style={styles.titleText}>Processing</TitleText>
          <DescriptionText animated={false} style={styles.subtitleText}>Analyzing your procrastination patterns</DescriptionText>
        </View>
      </View>
    </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
  },
  progressContainer: {
    marginBottom: 48,
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 8,
    borderColor: COLORS.progressTrack,
  },
  progressCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 8,
    borderColor: COLORS.progressFill,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
  },
  textSection: {
    alignItems: 'center',
    maxWidth: 320,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.questionLabel,
    textAlign: 'center',
    lineHeight: 22,
  },
});