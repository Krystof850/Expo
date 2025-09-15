import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAuth } from '../../src/context/AuthContext';
import { Protected } from '../../src/components/Protected';
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '@/constants/theme';

export default function Profile() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            logout();
          },
        },
      ]
    );
  };

  const handleSettings = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Settings', 'Settings coming soon!');
  };

  const handleSupport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Support', 'Support center coming soon!');
  };

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
            <TitleText style={styles.title}>Profile</TitleText>
          </View>

          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={48} color={COLORS.mainText} />
            </View>
            <TitleText style={styles.userEmail}>{user?.email || 'User'}</TitleText>
            <DescriptionText style={styles.userStatus}>Premium Member</DescriptionText>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <TitleText style={styles.quickStatValue}>12</TitleText>
              <DescriptionText style={styles.quickStatLabel}>Best Streak</DescriptionText>
            </View>
            <View style={styles.quickStatItem}>
              <TitleText style={styles.quickStatValue}>5</TitleText>
              <DescriptionText style={styles.quickStatLabel}>Current Streak</DescriptionText>
            </View>
            <View style={styles.quickStatItem}>
              <TitleText style={styles.quickStatValue}>87%</TitleText>
              <DescriptionText style={styles.quickStatLabel}>Success Rate</DescriptionText>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <HapticButton style={styles.menuItem} onPress={handleSettings}>
              <Ionicons name="settings-outline" size={24} color={COLORS.secondaryBackground} />
              <DescriptionText style={styles.menuText}>Settings</DescriptionText>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBackground} />
            </HapticButton>

            <HapticButton style={styles.menuItem} onPress={handleSupport}>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.secondaryBackground} />
              <DescriptionText style={styles.menuText}>Support</DescriptionText>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBackground} />
            </HapticButton>

            <HapticButton style={styles.menuItem}>
              <Ionicons name="star-outline" size={24} color={COLORS.secondaryBackground} />
              <DescriptionText style={styles.menuText}>Rate App</DescriptionText>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBackground} />
            </HapticButton>

            <HapticButton style={styles.menuItem}>
              <Ionicons name="share-outline" size={24} color={COLORS.secondaryBackground} />
              <DescriptionText style={styles.menuText}>Share App</DescriptionText>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBackground} />
            </HapticButton>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <HapticButton style={styles.logoutButton} onPress={handleLogout}>
              <TitleText style={styles.logoutButtonText}>Sign Out</TitleText>
            </HapticButton>
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
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  userSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.mainText,
    marginBottom: SPACING.xs,
  },
  userStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    marginBottom: SPACING.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mainText,
    marginBottom: SPACING.xs,
  },
  quickStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.secondaryBackground,
    fontWeight: '500',
    marginLeft: SPACING.md,
  },
  logoutSection: {
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl * 2,
    borderRadius: 25,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: COLORS.mainText,
    fontSize: 16,
    fontWeight: '600',
  },
});