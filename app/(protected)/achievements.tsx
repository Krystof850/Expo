import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import AnimatedAuraOrb from '../../components/AnimatedAuraOrb';
import { Protected } from '../../src/components/Protected';

const { width } = Dimensions.get('window');

// Achievement data structure
interface Achievement {
  id: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  target?: string;
}

const achievementsList: Achievement[] = [
  {
    id: 1,
    title: "First Steps",
    description: "Start your procrastination-free journey",
    isUnlocked: true,
  },
  {
    id: 2,
    title: "One Day Strong",
    description: "Stay focused for 24 hours",
    isUnlocked: false,
    target: "1 day",
  },
  {
    id: 3,
    title: "Week Warrior", 
    description: "Maintain focus for a full week",
    isUnlocked: false,
    target: "7 days",
  },
  {
    id: 4,
    title: "Monthly Master",
    description: "Complete 30 days without procrastination",
    isUnlocked: false,
    target: "30 days",
  },
  {
    id: 5,
    title: "Quarter Champion",
    description: "Achieve 90 days of consistent focus",
    isUnlocked: false,
    target: "90 days",
  },
  {
    id: 6,
    title: "Half-Year Hero",
    description: "Reach 180 days of productivity",
    isUnlocked: false,
    target: "180 days",
  },
  {
    id: 7,
    title: "Year Legend",
    description: "Complete a full year transformation",
    isUnlocked: false,
    target: "365 days",
  },
];

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleAchievementPress = async (achievement: Achievement) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Show achievement details or unlock animation
  };

  return (
    <Protected>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Background Gradient */}
        <LinearGradient
          colors={['#DBEAFE', '#BFDBFE']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#0C4A6E" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Achievements</Text>
          
          <View style={styles.headerRight} />
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Your Journey</Text>
            <Text style={styles.subtitle}>Unlock amazing orbs as you progress</Text>
          </View>

          {/* Achievements Grid - True Grid Layout */}
          <View style={styles.achievementsGrid}>
            {achievementsList.map((achievement, index) => (
              <TouchableOpacity
                key={achievement.id}
                style={styles.achievementGridItem}
                onPress={() => handleAchievementPress(achievement)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`${achievement.title}: ${achievement.description}${achievement.isUnlocked ? ' - Unlocked' : ' - Locked'}`}
              >
                {/* Orb Container */}
                <View style={styles.gridOrbContainer}>
                  <AnimatedAuraOrb size={80} />
                  
                  {/* Lock Overlay for locked achievements */}
                  {!achievement.isUnlocked && (
                    <View style={styles.gridLockOverlay}>
                      <View style={styles.gridLockIconContainer}>
                        <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
                      </View>
                    </View>
                  )}
                </View>

                {/* Achievement Info */}
                <View style={styles.gridAchievementInfo}>
                  <Text style={[
                    styles.gridAchievementTitle,
                    !achievement.isUnlocked && styles.lockedText
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.gridAchievementDescription,
                    !achievement.isUnlocked && styles.lockedText
                  ]}>
                    {achievement.description}
                  </Text>
                  {achievement.target && !achievement.isUnlocked && (
                    <View style={styles.gridTargetContainer}>
                      <Text style={styles.gridTargetText}>{achievement.target}</Text>
                    </View>
                  )}
                  {achievement.isUnlocked && (
                    <View style={styles.gridUnlockedBadge}>
                      <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0C4A6E',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#082F49',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  achievementGridItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    width: '47%', // Two columns with gap
    alignItems: 'center',
    minHeight: 200,
  },
  gridOrbContainer: {
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLockIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 6,
  },
  gridAchievementInfo: {
    alignItems: 'center',
    flex: 1,
  },
  gridAchievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#082F49',
    marginBottom: 4,
    textAlign: 'center',
  },
  gridAchievementDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedText: {
    opacity: 0.6,
  },
  gridTargetContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  gridTargetText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
  },
  gridUnlockedBadge: {
    marginTop: 4,
    alignItems: 'center',
  },
  // Legacy styles for backwards compatibility (to be removed)
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orbContainer: {
    position: 'relative',
    marginRight: 20,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#082F49',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 8,
  },
  targetContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  targetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  bottomSpacing: {
    height: 100,
  },
});