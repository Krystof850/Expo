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
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 120;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2 - 10;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function OnboardingWaiting() {
  const [progress, setProgress] = useState<number>(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const strokeDashoffset = useRef(new Animated.Value(CIRCUMFERENCE)).current;

  // Blokování hardware back button pouze na Androidu
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') {
        return; // BackHandler funguje pouze na Androidu
      }
      
      const onBackPress = () => {
        return true; // Blokuje hardware back - uživatel nemůže jít zpět během loading
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  useEffect(() => {
    // Animace progress baru a procentuální hodnoty
    const startTime = Date.now();
    const duration = 10000; // 10 sekund

    // Animace stroke-dashoffset pro circular progress
    Animated.timing(strokeDashoffset, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();

    // Animace progress pro zobrazení procent
    Animated.timing(progressAnimation, {
      toValue: 100,
      duration: duration,
      useNativeDriver: false,
    }).start();

    // Listener pro aktualizaci progress textu
    const progressListener = progressAnimation.addListener(({ value }) => {
      setProgress(Math.round(value));
    });

    // Timeout pro dokončení
    const completionTimer = setTimeout(async () => {
      try {
        // Označit onboarding jako dokončený
        await AsyncStorage.setItem('onboarding_complete', 'true');
        console.log('📝 Onboarding completed - navigating to results...');
        // Přejít na výsledky
        router.push('/(onboarding)/results');
      } catch (error) {
        console.log('Error completing onboarding:', error);
        // I při chybě pokračovat na výsledky
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
          <Text style={styles.titleText}>Vyhodnocování</Text>
          <Text style={styles.subtitleText}>Analyzujeme vaše prokrastinační vzory</Text>
        </View>
      </View>
    </View>
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