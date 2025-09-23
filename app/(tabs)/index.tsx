import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
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
import { withDebugEntry } from '../../src/debug/registerDebugEntry';
import DynamicOrb from '../../src/components/DynamicOrb';
import { ProgressService } from '../../src/services/progressService';
import { getCurrentOrbLevel, convertTimeToDays, getOrbLevelById } from '../../src/utils/orbLogic';
import { UserProgress } from '../../src/types/achievement';

const { width, height } = Dimensions.get('window');

interface TimeState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function Homepage() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [time, setTime] = useState<TimeState>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [currentOrbType, setCurrentOrbType] = useState<'basic' | 'aura' | 'galaxy' | 'heartbeat' | 'lightning' | 'fire' | 'wave' | 'nature'>('basic');
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [goalDays, setGoalDays] = useState<number>(30); // Default 30 days goal
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const [goalInput, setGoalInput] = useState<string>('30');

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

  // Load saved timer data and user progress
  useEffect(() => {
    loadTimerData();
    loadGoalData();
  }, []);

  // Setup real-time Firebase listener for bidirectional sync
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = ProgressService.subscribeToUserProgress(user.uid, (progress) => {
      if (progress) {
        console.log('🔄 Real-time update from Firebase:', progress);
        setUserProgress(progress);
        
        // Apply Firebase changes to timer immediately (avoid stale closure)
        setStartTime(currentStartTime => {
          if (progress.startTime !== currentStartTime) {
            calculateTime(progress.startTime);
            AsyncStorage.setItem('procrastination_start_time', progress.startTime.toString());
            console.log('🔄 StartTime updated from real-time sync');
            return progress.startTime;
          }
          return currentStartTime;
        });
        
        setStreak(currentStreak => {
          const newStreak = Math.floor(progress.currentStreak);
          if (newStreak !== currentStreak) {
            AsyncStorage.setItem('procrastination_streak', progress.currentStreak.toString());
            console.log('🔄 Streak updated from real-time sync');
            return newStreak;
          }
          return currentStreak;
        });
        
        // Sync goalDays from Firebase real-time updates
        setGoalDays(currentGoal => {
          const firebaseGoal = progress.goalDays ?? 30;
          if (firebaseGoal !== currentGoal) {
            setGoalInput(firebaseGoal.toString());
            AsyncStorage.setItem('procrastination_goal_days', firebaseGoal.toString());
            console.log('🔄 Goal updated from real-time sync:', firebaseGoal);
            return firebaseGoal;
          }
          return currentGoal;
        });
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [user?.uid]);

  // Update orb when time changes - always use timer-based calculation for consistency
  useEffect(() => {
    // Always calculate orb level from current time for real-time progression
    const totalDays = convertTimeToDays(time);
    const orbLevel = getCurrentOrbLevel(totalDays);
    setCurrentOrbType(orbLevel.orbType);
  }, [time]);

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
      if (!user?.uid) {
        // If no user, use local storage fallback
        await loadTimerDataFallback();
        return;
      }

      // For authenticated users, Firebase is the authoritative source
      try {
        const progress = await ProgressService.getOrCreateUserProgress(user.uid);
        setUserProgress(progress);
        
        // Apply Firebase data to timer (this ensures persistence across sessions)
        if (progress.startTime && progress.currentStreak >= 0) {
          setStartTime(progress.startTime);
          setStreak(Math.floor(progress.currentStreak));
          calculateTime(progress.startTime);
          
          // Sync goal from Firebase to UI state
          const firebaseGoal = progress.goalDays ?? 30;
          setGoalDays(firebaseGoal);
          setGoalInput(firebaseGoal.toString());
          
          // Also update local storage as backup
          await AsyncStorage.setItem('procrastination_start_time', progress.startTime.toString());
          await AsyncStorage.setItem('procrastination_streak', progress.currentStreak.toString());
          await AsyncStorage.setItem('procrastination_goal_days', firebaseGoal.toString());
          
          console.log('✅ Timer loaded from Firebase:', {
            startTime: new Date(progress.startTime).toISOString(),
            currentStreak: progress.currentStreak,
            goalDays: firebaseGoal
          });
        }
      } catch (firebaseError) {
        console.log('⚠️ Firebase sync failed, using local storage:', firebaseError);
        await loadTimerDataFallback();
      }
    } catch (error) {
      console.log('Error loading timer data:', error);
      await loadTimerDataFallback();
    }
  };

  const loadGoalData = async () => {
    try {
      const savedGoal = await AsyncStorage.getItem('procrastination_goal_days');
      if (savedGoal) {
        const goalDaysNumber = parseInt(savedGoal);
        setGoalDays(goalDaysNumber);
        setGoalInput(savedGoal);
      }
    } catch (error) {
      console.log('Error loading goal data:', error);
    }
  };

  const saveGoalData = async (days: number) => {
    try {
      await AsyncStorage.setItem('procrastination_goal_days', days.toString());
      
      // Also save to Firebase if user is authenticated
      if (user?.uid) {
        try {
          // Ensure user progress exists then update goal
          await ProgressService.getOrCreateUserProgress(user.uid);
          await ProgressService.updateUserGoal(user.uid, days);
          console.log('✅ Goal saved to Firebase:', days);
        } catch (firebaseError) {
          console.log('⚠️ Failed to save goal to Firebase:', firebaseError);
        }
      }
    } catch (error) {
      console.log('Error saving goal data:', error);
    }
  };

  const loadTimerDataFallback = async () => {
    try {
      const savedStartTime = await AsyncStorage.getItem('procrastination_start_time');
      const savedStreak = await AsyncStorage.getItem('procrastination_streak');
      
      if (savedStartTime) {
        const start = parseInt(savedStartTime);
        setStartTime(start);
        setStreak(savedStreak ? parseInt(savedStreak) : 0);
        calculateTime(start);
      } else {
        const now = Date.now();
        setStartTime(now);
        setStreak(1);
        await AsyncStorage.setItem('procrastination_start_time', now.toString());
        await AsyncStorage.setItem('procrastination_streak', '1');
      }
    } catch (error) {
      console.log('Error with fallback timer data:', error);
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

  const updateTimer = async () => {
    if (startTime) {
      // Calculate time locally to use for both state and Firebase check
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000);
      
      const computedTime = {
        days: Math.floor(diff / (24 * 60 * 60)),
        hours: Math.floor((diff % (24 * 60 * 60)) / (60 * 60)),
        minutes: Math.floor((diff % (60 * 60)) / 60),
        seconds: diff % 60
      };
      
      setTime(computedTime);
      
      // Try Firebase update every minute (non-blocking)
      if (user?.uid && computedTime.seconds === 0) {
        // Don't await - do it in background
        ProgressService.updateUserProgress(user.uid, computedTime, startTime)
          .then(() => console.log('✅ Progress synced to Firebase'))
          .catch(error => console.log('⚠️ Firebase sync failed (continuing with local):', error));
      }
    }
  };


  const handleResetTimer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Reset Timer',
      'Are you sure you want to reset your procrastination-free timer? This will reset your current orb back to Starting Journey.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            // Always reset locally first for immediate response
            await resetTimerFallback();
            
            // Try Firebase reset in background
            if (user?.uid) {
              ProgressService.resetUserTimer(user.uid)
                .then(() => console.log('✅ Timer reset synced to Firebase'))
                .catch(error => console.log('⚠️ Firebase reset failed (local reset done):', error));
            }
          },
        },
      ]
    );
  };

  const resetTimerFallback = async () => {
    const now = Date.now();
    setStartTime(now);
    setStreak(0); // Reset to 0 to align with Firebase resetUserTimer logic
    await AsyncStorage.setItem('procrastination_start_time', now.toString());
    await AsyncStorage.setItem('procrastination_streak', '0');
    setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setCurrentOrbType('basic');
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

  const handleGoalEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGoalInput(goalDays.toString());
    setIsGoalModalVisible(true);
  };

  const handleGoalSave = async () => {
    const newGoal = parseInt(goalInput);
    if (isNaN(newGoal) || newGoal <= 0) {
      Alert.alert('Invalid Goal', 'Please enter a valid number of days (greater than 0).');
      return;
    }
    
    setGoalDays(newGoal);
    await saveGoalData(newGoal);
    setIsGoalModalVisible(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGoalCancel = async () => {
    setGoalInput(goalDays.toString()); // Reset to current goal
    setIsGoalModalVisible(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

        {/* Header with Logo and Settings */}
        <View style={styles.header}>
          {/* Logo - positioned absolutely in top left */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/unloop-logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          
          {/* Streak button - maintains original position */}
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="flame" size={22} color="#EF4444" />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{time.days}</Text>
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
                <DynamicOrb orbType={currentOrbType} size={192} />
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
                onPress={handleGoalEdit}
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
                <Text style={styles.progressPercentage}>{Math.round(((userProgress?.currentStreak || convertTimeToDays(time)) / goalDays) * 100)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <LinearGradient
                    colors={['#34D399', '#10B981']}
                    style={[styles.progressBarFill, { width: `${Math.min(((userProgress?.currentStreak || convertTimeToDays(time)) / goalDays) * 100, 100)}%` }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* Goal Setting Modal */}
      <Modal
        visible={isGoalModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleGoalCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Your Goal</Text>
            <Text style={styles.modalSubtitle}>How many days do you want to stay procrastination-free?</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.goalInput}
                value={goalInput}
                onChangeText={setGoalInput}
                keyboardType="numeric"
                placeholder="Enter days"
                placeholderTextColor="#9CA3AF"
                autoFocus={true}
                selectTextOnFocus={true}
              />
              <Text style={styles.inputLabel}>days</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={handleGoalCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={handleGoalSave}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#0EA5E9', '#0284C7']}
                  style={styles.modalSaveGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.modalSaveText}>Save Goal</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    left: 16,
    top: 2,
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 37,
  },
  settingsButton: {
    padding: 6,
    marginRight: 10,
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
    marginTop: 20,
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
    height: '100%',
    borderRadius: 4,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#082F49',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  goalInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#082F49',
    borderBottomWidth: 2,
    borderBottomColor: '#0EA5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
    minWidth: 80,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSaveGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
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

// Export s debug wrapper - v dev módu přidá tajný long-press gesture
export default withDebugEntry(Homepage);