import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TitleText, DescriptionText } from '../../components/Text';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 200; // Larger size for better visibility
const CIRCLE_RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const SVG_SIZE = CIRCLE_SIZE;

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
            {/* SVG Circle with animated stroke-dashoffset */}
            <Svg width={SVG_SIZE} height={SVG_SIZE} style={styles.svgContainer}>
              {/* Background circle */}
              <Circle
                cx={SVG_SIZE / 2}
                cy={SVG_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke={COLORS.progressTrack}
                strokeWidth={12}
                fill="none"
              />
              
              {/* Progress circle with smooth 360° animation */}
              <AnimatedCircle
                cx={SVG_SIZE / 2}
                cy={SVG_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke={COLORS.progressFill}
                strokeWidth={12}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${SVG_SIZE / 2} ${SVG_SIZE / 2})`}
              />
            </Svg>
            
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
    width: SVG_SIZE,
    height: SVG_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 28, // Larger text for bigger circle
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