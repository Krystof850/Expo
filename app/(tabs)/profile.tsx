import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import * as StoreReview from 'expo-store-review';
import Constants from 'expo-constants';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

import { useAuth } from '../../src/context/AuthContext';
import { Protected } from '../../src/components/Protected';
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '@/constants/theme';

export default function Profile() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  const handleChangePassword = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPasswordModalVisible(true);
  };

  const handlePasswordUpdate = async () => {
    if (isUpdatingPassword) return; // Prevent duplicate submissions
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsUpdatingPassword(true);
    
    try {
      if (!user || !user.email) {
        Alert.alert('Error', 'Unable to update password. Please try signing in again.');
        return;
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      setIsPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      Alert.alert('Success', 'Password updated successfully');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('Password update error:', error);
      let errorMessage = 'Failed to update password';
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Current password is incorrect';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign out and sign in again before changing your password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      }
      
      Alert.alert('Error', errorMessage);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSupport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;
      const supportEmail = extra.SUPPORT_EMAIL || 'unloop.app.tech@gmail.com';
      const subject = 'Support Request - Unloop App';
      const body = 'Hello Unloop Team,\n\nI need help with:\n\n';
      
      const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      const supported = await Linking.canOpenURL(mailto);
      if (supported) {
        await Linking.openURL(mailto);
      } else {
        Alert.alert(
          'Email Client Not Available',
          `Please send an email to: ${supportEmail}`,
          [
            {
              text: 'Copy Email',
              onPress: async () => {
                try {
                  await Clipboard.setStringAsync(supportEmail);
                  Alert.alert('Email Copied', `${supportEmail} has been copied to your clipboard`);
                  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch (error) {
                  console.error('Clipboard error:', error);
                  Alert.alert('Email Address', supportEmail);
                }
              }
            },
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Support email error:', error);
      Alert.alert('Error', 'Unable to open email client');
    }
  };

  const handleRateApp = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      if (Platform.OS === 'ios') {
        // Use expo-store-review for iOS in-app rating
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
          await StoreReview.requestReview();
        } else {
          // Fallback for iOS - Note: this would need real App Store ID in production
          Alert.alert(
            'Rate App',
            'Please rate our app in the App Store',
            [
              { text: 'Later', style: 'cancel' },
              {
                text: 'Rate Now',
                onPress: () => {
                  // In production, replace with actual App Store ID
                  Alert.alert('App Store', 'This would open the App Store page for rating in production.');
                }
              }
            ]
          );
        }
      } else if (Platform.OS === 'android') {
        // Android - open Play Store
        const bundleId = 'com.unloopapp';
        const playStoreUrl = `https://play.google.com/store/apps/details?id=${bundleId}`;
        
        const supported = await Linking.canOpenURL(playStoreUrl);
        if (supported) {
          await Linking.openURL(playStoreUrl);
        } else {
          Alert.alert('Error', 'Unable to open Google Play Store');
        }
      } else {
        Alert.alert('Error', 'App rating is only available on mobile devices');
      }
    } catch (error) {
      console.error('Rate app error:', error);
      Alert.alert('Error', 'Unable to open rating interface');
    }
  };

  return (
    <Protected>
      <AppBackground>
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


          {/* Menu Items */}
          <View style={styles.menuSection}>
            <HapticButton style={styles.menuItem} onPress={handleChangePassword}>
              <Ionicons name="key-outline" size={24} color={COLORS.secondaryBackground} />
              <DescriptionText style={styles.menuText}>Change Password</DescriptionText>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBackground} />
            </HapticButton>

            <HapticButton style={styles.menuItem} onPress={handleSupport}>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.secondaryBackground} />
              <DescriptionText style={styles.menuText}>Support</DescriptionText>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBackground} />
            </HapticButton>

            <HapticButton style={styles.menuItem} onPress={handleRateApp}>
              <Ionicons name="star-outline" size={24} color={COLORS.secondaryBackground} />
              <DescriptionText style={styles.menuText}>Rate App</DescriptionText>
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

        {/* Password Change Modal */}
        <Modal
          visible={isPasswordModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsPasswordModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TitleText style={styles.modalTitle}>Change Password</TitleText>
                <HapticButton 
                  style={styles.closeButton}
                  onPress={() => setIsPasswordModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={COLORS.mainText} />
                </HapticButton>
              </View>

              <View style={styles.inputSection}>
                <DescriptionText style={styles.inputLabel}>Current Password</DescriptionText>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />

                <DescriptionText style={styles.inputLabel}>New Password</DescriptionText>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />

                <DescriptionText style={styles.inputLabel}>Confirm New Password</DescriptionText>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
              </View>

              <View style={styles.modalButtons}>
                <HapticButton style={styles.cancelButton} onPress={() => setIsPasswordModalVisible(false)}>
                  <DescriptionText style={styles.cancelButtonText}>Cancel</DescriptionText>
                </HapticButton>
                <HapticButton 
                  style={[styles.updateButton, isUpdatingPassword && { opacity: 0.6 }]} 
                  onPress={handlePasswordUpdate}
                  disabled={isUpdatingPassword}
                >
                  <DescriptionText style={styles.updateButtonText}>
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </DescriptionText>
                </HapticButton>
              </View>
            </View>
          </View>
        </Modal>
      </AppBackground>
    </Protected>
  );
}

const styles = StyleSheet.create({
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
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mainText,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  inputSection: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mainText,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  passwordInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.mainText,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.mainText,
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    backgroundColor: COLORS.primary || '#0284C7',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: COLORS.mainText,
    fontSize: 16,
    fontWeight: '600',
  },
});