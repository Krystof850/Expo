import React, { useState } from "react";
import { router, Redirect, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { signInWithApple, isAppleSignInAvailable } from "../../src/services/auth";
import { useAuth } from "../../src/context/AuthContext";
import { FirebaseConfigBanner } from "../../src/components/FirebaseConfigBanner";
import { AuthErrorBoundary } from "../../src/components/AuthErrorBoundary";
import { useErrorHandler, createAuthError } from "../../src/components/UserFriendlyErrorHandler";
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function SignIn() {
  const { user } = useAuth();
  const { showError } = useErrorHandler();
  const router = useRouter();
  const [appleLoading, setAppleLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Legal Modals State
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

  // Check Apple Sign In availability on component mount
  React.useEffect(() => {
    const checkAppleAvailability = async () => {
      const available = await isAppleSignInAvailable();
      setAppleAvailable(available);
    };
    checkAppleAvailability();
  }, []);



  const handleAppleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      setAppleLoading(true);
      const result = await signInWithApple();
      console.log('[SignIn] Apple Sign In successful');
    } catch (e: any) {
      console.error('[SignIn] Apple Sign In failed:', e);
      showError(createAuthError(e.message || "Apple Sign In failed. Please try again."));
    } finally {
      setAppleLoading(false);
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

  if (user) return <Redirect href="/(tabs)/" />;

  return (
    <AuthErrorBoundary>
      <AppBackground>
        <FirebaseConfigBanner />
        <View style={styles.container}>          
          <View style={[styles.content, { paddingTop: insets.top + SPACING.xl }]}>
            <View style={[styles.header, { overflow: 'visible' }]}>
              <TitleText animated={false} style={[styles.title, { fontSize: 32, lineHeight: Math.round(32 * 1.25) }]}>Sign In</TitleText>
              <DescriptionText animated={false} style={styles.subtitle}>Sign in with your Apple ID to continue</DescriptionText>
            </View>

            <View style={styles.buttonContainer}>
              {/* Apple Sign In Button */}
              {appleAvailable && (
                <HapticButton 
                  style={[styles.signInButton, appleLoading && styles.disabledButton]}
                  onPress={handleAppleSignIn}
                  disabled={appleLoading}
                >
                  <Ionicons name="logo-apple" size={24} color="#000000" style={styles.buttonIcon} />
                  <TitleText animated={false} style={styles.buttonText}>
                    {appleLoading ? "Signing in..." : "Continue with Apple"}
                  </TitleText>
                </HapticButton>
              )}

            </View>

            {/* Legal Links */}
            <View style={[styles.legalLinks, { bottom: insets.bottom + 20 }]}>
              <TouchableOpacity onPress={handlePrivacyPolicy}>
                <Text style={styles.legalLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.legalSeparator}>  •  </Text>
              <TouchableOpacity onPress={handleTermsOfService}>
                <Text style={styles.legalLinkText}>Terms of Service</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

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
      </AppBackground>
    </AuthErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
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
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  signInButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderRadius: 16,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  googleButton: {
    width: '100%',
    height: 48,
  },
  
  // Legal Links
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: SPACING.lg,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  legalLinkText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Legal Modal Styles
  legalModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  closeButton: {
    padding: 8,
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