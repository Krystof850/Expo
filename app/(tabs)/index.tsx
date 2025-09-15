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

import { useAuth } from '../../src/context/AuthContext';
import { Protected } from '../../src/components/Protected';

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

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <Protected>
      <LinearGradient
        colors={['#87CEEB', '#5DADE2', '#3498DB']}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.logoText}>Unloop AI</Text>
          
          <View style={styles.headerRight}>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={24} color="#FF6B35" />
              <Text style={styles.streakNumber}>{streak}</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Aura Element */}
          <View style={styles.auraContainer}>
            <View style={styles.auraOuter}>
              <View style={styles.auraInner} />
            </View>
          </View>

          {/* Timer */}
          <View style={styles.timerSection}>
            <Text style={styles.timerLabel}>Procrastination-free for</Text>
            <View style={styles.timerDisplay}>
              <View style={styles.timeUnit}>
                <Text style={styles.timeNumber}>{formatNumber(time.days)}</Text>
                <Text style={styles.timeLabel}>days</Text>
              </View>
              <Text style={styles.timeDot}>•</Text>
              <View style={styles.timeUnit}>
                <Text style={styles.timeNumber}>{formatNumber(time.hours)}</Text>
                <Text style={styles.timeLabel}>hours</Text>
              </View>
              <Text style={styles.timeDot}>•</Text>
              <View style={styles.timeUnit}>
                <Text style={styles.timeNumber}>{formatNumber(time.seconds)}</Text>
                <Text style={styles.timeLabel}>secs</Text>
              </View>
            </View>
          </View>

          {/* Main Button */}
          <TouchableOpacity style={styles.temptedButton} onPress={handleTempted}>
            <Text style={styles.temptedButtonText}>I Feel Tempted</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleResetTimer}>
              <Ionicons name="refresh" size={20} color="#2C3E50" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="create-outline" size={20} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Brain Rewiring</Text>
              <Text style={styles.progressPercentage}>70%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '70%' }]} />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  settingsButton: {
    padding: 4,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 120, // Account for tab bar
  },
  auraContainer: {
    marginBottom: 40,
    marginTop: 20,
  },
  auraOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  auraInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 12,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 52,
    fontWeight: '800',
    color: '#2C3E50',
    lineHeight: 60,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A6C7D',
    marginTop: -8,
  },
  timeDot: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 12,
  },
  temptedButton: {
    width: width - 48,
    backgroundColor: '#2980B9',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: 'rgba(41, 128, 185, 0.4)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  temptedButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressCard: {
    width: width - 48,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    borderRadius: 24,
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
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#E8F4FD',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 6,
  },
});