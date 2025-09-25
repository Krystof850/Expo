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
import { deleteUserAccount } from '../../src/services/auth';
import Protected from '../../src/components/Protected';
import { COLORS } from '@/constants/theme';

export default function Profile() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Delete Account Modal State
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Legal Modals State
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

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
    
    Alert.alert(
      'Support',
      'For support, please email us at unloop.app.tech@gmail.com',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleRateApp = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      console.log('🌟 Rate App: Starting review request...');
      
      // Check if store review is available on this device
      const isAvailable = await StoreReview.isAvailableAsync();
      console.log('🌟 Rate App: isAvailable =', isAvailable);
      
      if (isAvailable) {
        // Check if platform can use requestReview()
        const hasAction = await StoreReview.hasAction();
        console.log('🌟 Rate App: hasAction =', hasAction);
        
        if (hasAction) {
          console.log('🌟 Rate App: Requesting native review...');
          await StoreReview.requestReview();
          console.log('🌟 Rate App: Review request completed');
        } else {
          console.log('🌟 Rate App: No native action available, showing fallback');
          Alert.alert(
            'Rate App',
            'Please visit the App Store to leave a review for our app. Thank you for your support!',
            [{ text: 'OK', style: 'default' }]
          );
        }
      } else {
        console.log('🌟 Rate App: Not available, showing App Store fallback');
        Alert.alert(
          'Rate App',
          'Please visit the App Store to leave a review for our app. Thank you for your support!',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('🌟 Rate App: Error occurred:', error);
      Alert.alert(
        'Rate App', 
        'Thank you for your interest in rating our app! Please visit the App Store to leave a review.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleDeleteAccount = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Show confirmation alert first
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted. Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            setIsDeleteModalVisible(true);
          },
        },
      ]
    );
  };

  const handleDeleteAccountConfirm = async () => {
    if (isDeletingAccount) return; // Prevent duplicate submissions
    
    // Validate that user typed "DELETE"
    if (deleteConfirmation.trim() !== 'DELETE') {
      Alert.alert('Error', 'Please type DELETE to confirm account deletion.');
      return;
    }
    
    // For email/password users, validate password is provided
    const isEmailUser = user?.providerData.some(p => p.providerId === 'password');
    if (isEmailUser && !deletePassword.trim()) {
      Alert.alert('Error', 'Please enter your password to confirm account deletion.');
      return;
    }
    
    setIsDeletingAccount(true);
    
    try {
      // Pass password for email users, undefined for others
      await deleteUserAccount(isEmailUser ? deletePassword : undefined);
      
      // Show success message and close modal
      setIsDeleteModalVisible(false);
      setDeleteConfirmation('');
      setDeletePassword('');
      
      Alert.alert(
        'Account Deleted',
        'Your account has been successfully deleted.',
        [
          {
            text: 'OK',
            onPress: () => {
              // User will be automatically logged out by Firebase Auth state change
            },
          },
        ]
      );
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('Delete account error:', error);
      
      Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handlePrivacyPolicy = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPrivacyModalVisible(true);
  };

  const handleTermsOfService = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsTermsModalVisible(true);
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

            <View style={styles.menuSeparator} />

            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="trash" size={24} color={COLORS.primaryAction || '#0284C7'} />
                <Text style={styles.menuItemText}>Delete Account</Text>
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

          {/* Legal Links */}
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={handlePrivacyPolicy}>
              <Text style={styles.legalLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}>  •  </Text>
            <TouchableOpacity onPress={handleTermsOfService}>
              <Text style={styles.legalLinkText}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
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
                  <Ionicons name="close" size={24} color="#64748B" />
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

        {/* Delete Account Modal */}
        <Modal
          visible={isDeleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setIsDeleteModalVisible(false);
            setDeleteConfirmation('');
            setDeletePassword('');
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Delete Account</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setIsDeleteModalVisible(false);
                    setDeleteConfirmation('');
                    setDeletePassword('');
                  }}
                >
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.deleteWarningSection}>
                <View style={styles.warningIcon}>
                  <Ionicons name="warning" size={32} color="#DC2626" />
                </View>
                <Text style={styles.deleteWarningTitle}>This action cannot be undone</Text>
                <Text style={styles.deleteWarningText}>
                  Deleting your account will permanently remove all your data, settings, and progress. 
                  This action is irreversible.
                </Text>
              </View>

              <View style={styles.inputSection}>
                {/* Password field for email/password users */}
                {user?.providerData.some(p => p.providerId === 'password') && (
                  <>
                    <Text style={styles.inputLabel}>Enter your password</Text>
                    <TextInput
                      style={styles.passwordInput}
                      value={deletePassword}
                      onChangeText={setDeletePassword}
                      secureTextEntry
                      placeholder="Enter your current password"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </>
                )}
                
                {/* DELETE confirmation for all users */}
                <Text style={styles.inputLabel}>Type DELETE to confirm</Text>
                <Text style={styles.deleteInfoText}>
                  To confirm account deletion, please type the word DELETE in the field below.
                </Text>
                <TextInput
                  style={styles.passwordInput}
                  value={deleteConfirmation}
                  onChangeText={setDeleteConfirmation}
                  placeholder="Type DELETE to confirm"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setIsDeleteModalVisible(false);
                    setDeleteConfirmation('');
                    setDeletePassword('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.deleteButton, isDeletingAccount && { opacity: 0.6 }]} 
                  onPress={handleDeleteAccountConfirm}
                  disabled={isDeletingAccount}
                >
                  <Text style={styles.deleteButtonText}>
                    {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Privacy Policy Modal */}
        <Modal
          visible={isPrivacyModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsPrivacyModalVisible(false)}
        >
          <View style={styles.legalModalOverlay}>
            <View style={styles.legalModalContent}>
              <View style={styles.legalModalHeader}>
                <Text style={styles.legalModalTitle}>Privacy Policy</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsPrivacyModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.legalModalScroll} showsVerticalScrollIndicator={true}>
                <Text style={styles.legalModalText}>
                  Effective Date: September 19, 2025{'\n\n'}
                  
                  This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service. It also informs You about Your privacy rights and how the law protects You. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>1. Definitions</Text>{'\n'}
                  • Application: Unloop, a mobile application designed to assist users in combating procrastination and improving personal productivity.{'\n'}
                  • Company: KK Digital Solutions LLC, a company registered at 30 N Gould St Ste R, Sheridan, WY 82801.{'\n'}
                  • Service: Refers to the Application, Unloop.{'\n'}
                  • Personal Data: Any information that relates to an identified or identifiable individual.{'\n'}
                  • Usage Data: Data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (e.g., the duration of a page visit).{'\n'}
                  • You: The individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>2. Collecting and Using Your Personal Data</Text>{'\n'}
                  While using our Service, we may ask You to provide us with certain personally identifiable information that can be used to contact or identify You. This information is collected solely for the purpose of providing and improving the Service. Personally identifiable information may include, but is not limited to:{'\n'}
                  • Email address: Used for account management, password recovery, and for sending You important updates or communications related to the Service.{'\n'}
                  • First and last name: Collected to personalize Your in-app experience.{'\n'}
                  • Username: A unique identifier used within the app.{'\n'}
                  • Payment Data: We do not collect or store Your financial details, such as credit card numbers. Information collected in connection with a subscription purchase is processed through secure, third-party services, specifically the Apple App Store. Apple handles all payment transactions and provides us with anonymized data regarding the status of Your subscription, but not Your payment information.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>3. Usage Data</Text>{'\n'}
                  Usage Data is collected automatically to help us understand how You interact with our Service. This data is critical for our diagnostic and performance analysis. Usage Data may include:{'\n'}
                  • Information about Your device: This includes technical information such as Your device's IP address, unique device identifiers, operating system version, and mobile network information.{'\n'}
                  • Application Interaction: We track how the Service is used to identify areas for improvement. This includes, but is not limited to, the pages You visit within the app, the time and date of Your visit, the time spent on those pages, and other diagnostic data related to app performance, crashes, and bugs. This data is vital for us to create a more stable and user-friendly experience.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>4. Use of Your Personal Data</Text>{'\n'}
                  The Company may use Personal Data for the following purposes:{'\n'}
                  • To provide and maintain our Service: We use Your data to operate the core functions of Unloop, including tracking tasks and goals. We also use it to monitor the usage of our Service to ensure optimal performance and to identify technical issues.{'\n'}
                  • To manage Your Account: Your personal data is essential for managing Your registration as a user of the Service. It allows us to give You access to different functionalities of the app that are available to You as a registered user.{'\n'}
                  • For the performance of a contract: We use Your data to fulfill and manage the purchase contract for the products You have purchased through the Service, such as subscriptions. This includes processing transactions and providing You with access to paid features.{'\n'}
                  • To contact You: We may use Your personal data to contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication. This includes sending You updates, security alerts, and informative communications related to the Service.{'\n'}
                  • To improve the Service: We use aggregated usage data to analyze and understand how our Service is being used. This analysis helps us to troubleshoot issues, enhance existing features, and develop new ones to provide a better user experience.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>5. Disclosure of Your Personal Data</Text>{'\n'}
                  We may share Your personal information in the following situations, always with a commitment to protecting Your privacy:{'\n'}
                  • With service providers: We engage third-party service providers to perform functions on our behalf. This includes providing payment processing, data analysis, email delivery, and customer support. These service providers have access to Your Personal Data only to perform these tasks and are obligated not to disclose or use it for any other purpose.{'\n'}
                  • With Your consent: We may disclose Your personal information for any other purpose with Your express consent.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>6. Security of Your Personal Data</Text>{'\n'}
                  The security of Your Personal Data is of utmost importance to us. We employ a variety of industry-standard security measures to protect Your information from unauthorized access, disclosure, alteration, and destruction. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect Your Personal Data, we cannot guarantee its absolute security.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>7. Links to Other Websites</Text>{'\n'}
                  Our Service may contain links to websites that are not operated by us. If You click on a third-party link, You will be directed to that third-party's site. We strongly advise You to review the Privacy Policy of every site You visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>8. Changes to this Privacy Policy</Text>{'\n'}
                  We may update Our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify You of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>9. Contact Us</Text>{'\n'}
                  If You have any questions about this Privacy Policy, please contact us at:{'\n'}
                  unloop.app.tech@gmail.com
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Terms of Service Modal */}
        <Modal
          visible={isTermsModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsTermsModalVisible(false)}
        >
          <View style={styles.legalModalOverlay}>
            <View style={styles.legalModalContent}>
              <View style={styles.legalModalHeader}>
                <Text style={styles.legalModalTitle}>Terms of Service</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsTermsModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.legalModalScroll} showsVerticalScrollIndicator={true}>
                <Text style={styles.legalModalText}>
                  Effective Date: September 19, 2025{'\n\n'}
                  
                  Please read these Terms of Service ("Terms") carefully before using the Unloop mobile application ("the Service") operated by KK Digital Solutions LLC ("the Company," "we," "us," or "our"). These Terms constitute a legally binding agreement that governs your access to and use of the Service.{'\n\n'}
                  
                  By accessing or using the Service, you signify your full and unconditional agreement to be bound by these Terms. If you do not agree with any part of the Terms, you may not access or use the Service. We reserve the right to modify these Terms at our sole discretion at any time.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>1. Your Access to the Service and Age Restriction</Text>{'\n'}
                  The Service is a tool designed to assist individuals in managing their productivity and procrastination habits. It is intended solely for use by individuals who are at least 13 years of age. By accessing and using the Service, you legally represent and warrant that you meet this age requirement and have the legal capacity to enter into this agreement. If you are under the age of 13, you are strictly prohibited from using the Service. If we become aware that we have collected personal data from a user under the age of 13 without verification of parental consent, we will take steps to remove that information from our servers immediately.{'\n\n'}
                  
                  You are personally responsible for maintaining the confidentiality and security of your account and password. You also accept full responsibility for all activities that occur under your account, whether or not you have authorized such activities. This includes, but is not limited to, any transactions, content submissions, or communications. We are not liable for any loss or damage arising from your failure to protect your account information. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>2. Intellectual Property Rights</Text>{'\n'}
                  The Service, including its design, user interface, source code, visual content, functionality, and all original content, features, and functionality provided therein, are and will remain the exclusive intellectual property of KK Digital Solutions LLC and its licensors. All elements of the Service are protected by copyright, trademark, and other intellectual property laws of both the United States and various foreign countries. Our trademarks and trade dress, including the name "Unloop," the company name "KK Digital Solutions LLC," and any associated logos or designs, may not be used in connection with any product or service without the explicit prior written consent of the Company. Unauthorized use is a direct violation of our intellectual property rights and may result in legal action.{'\n\n'}
                  
                  You are granted a limited, non-exclusive, non-transferable, and revocable license to use the Service for your personal, non-commercial use, in accordance with these Terms. This license does not grant you the right to modify, copy, reproduce, reverse engineer, or create derivative works from the Service's intellectual property without our explicit permission.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>3. User Content and Conduct</Text>{'\n'}
                  You are solely responsible for any content you post, upload, or otherwise make available on or through the Service, including tasks, notes, goals, or any other data you input. By submitting this content, you grant us a non-exclusive, fully paid, transferable, sub-licensable, royalty-free, worldwide license to use, copy, modify, and distribute your content in connection with the Service. This license allows us to operate, improve, and promote the Service.{'\n\n'}
                  
                  While we do not monitor all user-generated content, we reserve the right, but are not obligated, to remove or modify any content at our sole discretion for any reason whatsoever, including content that we deem to be unlawful, offensive, threatening, libelous, defamatory, or otherwise objectionable or in violation of these Terms. You agree not to use the Service to engage in any unlawful, fraudulent, or otherwise prohibited activities. This includes, but is not limited to, posting content that infringes upon the rights of others, transmitting viruses, or engaging in any form of harassment.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>4. Subscriptions and Billing</Text>{'\n'}
                  The Service may offer subscriptions that provide access to enhanced features. These subscriptions are billed on a recurring basis, and the billing cycle (e.g., monthly or annually) is chosen by you at the time of purchase. Your subscription is automatically renewed at the end of each Billing Cycle unless you cancel it at least 24 hours before the end of the current period. We reserve the right to cancel your subscription at our sole discretion for any reason, including non-payment.{'\n\n'}
                  
                  You can manage and cancel your subscriptions directly through your Apple App Store account settings. We do not have direct control over this process; it is managed entirely by Apple's payment system. We are not responsible for any billing issues, subscription cancellations, or refunds. All inquiries regarding payments, cancellations, or refunds should be directed to Apple Support. We only receive anonymized transaction data and do not store any of your financial information.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>5. Termination</Text>{'\n'}
                  We reserve the right to terminate or suspend your access to the Service immediately and without prior notice or liability. This may occur for any reason whatsoever, including, but not limited to, if we believe you have breached these Terms or engaged in behavior that is harmful to us or other users. Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service and contact our support team. All provisions of these Terms which, by their nature, should survive termination shall survive, including, without limitation, intellectual property rights, warranty disclaimers, indemnity, and limitations of liability.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>6. Limitation of Liability and Indemnification</Text>{'\n'}
                  In no event shall KK Digital Solutions LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages. This includes, but is not limited to, damages for loss of profits, data, use, goodwill, or other intangible losses. These damages may result from (i) your access to or use of, or inability to access or use, the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content. This limitation applies whether the claim is based on warranty, contract, tort (including negligence), or any other legal theory, and regardless of whether we have been informed of the possibility of such damage. You agree to defend, indemnify, and hold harmless the Company from and against any claims, liabilities, damages, and expenses, including reasonable legal fees, arising from your use of the Service or your violation of these Terms.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>7. "AS IS" and "AS AVAILABLE" Disclaimer</Text>{'\n'}
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, materials, or products included therein. We do not warrant that the Service will be uninterrupted, error-free, or secure. Your use of the Service is at your sole risk. To the fullest extent permitted by applicable law, the Company disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>8. Governing Law and Jurisdiction</Text>{'\n'}
                  These Terms shall be governed by and construed in accordance with the laws of the state of Wyoming, United States, without regard to its conflict of law provisions. You agree that any legal action or proceeding related to the Service shall be brought exclusively in a federal or state court of competent jurisdiction located in Wyoming. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions will remain in full force and effect.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>9. Changes to Terms</Text>{'\n'}
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. We will notify you of such changes by posting the new Terms on this page or by sending a notification through the Service. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you must stop using the Service.{'\n\n'}
                  
                  <Text style={styles.legalModalBold}>10. Contact Us</Text>{'\n'}
                  If you have any questions about these Terms, please contact us at:{'\n'}
                  unloop.app.tech@gmail.com
                </Text>
              </ScrollView>
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
    color: '#082F49',
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
    color: '#082F49',
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
    color: '#64748B',
    marginBottom: 8,
    marginTop: 16,
  },
  passwordInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#082F49',
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.5)',
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
    color: '#64748B',
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

  // Delete Account Modal Styles
  deleteWarningSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  warningIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteWarningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  deleteWarningText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  deleteInfoText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    backgroundColor: 'rgba(147, 197, 253, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.2)',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.primaryAction || '#0284C7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Legal Links
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  legalLinkText: {
    fontSize: 14,
    color: '#64748B',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 14,
    color: '#64748B',
  },

  // Legal Modal Styles
  legalModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  legalModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  legalModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#082F49',
  },
  legalModalScroll: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  legalModalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  legalModalBold: {
    fontWeight: '700',
    color: '#082F49',
  },
});