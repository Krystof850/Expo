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
import { TitleText, DescriptionText } from '../../components/Text';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';

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

  const handlePasswordChange = async () => {
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
    
    Alert.alert(
      'Support',
      'For support, contact us at:\n\nunloop.app.tech@gmail.com'
    );
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
      <View style={styles.container}>
        <LinearGradient
          colors={['#E0F2FE', '#BFDBFE', '#A5B4FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.xl + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TitleText style={styles.title}>Profile</TitleText>
          </View>

          {/* User Information Card */}
          <View style={styles.userInfoCard}>
            <Text style={styles.userEmail}>{user?.email || 'User'}</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>Premium Member</Text>
            </View>
          </View>

          {/* Menu Options Card */}
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePasswordChange}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="key-outline" size={24} color={COLORS.primaryAction} />
                <Text style={styles.menuText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="help-circle-outline" size={24} color={COLORS.primaryAction} />
                <Text style={styles.menuText}>Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleRateApp}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="star-outline" size={24} color={COLORS.primaryAction} />
                <Text style={styles.menuText}>Rate App</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
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
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsPasswordModalVisible(false);
                  }}
                >
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <DescriptionText style={styles.inputLabel}>Current Password</DescriptionText>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                  placeholderTextColor="#94A3B8"
                />

                <DescriptionText style={styles.inputLabel}>New Password</DescriptionText>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                  placeholderTextColor="#94A3B8"
                />

                <DescriptionText style={styles.inputLabel}>Confirm New Password</DescriptionText>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsPasswordModalVisible(false);
                  }}
                >
                  <DescriptionText style={styles.cancelButtonText}>Cancel</DescriptionText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.updateButton, isUpdatingPassword && { opacity: 0.6 }]} 
                  onPress={handlePasswordUpdate}
                  disabled={isUpdatingPassword}
                >
                  <DescriptionText style={styles.updateButtonText}>
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </DescriptionText>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: TYPOGRAPHY.title.fontFamily,
    fontSize: TYPOGRAPHY.title.fontSize,
    fontWeight: TYPOGRAPHY.title.fontWeight,
    lineHeight: TYPOGRAPHY.title.lineHeight,
    textAlign: 'center',
    color: '#082F49', // Dark blue text to match template
    // Removed text shadow properties
  },
  
  // User Info Card
  userInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'flex-start',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569', // Slate-600 for email text
    marginBottom: SPACING.sm,
  },
  premiumBadge: {
    backgroundColor: '#E0F2FE', // Light blue background
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  premiumBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryAction, // Our primary blue color
  },

  // Menu Card
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: SPACING.lg,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569', // Slate-600 for menu text
    marginLeft: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E2E8F0', // Light gray divider
    marginHorizontal: 16,
  },

  // Spacer to push Sign Out button down
  spacer: {
    flex: 1,
    minHeight: 20,
  },

  // Sign Out Button
  signOutButton: {
    backgroundColor: COLORS.primaryAction, // Our primary blue
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White text on blue button
  },
  
  // Modal Styles (keeping existing modal styles with slight adjustments)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    color: '#082F49',
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
    color: '#475569',
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  passwordInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: '#082F49',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    backgroundColor: COLORS.primaryAction,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});