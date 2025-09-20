import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import Svg, { Circle, LinearGradient, Stop, Defs } from 'react-native-svg';
import { LazyLineChart as LineChart, LazyBarChart as BarChart } from '../../components/LazyChartComponents';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Protected } from '../../src/components/Protected';
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import { ProgressService } from '../../src/services/progressService';
import { UserProgress } from '../../src/types/achievement';
// TemptationData type for statistics display
interface TemptationData {
  userId: string;
  temptationsOvercome: number;
  temptationsByTimeOfDay: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  lastUpdated: number;
}

const { width } = Dimensions.get('window');

export default function Statistics() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  // Tab bar height calculation - modern tab bar is about 80px + safe area bottom  
  const tabBarHeight = 80 + insets.bottom;

  // Timer state synchronized with homepage
  const [startTime, setStartTime] = useState<number | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState({ days: 0, hours: 0, minutes: 0 });
  const [targetDate, setTargetDate] = useState<string>('');
  
  // Stats for the three cards
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [totalDaysActive, setTotalDaysActive] = useState<number>(0);
  
  // Temptation stats
  const [temptationData, setTemptationData] = useState<TemptationData | null>(null);

  // Load initial timer data
  useEffect(() => {
    loadTimerData();
  }, []);

  // Setup real-time Firebase listener for timer sync
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = ProgressService.subscribeToUserProgress(user.uid, (progress) => {
      if (progress) {
        console.log('📊 Statistics: Real-time update from Firebase:', progress);
        setUserProgress(progress);
        setStartTime(progress.startTime);
        
        // Update longest streak from Firebase bestStreak
        setLongestStreak(Math.floor(progress.bestStreak || 0));
        
        AsyncStorage.setItem('procrastination_start_time', progress.startTime.toString());
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [user?.uid]);

  // Calculate total days active (account creation date)
  useEffect(() => {
    if (user?.metadata?.creationTime) {
      const creationDate = new Date(user.metadata.creationTime);
      const now = new Date();
      const diffInMs = now.getTime() - creationDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      setTotalDaysActive(diffInDays);
    }
  }, [user]);

  // Load temptation statistics from the existing progress listener
  useEffect(() => {
    if (userProgress) {
      // Extract temptation data from userProgress
      const temptationStats: TemptationData = {
        userId: user?.uid || '',
        temptationsOvercome: userProgress.temptationsOvercome || 0,
        temptationsByTimeOfDay: userProgress.temptationsByTimeOfDay || {
          morning: 0,
          afternoon: 0,
          evening: 0,
          night: 0,
        },
        lastUpdated: userProgress.lastTemptationUpdate || Date.now()
      };
      setTemptationData(temptationStats);
    }
  }, [userProgress, user?.uid]);

  // Calculate progress percentage every second
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      calculateProgressPercentage(startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const loadTimerData = async () => {
    try {
      if (user?.uid) {
        // Try loading from Firebase first
        const progress = await ProgressService.getUserProgress(user.uid);
        if (progress?.startTime) {
          setUserProgress(progress);
          setStartTime(progress.startTime);
          calculateProgressPercentage(progress.startTime);
          console.log('📊 Statistics: Timer loaded from Firebase');
          return;
        }
      }

      // Fallback to AsyncStorage
      const stored = await AsyncStorage.getItem('procrastination_start_time');
      if (stored) {
        const start = parseInt(stored);
        setStartTime(start);
        calculateProgressPercentage(start);
        console.log('📊 Statistics: Timer loaded from AsyncStorage');
      }
    } catch (error) {
      console.log('📊 Statistics: Error loading timer data:', error);
    }
  };

  const calculateProgressPercentage = (start: number) => {
    const now = Date.now();
    const diff = Math.floor((now - start) / 1000); // difference in seconds
    
    // Calculate time components
    const days = Math.floor(diff / (24 * 60 * 60));
    const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);
    
    setCurrentTime({ days, hours, minutes });
    
    // Update current streak (same as current timer days)
    setCurrentStreak(days);
    
    // Calculate target date (start time + 60 days)
    const targetDateMs = start + (60 * 24 * 60 * 60 * 1000); // 60 days in milliseconds
    const targetDateObj = new Date(targetDateMs);
    const formattedDate = targetDateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    setTargetDate(formattedDate);
    
    // Calculate percentage (60 days = 100%)
    const diffInDays = (now - start) / (1000 * 60 * 60 * 24);
    const maxDays = 60;
    const percentage = Math.min((diffInDays / maxDays) * 100, 100);
    setProgressPercentage(percentage);
  };

  // Component for circular progress indicator
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const size = 160;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.circularProgressContainer}>
        <Svg width={size} height={size} style={styles.circularProgressSvg}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#10B981" stopOpacity="1" />
              <Stop offset="100%" stopColor="#2DD4BF" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#CBD5E1"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.circularProgressText}>
          <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
        </View>
      </View>
    );
  };

  return (
    <Protected>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Background Gradient */}
        <ExpoLinearGradient
          colors={['#E0F2FE', '#BFDBFE', '#A5B4FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            {/* Logo - positioned in top left */}
            <View style={styles.logoContainer}>
              <ExpoImage
                source={require('../../assets/images/unloop-logo.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
          </View>

          {/* Progress Circle Section */}
          <View style={styles.progressCircleSection}>
            <Text style={styles.progressTitle}>You will be free in: {targetDate}</Text>
            <CircularProgress percentage={progressPercentage} />
            <Text style={styles.progressSubtitle}>Procrastination-free</Text>
          </View>

          {/* Three Stats Grid */}
          <View style={styles.threeStatsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="flame" size={24} color="#0284C7" />
              </View>
              <Text style={styles.statLabel}>Current Streak</Text>
              <Text style={styles.statValue}>{currentStreak} days</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="star" size={24} color="#0284C7" />
              </View>
              <Text style={styles.statLabel}>Longest Streak</Text>
              <Text style={styles.statValue}>{longestStreak} days</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={24} color="#0284C7" />
              </View>
              <Text style={styles.statLabel}>Total Days Active</Text>
              <Text style={styles.statValue}>{totalDaysActive}</Text>
            </View>
          </View>

          {/* Temptations Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temptations</Text>
            <View style={styles.temptationOvercome}>
              <Text style={styles.temptationText}>Temptations Overcome</Text>
              <Text style={styles.temptationNumber}>{temptationData?.temptationsOvercome || 0}</Text>
            </View>
            <View>
              <Text style={styles.chartTitle}>Time of Day with Most Temptations</Text>
              <View style={styles.chartContainer}>
                {(() => {
                  // Calculate chart data and max value for dynamic Y-axis
                  const chartData = [
                    temptationData?.temptationsByTimeOfDay.morning || 0,
                    temptationData?.temptationsByTimeOfDay.afternoon || 0,
                    temptationData?.temptationsByTimeOfDay.evening || 0,
                    temptationData?.temptationsByTimeOfDay.night || 0
                  ];
                  
                  const maxValue = Math.max(...chartData);
                  const hasData = maxValue > 0;
                  
                  // Ensure minimum scale for better visualization
                  const chartMax = Math.max(maxValue, 3);
                  
                  // Calculate number of segments (aim for 3-5 segments)
                  const segments = Math.min(Math.max(Math.ceil(chartMax / 2), 2), 5);
                  
                  return (
                    <BarChart
                      data={{
                        labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
                        datasets: [{
                          data: hasData ? chartData : [1, 1, 1, 1] // Show minimal data if no temptations
                        }]
                      }}
                      width={width - 80}
                      height={160}
                      yAxisLabel=""
                      yAxisSuffix=""
                      fromZero={true}
                      segments={segments}
                      chartConfig={{
                        backgroundColor: 'transparent',
                        backgroundGradientFrom: 'rgba(255, 255, 255, 0)',
                        backgroundGradientTo: 'rgba(255, 255, 255, 0)',
                        decimalPlaces: 0,
                        color: (opacity = 1) => hasData 
                          ? `rgba(2, 132, 199, ${opacity})` 
                          : `rgba(156, 163, 175, ${opacity})`, // Gray for empty state
                        labelColor: (opacity = 1) => `rgba(8, 47, 73, ${opacity})`,
                        style: {
                          borderRadius: 16
                        },
                        barPercentage: 0.6,
                      }}
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                      }}
                    />
                  );
                })()}
              </View>
              {/* Show message when no data */}
              {temptationData && Math.max(
                temptationData.temptationsByTimeOfDay.morning,
                temptationData.temptationsByTimeOfDay.afternoon,
                temptationData.temptationsByTimeOfDay.evening,
                temptationData.temptationsByTimeOfDay.night
              ) === 0 && (
                <Text style={styles.noDataText}>
                  No temptations tracked yet. Generate your first AI task to see the data!
                </Text>
              )}
            </View>
          </View>

          {/* Orbs Section */}
          <View style={styles.section}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.sectionTitle}>Orbs</Text>
            </View>
            <View style={styles.orbsContainer}>
              {[
                { 
                  days: '1d', 
                  gradient: ['#7DD3FC', '#67E8F9'], // Basic Blue Orb
                  number: 1
                },
                { 
                  days: '3d', 
                  gradient: ['#F59E0B', '#D97706'], // Oranžová
                  number: 2
                },
                { 
                  days: '7d', 
                  gradient: ['#8B5CF6', '#7C3AED'], // Fialová
                  number: 3
                },
                { 
                  days: '14d', 
                  gradient: ['#EF4444', '#DC2626'], // Heartbeat Orb (červená)
                  number: 4
                },
                { 
                  days: '21d', 
                  gradient: ['#3B82F6', '#60A5FA'], // Lightning Orb (modrá/žlutá)
                  number: 5
                },
                { 
                  days: '30d', 
                  gradient: ['#FF4500', '#FF8C00'], // Fire Orb (oranžová)
                  number: 6
                },
                { 
                  days: '60d', 
                  gradient: ['#0077BE', '#0096C7'], // Wave Orb (cyan)
                  number: 7
                },
                { 
                  days: '100d', 
                  gradient: ['#228B22', '#32CD32'], // Nature Orb (zelená)
                  number: 8
                },
              ].map((orb, index) => (
                <View key={index} style={styles.orbItem}>
                  <ExpoLinearGradient
                    colors={orb.gradient}
                    style={styles.orbGradientContainer}
                  >
                    <Text style={styles.orbNumber}>
                      {orb.number}
                    </Text>
                  </ExpoLinearGradient>
                  <Text style={styles.orbDays}>
                    {orb.days}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Focus Score Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Focus Score - Last 7 days</Text>
            <View style={styles.comingSoonContainer}>
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text style={styles.comingSoonTitle}>Coming Soon</Text>
              <Text style={styles.comingSoonSubtitle}>
                We're working on advanced focus tracking features
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    marginBottom: 24,
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    left: -8,
    top: -22,
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 37,
  },
  settingsButton: {
    padding: 6,
    position: 'relative',
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
  
  // Progress Circle Section
  progressCircleSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0C4A6E',
    marginTop: 4,
    textAlign: 'center',
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressSvg: {
    transform: [{ rotate: '0deg' }],
  },
  circularProgressText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#082F49',
  },
  
  // Three Stats Grid
  threeStatsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0C4A6E',
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#082F49',
    textAlign: 'center',
  },
  
  // Section Styles
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 16,
  },
  
  // Temptations Section
  temptationOvercome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  temptationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#082F49',
  },
  temptationNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0C4A6E',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartContainer: {
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  comingSoonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Orbs Section
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementsCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#082F49',
  },
  orbsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  orbItem: {
    alignItems: 'center',
    width: '22%',
    marginBottom: 12,
  },
  orbGradientContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  orbNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  orbDays: {
    fontSize: 11,
    fontWeight: '700',
    color: '#082F49',
    textAlign: 'center',
  },
});