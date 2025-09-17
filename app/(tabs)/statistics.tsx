import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Protected } from '../../src/components/Protected';
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import { COLORS, SPACING } from '@/constants/theme';

export default function Statistics() {
  const insets = useSafeAreaInsets();

  return (
    <Protected>
      <View style={styles.container}>
        <AppBackground />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.xl }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TitleText style={styles.title}>Statistics</TitleText>
            <DescriptionText style={styles.subtitle}>Track your progress over time</DescriptionText>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="calendar-outline" size={24} color={COLORS.primaryAction} />
              </View>
              <TitleText style={styles.statValue}>5</TitleText>
              <DescriptionText style={styles.statLabel}>Current Streak</DescriptionText>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              </View>
              <TitleText style={styles.statValue}>12</TitleText>
              <DescriptionText style={styles.statLabel}>Best Streak</DescriptionText>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="time-outline" size={24} color="#10B981" />
              </View>
              <TitleText style={styles.statValue}>127h</TitleText>
              <DescriptionText style={styles.statLabel}>Total Time</DescriptionText>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="trending-up-outline" size={24} color="#FF6B6B" />
              </View>
              <TitleText style={styles.statValue}>85%</TitleText>
              <DescriptionText style={styles.statLabel}>Success Rate</DescriptionText>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <TitleText style={styles.sectionTitle}>Weekly Progress</TitleText>
            <View style={styles.weeklyGrid}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <View key={day} style={styles.dayColumn}>
                  <DescriptionText style={styles.dayLabel}>{day}</DescriptionText>
                  <View style={[styles.dayBar, { height: Math.random() * 60 + 20 }]} />
                </View>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsSection}>
            <TitleText style={styles.sectionTitle}>Recent Achievements</TitleText>
            <View style={styles.achievementsList}>
              <View style={styles.achievementItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <DescriptionText style={styles.achievementText}>First Week Complete!</DescriptionText>
              </View>
              <View style={styles.achievementItem}>
                <Ionicons name="flame" size={20} color="#FF6B35" />
                <DescriptionText style={styles.achievementText}>5 Day Streak</DescriptionText>
              </View>
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
    backgroundColor: COLORS.defaultBg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.md,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.mainText,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  progressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.xl,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.secondaryBackground,
    marginBottom: SPACING.md,
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.xs,
  },
  dayBar: {
    width: 20,
    backgroundColor: COLORS.primaryAction,
    borderRadius: 10,
    minHeight: 20,
  },
  achievementsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.lg,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementsList: {
    gap: SPACING.sm,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  achievementText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});