import React, { useState } from "react";
import { router, Redirect } from "expo-router";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmail, signUpWithEmail, checkEmailExists } from "../../src/services/auth";
import { useAuth } from "../../src/context/AuthContext";
import { FirebaseConfigBanner } from "../../src/components/FirebaseConfigBanner";
import { AuthErrorBoundary } from "../../src/components/AuthErrorBoundary";
import AppBackground from '../../components/AppBackground';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min. 6 characters").required("Required"),
});

export default function EmailSignIn() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  if (user) return <Redirect href="/(tabs)/" />;

  return (
    <AuthErrorBoundary>
      <AppBackground>
        <FirebaseConfigBanner />
        <View style={[styles.container, { paddingTop: insets.top + SPACING.xl }]}>
          <View style={styles.content}>
            <View style={[styles.header, { overflow: 'visible' }]}>
              <HapticButton 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.mainText} />
              </HapticButton>
              <TitleText animated={false} style={[styles.title, { fontSize: 28, lineHeight: Math.round(28 * 1.25) }]}>Continue with Email</TitleText>
              <DescriptionText animated={false} style={styles.subtitle}>We'll sign you in or create your account</DescriptionText>
            </View>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={schema}
              onSubmit={async ({ email, password }) => {
                try {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSubmitting(true);
                  
                  const trimmedEmail = email.trim();
                  
                  // Check if email already exists in database and get provider info
                  const emailCheck = await checkEmailExists(trimmedEmail);
                  
                  if (emailCheck.exists) {
                    if (emailCheck.hasPassword) {
                      // Email exists with password -> Sign in flow
                      console.log('[EmailSignIn] Email exists with password, attempting sign in');
                      await signInWithEmail(trimmedEmail, password);
                      console.log('[EmailSignIn] Sign in successful');
                    } else {
                      // Email exists but with different provider
                      const providers = emailCheck.methods.map(method => {
                        if (method.includes('google')) return 'Google';
                        if (method.includes('apple')) return 'Apple';
                        return method;
                      }).join(', ');
                      
                      Alert.alert(
                        "Account exists with different sign-in method",
                        `This email is already registered using ${providers}. Please use that method to sign in, or use a different email address.`,
                        [{ text: "OK" }]
                      );
                      return; // Exit early
                    }
                  } else {
                    // Email doesn't exist -> Sign up flow with email verification
                    console.log('[EmailSignIn] Email does not exist, creating new account');
                    await signUpWithEmail(trimmedEmail, password);
                    console.log('[EmailSignIn] Sign up successful with email verification sent');
                    
                    // Show success message about email verification
                    Alert.alert(
                      "Account Created!", 
                      "We've sent a verification email to " + trimmedEmail + ". Please check your inbox and click the verification link to activate your account.",
                      [{ text: "OK" }]
                    );
                  }
                } catch (e: any) {
                  console.error('[EmailSignIn] Authentication failed:', e);
                  let errorMessage = "Authentication failed.";
                  if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
                    errorMessage = "Incorrect password. Please try again.";
                  } else if (e.code === 'auth/email-already-in-use') {
                    errorMessage = "This email is already registered. Please sign in instead.";
                  } else if (e.code === 'auth/weak-password') {
                    errorMessage = "Password is too weak. Choose a stronger password (min. 6 characters).";
                  } else if (e.code === 'auth/invalid-email') {
                    errorMessage = "Invalid email format.";
                  } else if (e.code === 'auth/user-disabled') {
                    errorMessage = "This account has been disabled. Please contact support.";
                  } else if (e.code === 'auth/too-many-requests') {
                    errorMessage = "Too many failed attempts. Please try again later.";
                  }
                  Alert.alert("Error", e.message || errorMessage);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      style={styles.input}
                    />
                    {touched.email && errors.email && (
                      <DescriptionText animated={false} style={styles.errorText}>{errors.email}</DescriptionText>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      secureTextEntry
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      style={styles.input}
                    />
                    {touched.password && errors.password && (
                      <DescriptionText animated={false} style={styles.errorText}>{errors.password}</DescriptionText>
                    )}
                  </View>

                  <HapticButton 
                    style={[styles.signInButton, submitting && styles.disabledButton]}
                    onPress={() => handleSubmit()}
                    disabled={submitting}
                  >
                    <TitleText animated={false} style={styles.signInButtonText}>
                      {submitting ? "Please wait..." : "Continue"}
                    </TitleText>
                  </HapticButton>

                  <View style={styles.footer}>
                    <HapticButton 
                      style={styles.linkButton}
                      onPress={() => router.push('/(auth)/forgot')}
                    >
                      <DescriptionText animated={false} style={styles.linkText}>Forgot password?</DescriptionText>
                    </HapticButton>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  form: {
    gap: SPACING.lg,
  },
  inputContainer: {
    gap: SPACING.xs,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.mainText,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: COLORS.primaryAction,
    borderRadius: 50,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.primaryAction,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  signInButtonText: {
    color: COLORS.mainText,
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
  },
  linkButton: {
    padding: SPACING.sm,
  },
  linkText: {
    color: COLORS.primaryAction,
    fontSize: 14,
    fontWeight: '600',
  },
});