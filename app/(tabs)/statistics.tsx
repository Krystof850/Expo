import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, LinearGradient, Stop, Defs } from 'react-native-svg';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

import { Protected } from '../../src/components/Protected';
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import { COLORS, SPACING } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function Statistics() {
  const insets = useSafeAreaInsets();
  
  // Tab bar height calculation - modern tab bar is about 80px + safe area bottom  
  const tabBarHeight = 80 + insets.bottom;

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
          <Text style={styles.percentageText}>{percentage}%</Text>
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={22} color="#64748B" />
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Progress Circle Section */}
          <View style={styles.progressCircleSection}>
            <Text style={styles.progressTitle}>You will be free in:</Text>
            <CircularProgress percentage={70} />
            <Text style={styles.progressSubtitle}>Procrastination-free</Text>
          </View>

          {/* Three Stats Grid */}
          <View style={styles.threeStatsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="flame" size={24} color="#0284C7" />
              </View>
              <Text style={styles.statLabel}>Current Streak</Text>
              <Text style={styles.statValue}>5 days</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="star" size={24} color="#0284C7" />
              </View>
              <Text style={styles.statLabel}>Longest Streak</Text>
              <Text style={styles.statValue}>21 days</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={24} color="#0284C7" />
              </View>
              <Text style={styles.statLabel}>Total Days Active</Text>
              <Text style={styles.statValue}>42</Text>
            </View>
          </View>

          {/* Temptations Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temptations</Text>
            <View style={styles.temptationOvercome}>
              <Text style={styles.temptationText}>Temptations Overcome</Text>
              <Text style={styles.temptationNumber}>12</Text>
            </View>
            <View>
              <Text style={styles.chartTitle}>Time of Day with Most Temptations</Text>
              <View style={styles.chartContainer}>
                <BarChart
                  data={{
                    labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
                    datasets: [{
                      data: [5, 9, 7, 3]
                    }]
                  }}
                  width={width - 80}
                  height={160}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: 'rgba(255, 255, 255, 0)',
                    backgroundGradientTo: 'rgba(255, 255, 255, 0)',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
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
              </View>
            </View>
          </View>

          {/* Orbs Section */}
          <View style={styles.section}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.sectionTitle}>Orbs</Text>
              <Text style={styles.achievementsCount}>Level 1</Text>
            </View>
            <View style={styles.orbsContainer}>
              {[
                { 
                  days: '1d', 
                  gradient: ['#EF4444', '#DC2626'], // Červená
                  number: 1
                },
                { 
                  days: '3d', 
                  gradient: ['#F59E0B', '#D97706'], // Oranžová
                  number: 2
                },
                { 
                  days: '7d', 
                  gradient: ['#FBBF24', '#F59E0B'], // Žlutá
                  number: 3
                },
                { 
                  days: '14d', 
                  gradient: ['#10B981', '#059669'], // Zelená
                  number: 4
                },
                { 
                  days: '21d', 
                  gradient: ['#0EA5E9', '#0284C7'], // Modrá
                  number: 5
                },
                { 
                  days: '30d', 
                  gradient: ['#8B5CF6', '#7C3AED'], // Fialová
                  number: 6
                },
                { 
                  days: '60d', 
                  gradient: ['#EC4899', '#DB2777'], // Růžová
                  number: 7
                },
                { 
                  days: '100d', 
                  gradient: ['#6366F1', '#4F46E5'], // Indigo
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
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [{
                    data: [65, 70, 80, 75, 85, 90, 88],
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                    strokeWidth: 3
                  }]
                }}
                width={width - 80}
                height={180}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: 'rgba(255, 255, 255, 0)',
                  backgroundGradientTo: 'rgba(255, 255, 255, 0)',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(8, 47, 73, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#10B981"
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
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
  },
  headerSpacer: {
    flex: 1,
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