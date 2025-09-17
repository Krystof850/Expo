import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Text,
  Dimensions,
  TouchableOpacity,
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

import { useAuth } from '../../src/context/AuthContext';
import { Protected } from '../../src/components/Protected';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

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

  // Orb animation values
  const orbScale = useSharedValue(1);
  const orbOpacity = useSharedValue(1);

  // Orb pulsing animation
  const orbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: orbScale.value }],
      opacity: orbOpacity.value,
    };
  });

  // Start orb animation
  useEffect(() => {
    orbScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
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

  return (
    <Protected>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Background Gradient */}
        <LinearGradient
          colors={['#E0F2FE', '#BFDBFE', '#A5B4FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />

        {/* Header with Settings */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color="#64748B" />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Orb Section */}
          <View style={styles.orbSection}>
            <TouchableOpacity 
              onPress={handleOrbPress}
              activeOpacity={0.9}
              accessibilityLabel="View achievements"
            >
              <Animated.View style={[styles.orbContainer, orbAnimatedStyle]}>
                {/* Outer animated ring */}
                <LinearGradient
                  colors={['#7DD3FC', '#67E8F9', '#7DD3FC']}
                  style={styles.orbOuter}
                />
                {/* Middle layer */}
                <LinearGradient
                  colors={['#E0F2FE', '#BAE6FD']}
                  style={styles.orbMiddle}
                />
                {/* Inner white center */}
                <LinearGradient
                  colors={['#FFFFFF', '#F1F5F9']}
                  style={styles.orbInner}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Timer Display */}
            <View style={styles.timerSection}>
              <Text style={styles.timerLabel}>Procrastination-free for</Text>
              
              {/* Main Timer */}
              <View style={styles.timerRow}>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeNumber}>{formatNumber(time.days)}</Text>
                  <Text style={styles.timeLabel}>days</Text>
                </View>
                <Text style={styles.separator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeNumber}>{formatNumber(time.hours)}</Text>
                  <Text style={styles.timeLabel}>hours</Text>
                </View>
                <Text style={styles.separator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeNumber}>{formatNumber(time.minutes)}</Text>
                  <Text style={styles.timeLabel}>mins</Text>
                </View>
              </View>

              {/* Seconds Box */}
              <View style={styles.secondsContainer}>
                <View style={styles.secondsBox}>
                  <Text style={styles.secondsText}>{time.seconds}s</Text>
                </View>
              </View>
            </View>
          </View>

          {/* I Feel Tempted Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.temptedButton}
              onPress={handleTempted}
              activeOpacity={0.95}
            >
              <LinearGradient
                colors={['#0EA5E9', '#0284C7']}
                style={styles.temptedButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.temptedButtonText}>I Feel Tempted</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleResetTimer}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={28} color="#30475e" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={28} color="#30475e" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Card */}
          <View style={styles.progressSection}>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Brain Rewiring</Text>
                <Text style={styles.progressPercentage}>70%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <LinearGradient
                    colors={['#34D399', '#10B981']}
                    style={styles.progressBarFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  settingsButton: {
    padding: 6,
  },
  main: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  orbSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  orbContainer: {
    width: 192,
    height: 192,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  orbOuter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 96,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  orbMiddle: {
    position: 'absolute',
    width: '92%',
    height: '92%',
    borderRadius: 88,
  },
  orbInner: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 82,
  },
  timerSection: {
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0C4A6E',
    letterSpacing: 0.3,
    marginBottom: 27,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 4,
    marginTop: -24,  
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 58,
    fontWeight: '800',
    color: '#082F49',
    lineHeight: 58,
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    letterSpacing: 0.2,
    marginTop: -6,
  },
  separator: {
    fontSize: 50,
    fontWeight: '800',
    color: '#082F49',
    marginHorizontal: 8,
    marginBottom: 12,
  },
  secondsContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 38,
  },
  secondsBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.8)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  secondsText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#082F49',
    letterSpacing: -0.3,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    marginBottom: 12,
  },
  temptedButton: {
    width: '100%',
    borderRadius: 52,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
    marginBottom: 16,
  },
  temptedButtonGradient: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 52,
  },
  temptedButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(222, 230, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  progressSection: {
    width: '100%',
    maxWidth: 384,
    marginTop: 10,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 12,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C4A6E',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '700',
    color: '#082F49',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '70%',
    height: '100%',
    borderRadius: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});