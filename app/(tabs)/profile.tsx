import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform, TextInput, Modal, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import * as StoreReview from 'expo-store-review';
import Constants from 'expo-constants';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

import { useAuth } from '../../src/context/AuthContext';
import { Protected } from '../../src/components/Protected';
import { COLORS } from '@/constants/theme';

export default function Profile() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Tab bar height calculation - modern tab bar is about 80px + safe area bottom  
  const tabBarHeight = 80 + insets.bottom;

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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Background Gradient - same as statistics page */}
        <LinearGradient
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
            <Text style={styles.title}>Profile</Text>
          </View>

          {/* User Info Card */}
          <View style={styles.userInfoCard}>
            <Text style={styles.userEmail}>{user?.email || 'No email available'}</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="lock-closed" size={24} color={COLORS.primaryAction || '#0284C7'} />
                <Text style={styles.menuItemText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuSeparator} />

            <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="help-circle" size={24} color={COLORS.primaryAction || '#0284C7'} />
                <Text style={styles.menuItemText}>Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuSeparator} />

            <TouchableOpacity style={styles.menuItem} onPress={handleRateApp}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="star" size={24} color={COLORS.primaryAction || '#0284C7'} />
                <Text style={styles.menuItemText}>Rate App</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Password Change Modal */}
        <Modal
          visible={isPasswordModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsPasswordModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Change Password</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsPasswordModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={COLORS.mainText} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password (min 6 characters)"
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsPasswordModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.updateButton, isUpdatingPassword && { opacity: 0.6 }]} 
                  onPress={handlePasswordUpdate}
                  disabled={isUpdatingPassword}
                >
                  <Text style={styles.updateButtonText}>
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.mainText || '#082F49',
    textAlign: 'center',
  },

  // User Info Card
  userInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'flex-start',
    marginBottom: 24,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  premiumBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryAction || '#0284C7',
  },

  // Menu Card
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 16,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },

  // Spacer and Sign Out
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  signOutButton: {
    backgroundColor: COLORS.primaryAction || '#0284C7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: COLORS.primaryAction || '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mainText,
  },
  closeButton: {
    padding: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mainText,
    marginBottom: 8,
    marginTop: 16,
  },
  passwordInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.mainText,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 16,
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
    backgroundColor: COLORS.primaryAction || '#0284C7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});