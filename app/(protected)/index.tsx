import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../../src/context/AuthContext';
import { Protected } from '../../src/components/Protected';
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '@/constants/theme';

const { width } = Dimensions.get('window');

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

  // Animation values
  const pulseAnimation = useSharedValue(0);
  const backgroundRotation = useSharedValue(0);

  useEffect(() => {
    // Start pulsing animation for aura
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );

    // Start background rotation
    backgroundRotation.value = withRepeat(
      withTiming(360, { duration: 60000 }),
      -1,
      false
    );
  }, []);

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
    
    Alert.alert(
      'Feeling Tempted?',
      'Remember your goals! You\'ve come so far. Take a deep breath and stay strong.',
      [
        {
          text: 'Keep Going!',
          style: 'default',
        },
        {
          text: 'I Gave In',
          style: 'destructive',
          onPress: handleResetTimer,
        },
      ]
    );
  };

  // Animated styles
  const auraAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.05]);
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.8, 1]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${backgroundRotation.value}deg` }],
    };
  });

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <Protected>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Animated Background */}
        <View style={styles.backgroundContainer}>
          <AppBackground />
          <Animated.View style={[styles.rotatingBackground, backgroundAnimatedStyle]}>
            <View style={[styles.floatingOrb, styles.orb1]} />
            <View style={[styles.floatingOrb, styles.orb2]} />
            <View style={[styles.floatingOrb, styles.orb3]} />
          </Animated.View>
        </View>

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <View style={styles.logo}>
            <Image 
              source={require('../../assets/unloop-logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={28} color="#FF6B35" style={styles.flameIcon} />
              <TitleText style={styles.streakNumber}>{streak}</TitleText>
            </View>
            <HapticButton style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={28} color={COLORS.mainText} />
            </HapticButton>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Aura Element */}
          <Animated.View style={[styles.auraContainer, auraAnimatedStyle]}>
            <View style={styles.auraOuter}>
              <View style={styles.auraMiddle}>
                <View style={styles.auraInner} />
              </View>
            </View>
          </Animated.View>

          {/* Timer */}
          <View style={styles.timerSection}>
            <DescriptionText style={styles.timerLabel}>Procrastination-free for</DescriptionText>
            <View style={styles.timerDisplay}>
              <View style={styles.timeUnit}>
                <TitleText style={styles.timeNumber}>{formatNumber(time.days)}</TitleText>
                <DescriptionText style={styles.timeLabel}>days</DescriptionText>
              </View>
              <TitleText style={styles.timeSeparator}>:</TitleText>
              <View style={styles.timeUnit}>
                <TitleText style={styles.timeNumber}>{formatNumber(time.hours)}</TitleText>
                <DescriptionText style={styles.timeLabel}>hours</DescriptionText>
              </View>
              <TitleText style={styles.timeSeparator}>:</TitleText>
              <View style={styles.timeUnit}>
                <TitleText style={styles.timeNumber}>{formatNumber(time.seconds)}</TitleText>
                <DescriptionText style={styles.timeLabel}>secs</DescriptionText>
              </View>
            </View>
          </View>

          {/* Main Button */}
          <View style={styles.buttonSection}>
            <HapticButton style={styles.temptedButton} onPress={handleTempted}>
              <TitleText style={styles.temptedButtonText}>I Feel Tempted</TitleText>
            </HapticButton>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <HapticButton style={styles.actionButton} onPress={handleResetTimer}>
                <Ionicons name="refresh" size={24} color={COLORS.secondaryBackground} />
              </HapticButton>
              <HapticButton style={styles.actionButton}>
                <Ionicons name="create-outline" size={24} color={COLORS.secondaryBackground} />
              </HapticButton>
            </View>
          </View>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <TitleText style={styles.progressTitle}>Brain Rewiring</TitleText>
              <TitleText style={styles.progressPercentage}>70%</TitleText>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '70%' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, { paddingBottom: insets.bottom + SPACING.sm }]}>
          <View style={styles.navContainer}>
            <HapticButton style={[styles.navItem, styles.navItemActive]}>
              <Ionicons name="home" size={24} color={COLORS.primaryAction} />
              <DescriptionText style={[styles.navLabel, styles.navLabelActive]}>Home</DescriptionText>
            </HapticButton>
            
            <HapticButton style={styles.navItem}>
              <Ionicons name="bar-chart-outline" size={24} color="#9CA3AF" />
              <DescriptionText style={styles.navLabel}>Statistics</DescriptionText>
            </HapticButton>
            
            <HapticButton style={styles.navItem}>
              <Ionicons name="person-outline" size={24} color="#9CA3AF" />
              <DescriptionText style={styles.navLabel}>Profile</DescriptionText>
            </HapticButton>
          </View>
        </View>
      </View>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.defaultBg,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  rotatingBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingOrb: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.3,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: COLORS.primaryAction,
    top: '10%',
    left: '-20%',
  },
  orb2: {
    width: 250,
    height: 250,
    backgroundColor: COLORS.secondaryBackground,
    bottom: '20%',
    right: '-15%',
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: '#10B981',
    top: '60%',
    left: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    zIndex: 10,
  },
  logo: {
    flex: 1,
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flameIcon: {
    textShadowColor: 'rgba(255, 107, 53, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.mainText,
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    zIndex: 10,
  },
  auraContainer: {
    marginBottom: SPACING.xl * 2,
  },
  auraOuter: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(56, 189, 248, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  auraMiddle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(186, 230, 253, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  auraInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 2,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.secondaryBackground,
    marginBottom: SPACING.sm,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.mainText,
    lineHeight: 56,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  timeSeparator: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.mainText,
    paddingBottom: 8,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  temptedButton: {
    width: '100%',
    backgroundColor: COLORS.primaryAction,
    paddingVertical: SPACING.lg,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primaryAction,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  temptedButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.vibrantCta,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
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
    shadowRadius: 8,
    elevation: 4,
  },
  progressCard: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.md,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondaryBackground,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.mainText,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.sm,
    zIndex: 20,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 50,
    minWidth: 80,
  },
  navItemActive: {
    backgroundColor: 'transparent',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  navLabelActive: {
    color: COLORS.primaryAction,
    fontWeight: '700',
  },
});