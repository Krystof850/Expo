import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
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
  interpolate,
} from 'react-native-reanimated';

import { useAuth } from '../../src/context/AuthContext';
import { Protected } from '../../src/components/Protected';
import AppBackground from '../../components/AppBackground';
import { router } from 'expo-router';

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

  // Animation values for aura orb
  const auraPulse = useSharedValue(0);
  const auraRotation = useSharedValue(0);
  const auraFlow = useSharedValue(0);
  const auraGlow = useSharedValue(0);

  useEffect(() => {
    // Multiple animation layers for energy movement
    auraPulse.value = withRepeat(
      withTiming(1, { duration: 2500 }),
      -1,
      true
    );
    
    auraRotation.value = withRepeat(
      withTiming(360, { duration: 15000 }),
      -1,
      false
    );
    
    auraFlow.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
    
    auraGlow.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
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

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  // Animated styles for aura orb layers
  const auraOuterStyle = useAnimatedStyle(() => {
    const scale = interpolate(auraPulse.value, [0, 1], [1, 1.08]);
    const opacity = interpolate(auraGlow.value, [0, 1], [0.6, 0.9]);
    const rotate = `${auraRotation.value}deg`;
    return {
      transform: [{ scale }, { rotate }],
      opacity,
    };
  });
  
  const auraMiddleStyle = useAnimatedStyle(() => {
    const scale = interpolate(auraPulse.value, [0, 1], [1, 1.05]);
    const opacity = interpolate(auraFlow.value, [0, 1], [0.7, 1]);
    const rotate = `${-auraRotation.value * 0.7}deg`;
    return {
      transform: [{ scale }, { rotate }],
      opacity,
    };
  });
  
  const auraInnerStyle = useAnimatedStyle(() => {
    const scale = interpolate(auraPulse.value, [0, 1], [1, 1.03]);
    const opacity = interpolate(auraFlow.value, [0, 1], [0.8, 1]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });
  
  const auraCoreStyle = useAnimatedStyle(() => {
    const scale = interpolate(auraPulse.value, [0, 1], [1, 1.02]);
    const opacity = interpolate(auraGlow.value, [0, 1], [0.9, 1]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Protected>
      <AppBackground>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        {/* HEADER - Proper Safe Area */}
        <View style={styles.header}>
          {/* LEFT: LOGO */}
          <Image 
            source={require('../../assets/images/unloop-logo-black.png')} 
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="Unloop AI"
          />
          
          {/* RIGHT: STREAKS + SETTINGS */}
          <View style={styles.headerRight}>
            {/* Streaks with flame icon + number */}
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={22} color="#F97316" style={{ marginRight: 6 }} />
              <Text style={styles.streakNumber}>{streak}</Text>
            </View>
            
            {/* Settings button */}
            <TouchableOpacity 
              style={styles.settingsButton}
              hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
              accessibilityLabel="Settings"
            >
              <Ionicons name="settings-outline" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Aura Orb Element */}
            <View style={styles.auraContainer}>
              {/* Outer Glow Layer */}
              <Animated.View style={[styles.auraOuter, auraOuterStyle]}>
                <LinearGradient
                  colors={['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD']}
                  style={styles.auraOuterGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>
              
              {/* Middle Energy Layer */}
              <Animated.View style={[styles.auraMiddle, auraMiddleStyle]}>
                <LinearGradient
                  colors={['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE']}
                  style={styles.auraMiddleGradient}
                  start={{ x: 0.2, y: 0.2 }}
                  end={{ x: 0.8, y: 0.8 }}
                />
              </Animated.View>
              
              {/* Inner Bright Layer */}
              <Animated.View style={[styles.auraInner, auraInnerStyle]}>
                <LinearGradient
                  colors={['#60A5FA', '#93C5FD', '#DBEAFE', '#F0F9FF']}
                  style={styles.auraInnerGradient}
                  start={{ x: 0.3, y: 0.3 }}
                  end={{ x: 0.7, y: 0.7 }}
                />
              </Animated.View>
              
              {/* Core Light */}
              <Animated.View style={[styles.auraCore, auraCoreStyle]}>
                <LinearGradient
                  colors={['#DBEAFE', '#F0F9FF', '#FFFFFF', '#F0F9FF']}
                  style={styles.auraCoreGradient}
                  start={{ x: 0.4, y: 0.4 }}
                  end={{ x: 0.6, y: 0.6 }}
                />
              </Animated.View>
            </View>

            {/* Timer */}
            <View style={styles.timerSection}>
              <Text style={styles.timerLabel}>Procrastination-free for</Text>
              <View style={styles.timerDisplay}>
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
                  <Text style={styles.timeNumber}>{formatNumber(time.seconds)}</Text>
                  <Text style={styles.timeLabel}>secs</Text>
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
      </AppBackground>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  logoImage: {
    width: 120,
    height: 28,
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
  streakNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#082F49',
  },
  settingsButton: {
    width: 22,
    height: 22,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 140, // Account for tab bar
  },
  auraContainer: {
    position: 'relative',
    width: 220,
    height: 220,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auraOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  auraOuterGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 110,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 50,
    elevation: 12,
  },
  auraMiddle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: 20,
    left: 20,
  },
  auraMiddleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 8,
  },
  auraInner: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: 40,
    left: 40,
  },
  auraInnerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    shadowColor: '#93C5FD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  auraCore: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 60,
    left: 60,
  },
  auraCoreGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    shadowColor: '#DBEAFE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 4,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0C4A6E',
    marginBottom: 8,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#082F49',
    lineHeight: 52,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: -8,
  },
  timeSeparator: {
    fontSize: 40,
    fontWeight: '700',
    color: '#082F49',
    marginBottom: 12,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    marginBottom: 24,
  },
  temptedButton: {
    width: '100%',
    borderRadius: 50,
    shadowColor: '#0284C7',
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
    marginTop: 24,
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