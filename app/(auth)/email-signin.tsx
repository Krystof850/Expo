import React, { useState } from "react";
import { router, Redirect } from "expo-router";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmail, signUpWithEmail } from "../../src/services/auth";
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../src/lib/firebase';
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

  // Conditional return after all hooks
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
                  
                  // Try to sign in first
                  try {
                    console.log('[EmailSignIn] Trying to sign in existing user');
                    await signInWithEmail(trimmedEmail, password);
                    console.log('[EmailSignIn] Sign in successful');
                  } catch (signInError: any) {
                    console.log('[EmailSignIn] Sign in failed:', signInError.code);
                    
                    if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
                      // User doesn't exist, try to create new account
                      console.log('[EmailSignIn] User not found, trying to create new account');
                      await signUpWithEmail(trimmedEmail, password);
                      console.log('[EmailSignIn] Sign up successful');
                    } else {
                      // Other sign in errors (wrong password, etc.)
                      throw signInError;
                    }
                  }
                } catch (e: any) {
                  console.error('[EmailSignIn] Authentication failed:', e);
                  let errorMessage = "Authentication failed.";
                  if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
                    errorMessage = "Nesprávné heslo. Zkus to znovu.";
                  } else if (e.code === 'auth/email-already-in-use') {
                    errorMessage = "Tento email je již registrován. Zkus se přihlásit.";
                  } else if (e.code === 'auth/weak-password') {
                    errorMessage = "Heslo je příliš slabé. Zvolte silnější heslo (min. 6 znaků).";
                  } else if (e.code === 'auth/invalid-email') {
                    errorMessage = "Neplatný formát emailu.";
                  }
                  Alert.alert("Chyba", e.message || errorMessage);
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