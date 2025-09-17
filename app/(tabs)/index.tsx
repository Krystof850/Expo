import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import { useAuth } from '../../src/context/AuthContext';
import { Protected } from '../../src/components/Protected';
import { router } from 'expo-router';
import AnimatedAuraOrb from '../../components/AnimatedAuraOrb';

const { width, height } = Dimensions.get('window');

// Design system colors from template
const COLORS = {
  primaryAction: '#0284C7',
  secondaryBackground: '#0C4A6E', 
  mainText: '#082F49',
  ctaText: '#FFFFFF',
  accentGreen: '#10B981',
  defaultBg: '#F0F9FF',
  vibrantCta: '#FFFFFF',
  vibrantCtaText: '#0B1120',
};

interface TimeState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Homepage() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [time, setTime] = useState<TimeState>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  // Animation shared values for timer
  const secondsScale = useSharedValue(1);
  const secondsOpacity = useSharedValue(1);
  const secondsTranslateY = useSharedValue(0);
  const tickAnimation = useSharedValue(1);

  // Floating background animations
  const float1TranslateX = useSharedValue(0);
  const float1TranslateY = useSharedValue(0);
  const float1Rotate = useSharedValue(0);
  const float1Scale = useSharedValue(1);

  const float2TranslateX = useSharedValue(0);
  const float2TranslateY = useSharedValue(0);
  const float2Rotate = useSharedValue(0);
  const float2Scale = useSharedValue(1);

  const float3TranslateY = useSharedValue(0);
  const float3Rotate = useSharedValue(0);

  const float4TranslateY = useSharedValue(0);
  const float4Rotate = useSharedValue(0);

  // Start floating animations
  useEffect(() => {
    // Float 1 animation (9s cycle)
    float1TranslateX.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 4500 }),
        withTiming(0, { duration: 4500 })
      ), -1, false
    );
    float1TranslateY.value = withRepeat(
      withSequence(
        withTiming(-50, { duration: 4500 }),
        withTiming(0, { duration: 4500 })
      ), -1, false
    );
    float1Rotate.value = withRepeat(
      withSequence(
        withTiming(35, { duration: 4500 }),
        withTiming(0, { duration: 4500 })
      ), -1, false
    );
    float1Scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 4500 }),
        withTiming(1, { duration: 4500 })
      ), -1, false
    );

    // Float 2 animation (11s cycle)
    float2TranslateX.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 5500 }),
        withTiming(0, { duration: 5500 })
      ), -1, false
    );
    float2TranslateY.value = withRepeat(
      withSequence(
        withTiming(-70, { duration: 5500 }),
        withTiming(0, { duration: 5500 })
      ), -1, false
    );
    float2Rotate.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 5500 }),
        withTiming(0, { duration: 5500 })
      ), -1, false
    );
    float2Scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 5500 }),
        withTiming(1, { duration: 5500 })
      ), -1, false
    );

    // Float 3 animation (13s cycle)
    float3TranslateY.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 6500 }),
        withTiming(0, { duration: 6500 })
      ), -1, false
    );
    float3Rotate.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 6500 }),
        withTiming(0, { duration: 6500 })
      ), -1, false
    );

    // Float 4 animation (10s cycle) 
    float4TranslateY.value = withRepeat(
      withSequence(
        withTiming(-35, { duration: 5000 }),
        withTiming(0, { duration: 5000 })
      ), -1, false
    );
    float4Rotate.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 5000 }),
        withTiming(0, { duration: 5000 })
      ), -1, false
    );
  }, []);

  // Animated styles for timer components
  const secondsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: secondsScale.value },
        { translateY: secondsTranslateY.value }
      ],
      opacity: secondsOpacity.value,
    };
  });

  const tickAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: tickAnimation.value }],
    };
  });

  // Floating element animated styles
  const float1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: float1TranslateX.value },
        { translateY: float1TranslateY.value },
        { rotate: `${float1Rotate.value}deg` },
        { scale: float1Scale.value },
      ],
    };
  });

  const float2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: float2TranslateX.value },
        { translateY: float2TranslateY.value },
        { rotate: `${float2Rotate.value}deg` },
        { scale: float2Scale.value },
      ],
    };
  });

  const float3AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: float3TranslateY.value },
        { rotate: `${float3Rotate.value}deg` },
      ],
    };
  });

  const float4AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: float4TranslateY.value },
        { rotate: `${float4Rotate.value}deg` },
      ],
    };
  });


  // Load saved timer data
  useEffect(() => {
    loadTimerData();
  }, []);

  // Update timer every second
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const loadTimerData = async () => {
    try {
      const savedStartTime = await AsyncStorage.getItem('procrastination_start_time');
      const savedStreak = await AsyncStorage.getItem('procrastination_streak');
      
      if (savedStartTime) {
        const start = parseInt(savedStartTime);
        setStartTime(start);
        setStreak(savedStreak ? parseInt(savedStreak) : 0);
        calculateTime(start);
      } else {
        // First time - start timer
        const now = Date.now();
        setStartTime(now);
        setStreak(1);
        await AsyncStorage.setItem('procrastination_start_time', now.toString());
        await AsyncStorage.setItem('procrastination_streak', '1');
      }
    } catch (error) {
      console.log('Error loading timer data:', error);
    }
  };

  const calculateTime = (start: number) => {
    const now = Date.now();
    const diff = Math.floor((now - start) / 1000); // difference in seconds
    
    const days = Math.floor(diff / (24 * 60 * 60));
    const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);
    const seconds = diff % 60;

    setTime({ days, hours, minutes, seconds });
  };

  const updateTimer = () => {
    if (startTime) {
      calculateTime(startTime);
      
      // Cool but decent tick animation
      tickAnimation.value = withSequence(
        withSpring(1.08, { damping: 15, stiffness: 400 }),
        withSpring(1, { damping: 15, stiffness: 400 })
      );
      
      // Score counter effect for seconds
      secondsScale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 200 })
      );
      secondsOpacity.value = withSequence(
        withTiming(0.7, { duration: 50 }),
        withTiming(1, { duration: 150 })
      );
      secondsTranslateY.value = withSequence(
        withTiming(-3, { duration: 100 }),
        withTiming(0, { duration: 200 })
      );
    }
  };

  const handleResetTimer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Reset Timer',
      'Are you sure you want to reset your procrastination-free timer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const now = Date.now();
            const nextStreak = streak + 1;
            setStartTime(now);
            setStreak(nextStreak);
            await AsyncStorage.setItem('procrastination_start_time', now.toString());
            await AsyncStorage.setItem('procrastination_streak', nextStreak.toString());
            setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          },
        },
      ]
    );
  };

  const handleTempted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Start the procrastination workflow
    router.push('/(workflow)/procrastination-input');
  };

  const handleOrbPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navigate to achievements screen
    router.push('/(protected)/achievements');
  };

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  // Animation styles removed - handled by AnimatedAuraOrb component

  return (
    <Protected>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Animated Gradient Background */}
        <LinearGradient
          colors={['#E0F2FE', '#BFDBFE', '#93C5FD', '#BFDBFE', '#E0F2FE']}
          style={styles.animatedBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Floating Background Elements */}
        <View style={styles.floatingContainer}>
          {/* Float 1 - Large Sky Blue */}
          <Animated.View style={[styles.float1, float1AnimatedStyle]}>
            <LinearGradient
              colors={['rgba(56, 189, 248, 0.3)', 'rgba(56, 189, 248, 0.1)']}
              style={styles.floatGradient1}
            />
          </Animated.View>

          {/* Float 2 - Large Blue */}
          <Animated.View style={[styles.float2, float2AnimatedStyle]}>
            <LinearGradient
              colors={['rgba(29, 78, 216, 0.2)', 'rgba(29, 78, 216, 0)']}
              style={styles.floatGradient2}
            />
          </Animated.View>

          {/* Float 3 - Medium Primary Action */}
          <Animated.View style={[styles.float3, float3AnimatedStyle]}>
            <View style={[styles.floatCircle3, { backgroundColor: `${COLORS.primaryAction}33` }]} />
          </Animated.View>

          {/* Float 4 - Medium Green */}
          <Animated.View style={[styles.float4, float4AnimatedStyle]}>
            <View style={[styles.floatCircle4, { backgroundColor: `${COLORS.accentGreen}33` }]} />
          </Animated.View>

          {/* Extra Float 5 - Sky Gradient */}
          <Animated.View style={[styles.float5, float3AnimatedStyle]}>
            <LinearGradient
              colors={['rgba(14, 165, 233, 0.2)', 'transparent']}
              style={styles.floatGradient5}
            />
          </Animated.View>

          {/* Extra Float 6 - Blue Gradient */}
          <Animated.View style={[styles.float6, float2AnimatedStyle]}>
            <LinearGradient
              colors={['rgba(30, 64, 175, 0.2)', 'transparent']}
              style={styles.floatGradient6}
            />
          </Animated.View>
        </View>

        {/* HEADER - Template Design */}
        <View style={styles.header}>
          {/* LEFT: UNLOOP AI TEXT */}
          <Text style={styles.logoText}>Unloop AI</Text>
          
          {/* RIGHT: STREAKS + SETTINGS */}
          <View style={styles.headerRight}>
            {/* Streaks with flame icon + number */}
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={30} color="#F97316" style={styles.flameIcon} />
              <Text style={styles.streakNumber}>{streak}</Text>
            </View>
            
            {/* Settings button */}
            <TouchableOpacity 
              style={styles.settingsButton}
              hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
              accessibilityLabel="Settings"
            >
              <Ionicons name="settings-outline" size={30} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Animated Aura Orb */}
            <TouchableOpacity 
              style={styles.auraContainer}
              onPress={handleOrbPress}
              activeOpacity={0.8}
              accessibilityLabel="View achievements"
            >
              <AnimatedAuraOrb size={140} />
            </TouchableOpacity>

            {/* Timer */}
            <View style={styles.timerSection}>
              <Text style={styles.timerLabel}>Procrastination-free for</Text>
              <Animated.View style={[styles.timerDisplay, tickAnimatedStyle]}>
                <View style={styles.timerUnitsRow}>
                  <View style={styles.timeUnit}>
                    <Text style={styles.timeNumber}>{formatNumber(time.days)}</Text>
                    <Text style={styles.timeLabel}>days</Text>
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeUnit}>
                    <Text style={styles.timeNumber}>{formatNumber(time.hours)}</Text>
                    <Text style={styles.timeLabel}>hours</Text>
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeUnit}>
                    <Text style={styles.timeNumber}>{formatNumber(time.minutes)}</Text>
                    <Text style={styles.timeLabel}>mins</Text>
                  </View>
                </View>
                <Animated.View style={[styles.secondsBox, secondsAnimatedStyle]}>
                  <Text style={styles.secondsText}>{formatNumber(time.seconds)}s</Text>
                </Animated.View>
              </Animated.View>
            </View>

            {/* Main Button */}
            <View style={styles.buttonSection}>
              <LinearGradient
                colors={['#0EA5E9', '#0284C7']}
                style={styles.temptedButton}
              >
                <TouchableOpacity style={styles.temptedButtonInner} onPress={handleTempted}>
                  <Text style={styles.temptedButtonText}>I Feel Tempted</Text>
                </TouchableOpacity>
              </LinearGradient>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleResetTimer}>
                  <Ionicons name="refresh" size={28} color="#0C4A6E" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create-outline" size={28} color="#0C4A6E" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Progress Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Brain Rewiring</Text>
                <Text style={styles.progressPercentage}>70%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <LinearGradient
                    colors={['#10B981', '#14B8A6']}
                    style={[styles.progressBarFill, { width: '70%' }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.defaultBg,
  },
  animatedBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  float1: {
    position: 'absolute',
    left: -width * 0.33,
    top: -height * 0.25,
    width: 650,
    height: 650,
  },
  floatGradient1: {
    width: '100%',
    height: '100%',
    borderRadius: 325,
    opacity: 0.4,
  },
  float2: {
    position: 'absolute',
    right: -width * 0.25,
    bottom: -height * 0.45,
    width: 750,
    height: 750,
  },
  floatGradient2: {
    width: '100%',
    height: '100%',
    borderRadius: 375,
    opacity: 0.3,
  },
  float3: {
    position: 'absolute',
    bottom: height * 0.33,
    right: width * 0.25,
    width: 288,
    height: 288,
  },
  floatCircle3: {
    width: '100%',
    height: '100%',
    borderRadius: 144,
    opacity: 0.3,
  },
  float4: {
    position: 'absolute',
    left: width * 0.25,
    top: height * 0.33,
    width: 256,
    height: 256,
  },
  floatCircle4: {
    width: '100%',
    height: '100%',
    borderRadius: 128,
    opacity: 0.3,
  },
  float5: {
    position: 'absolute',
    left: -width * 0.25,
    top: height * 0.1,
    width: 550,
    height: 550,
  },
  floatGradient5: {
    width: '100%',
    height: '100%',
    borderRadius: 275,
    opacity: 0.3,
  },
  float6: {
    position: 'absolute',
    right: -width * 0.25,
    bottom: height * 0.05,
    width: 450,
    height: 450,
  },
  floatGradient6: {
    width: '100%',
    height: '100%',
    borderRadius: 225,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.mainText,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameIcon: {
    marginRight: 8,
    textShadowColor: '#F97316',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.mainText,
  },
  settingsButton: {
    width: 22,
    height: 22,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // Account for tab bar
  },
  auraContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.secondaryBackground,
    marginBottom: 16,
  },
  timerDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerUnitsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerTimeMain: {
    fontSize: 42,
    fontWeight: '800',
    color: '#082F49',
    letterSpacing: -1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timerMainLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  secondsBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(226, 232, 240, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondsText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: -0.5,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: COLORS.mainText,
    lineHeight: 64,
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.mainText,
    marginBottom: 18,
    marginHorizontal: 8,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    marginBottom: 16,
  },
  temptedButton: {
    width: '100%',
    borderRadius: 50,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
    elevation: 15,
    marginBottom: 12,
  },
  temptedButtonInner: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 50,
  },
  temptedButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  progressCard: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
    borderRadius: 32,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#082F49',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#CBD5E1',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
});