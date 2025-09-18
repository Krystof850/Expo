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
            stroke="#E2E8F0"
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
          contentContainerStyle={styles.content}
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
            <CircularProgress percentage={70} />
            <Text style={styles.progressInlineText}>You will be free in: 70%</Text>
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

          {/* Achievements Section */}
          <View style={styles.section}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Text style={styles.achievementsCount}>5 / 15 Unlocked</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsList}>
              {[
                { 
                  name: '1-Day Streak', 
                  unlocked: true,
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQZNl8lNg7LqO81NzRM9HeA74ZOY0ny8Jfm1STbcz5gHTOYZCe2fguZ4AI_a0gaPwgzMtn0kxvw4F4VYxRuyCA7T3q7AZhC-A-WszlRAPxnKjvRjiBLJRe_fvuT6g13RPgciKb43rDLZXrxIemam0BRnGIM9YZivVNYQKwA233k_9Rd8AVd3__rnBJh5ez--f2JFsmbmz6yDAi1ylLWZR1WBUHhLIs587_psSFG1zr8fw7TnhNsHj6eb7c_DUY58ac3v0kG5Fu53Bp'
                },
                { 
                  name: '7-Day Streak', 
                  unlocked: true,
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1HOPcitfeC2j827JlDFK3hxjAJCxYOoF4au3XtRq6Fsqh13RYBtsBpOyulYbJTpIke-NaXOHQIaX2jyjg8MHHjjpliHuva6fatfq_Ci2Oc955MUxnHwhJubQKTbe1FM8IJDFqGJeZy2nB7SGQwF1xmsVjDtRaCpa7PuXHV73jeVsx5HViE6Inrh2iwoPUezFpyWJG1GKOhP-IbdshCsgcYJLt3V-jfpdpIJSLYqn--oyiqknhNlkdifoIaPqwmKJ3Zpw5tWwaHE-a'
                },
                { 
                  name: 'First Win', 
                  unlocked: true,
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRtVWuarCg0RG0Ho_aaW4TleaYLkAyKY7oNS4nLJiMX8beZY1UcAyUo4YlbfrIM1cB6cJAGLWYQeTrfWC_BS5QLDeVMO2Tv6xJ-yB2p97OkOvj4NmK8Zq4Scg-vuuvq_10RXrUuDRMJho3GUTVvasAm2fm6TtZgtP7Qeizhprh1hTyLLjTcQXVpoC2tXdYJLoUvo6TvqZFFaMPB3PiyVDZIIYlUOQt4-7iMJot_j-rvPIg-1RVyS9R1yqV-yTgTC3yuC78Q9MJ_js3'
                },
                { 
                  name: 'Perfect Day', 
                  unlocked: true,
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt-bviLY8dTl8dr3hpklxMG6yDTa7N8o9MwYhrxBdFJreRkIlFfOlSS2wZY4CbF3_XY_sERXZp4m8C4nPU6xXlYtHFSO5FmOSKMX5y-F4AccyxtXQMBzAGM4RHVHhl1IaC6vWhUFyoX31NQLOsoRroPLcGFciQ_b3Yz8sGmnGe5DVSzfUJQSE4T3dwALjfdCiU1tsfc-oHGjfPDaFQwaiXKm8WIuH4jIkd3koCE_Oh15SX_L4Wtyz3Ac8YiMiDNaSI_5uNtiYaakfr'
                },
                { 
                  name: 'Master', 
                  unlocked: true,
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeW1spfj-O8T1gCknWMFRq86pGiENl-6ecJbjrbPmB13esAstMe7XnDr_myrDNsbnBaugveAUqVdgHx6loA2AFKNWnwsVuyRTDdjU6sNRoB8J_KWBpkA9ZGLsdcLhAmrbKnmTTBMOKIxPkLvtw_y9u3Z3KbLF3DuaVEfknRRlEnTJMP8huU5tQW3UnhqYrrmKAGeV7RMUHJUL8CiXANc14Ii0ZCIUlw87QsD1rC4SJUOkkZlqEPQ8uteP2D1xeBlRVOI5m5mdgriJw'
                },
                { 
                  name: 'Locked', 
                  unlocked: false,
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj6q4fmbveVRg2qEsQN-p0vxk-2AxYq1tM9BZYVq0gl_dtpCXUIf2ui1A6XrhqKdSWJyEYxD1alWj8dG33Syg3xFLgV-j6tqZlSL2OhXEOJdSX1ilwPS7CgObsEstI1InQHAPScIWjxvrl_zs-5_DiMljuNnf6OGnTJeD5M64EXXhBJijorHXLndVZMk6ENGVwzD3EEkQOyoOLwBiXbK1jvZ6beNzNqhrPexeLduygI-eRou6-9sGXSUh6ECukXSPoYFPSZwy4qDbL'
                },
              ].map((achievement, index) => (
                <View key={index} style={[styles.achievementItem, !achievement.unlocked && styles.achievementLocked]}>
                  <View style={styles.achievementBadge}>
                    <Image 
                      source={{ uri: achievement.image }}
                      style={styles.badgeImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.achievementName, !achievement.unlocked && styles.achievementNameLocked]}>
                    {achievement.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
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
    paddingBottom: 80,
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
  progressInlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    marginTop: 12,
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
  
  // Achievements Section
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
  achievementsList: {
    flexDirection: 'row',
  },
  achievementItem: {
    alignItems: 'center',
    marginRight: 12,
    width: 64,
  },
  achievementLocked: {
    opacity: 0.4,
  },
  achievementBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  badgeImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#082F49',
    textAlign: 'center',
  },
  achievementNameLocked: {
    color: '#94A3B8',
  },
});