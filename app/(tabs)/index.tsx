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

  // Simplified - keep minimal animations

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

  // Remove floating element animated styles




  // Removed gradient animation styles


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
        
        {/* Simple Blue Background */}
        <LinearGradient
          colors={['#93C5FD', '#60A5FA']}
          style={styles.animatedBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        


        {/* HEADER - Template Design */}
        <View style={styles.header}>
          {/* EMPTY LEFT SIDE */}
          <View />
          
          {/* RIGHT: SETTINGS ONLY */}
          <TouchableOpacity 
            style={styles.settingsButton}
            hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={22} color="#475569" />
          </TouchableOpacity>
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
              <View style={styles.timerDisplay}>
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
                <View style={styles.secondsBox}>
                  <Text style={styles.secondsText}>{formatNumber(time.seconds)}s</Text>
                </View>
              </View>
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
                  <Ionicons name="refresh" size={22} color="#0C4A6E" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create-outline" size={22} color="#0C4A6E" />
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
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // Account for tab bar
  },
  auraContainer: {
    marginBottom: 40,
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
    color: '#475569',
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.mainText,
    lineHeight: 48,
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
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
    shadowColor: COLORS.primaryAction,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
    elevation: 15,
    marginBottom: 16,
  },
  temptedButtonInner: {
    width: '100%',
    paddingVertical: 20,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
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