import React, { useState } from "react";
import { Link, Redirect } from "expo-router";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import * as Haptics from 'expo-haptics';
import { Formik } from "formik";
import * as Yup from "yup";
import { signUpWithEmail, signInWithGoogle } from "../../src/services/auth";
import { useAuth } from "../../src/context/AuthContext";
import { FirebaseConfigBanner } from "../../src/components/FirebaseConfigBanner";
import { AuthErrorBoundary } from "../../src/components/AuthErrorBoundary";
import AppBackground from '../../components/AppBackground';
import ScreenContainer from '../../components/ScreenContainer';
import { TitleText, DescriptionText } from '../../components/Text';
import HapticButton from '../../components/HapticButton';
import { COLORS, SPACING } from '../../constants/theme';

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min. 6 characters").required("Required"),
});

export default function SignUp() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to sign in with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (user) return <Redirect href="/(protected)/" />;

  return (
    <AuthErrorBoundary>
      <AppBackground>
        <StatusBar barStyle="light-content" />
        <ScreenContainer scroll>
          <FirebaseConfigBanner />
          <View style={styles.formContainer}>
            <TitleText style={styles.title}>Create Account</TitleText>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={schema}
        onSubmit={async ({ email, password }) => {
          try {
            setSubmitting(true);
            await signUpWithEmail(email.trim(), password);
          } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to create account.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
            {touched.email && errors.email ? <DescriptionText style={styles.errorText}>{errors.email}</DescriptionText> : null}

            <TextInput
              placeholder="Password (min. 6 characters)"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              style={styles.input}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
            {touched.password && errors.password ? <DescriptionText style={styles.errorText}>{errors.password}</DescriptionText> : null}

            <HapticButton 
              style={[styles.primaryButton, submitting && styles.disabledButton]}
              onPress={() => handleSubmit()}
              disabled={submitting}
            >
              <TitleText style={styles.primaryButtonText}>
                {submitting ? "Creating account..." : "Create Account"}
              </TitleText>
            </HapticButton>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <DescriptionText style={styles.dividerText}>or</DescriptionText>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button */}
            <HapticButton 
              style={[styles.googleButton, googleLoading && styles.disabledButton]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading || submitting}
            >
              <DescriptionText style={styles.googleIcon}>G</DescriptionText>
              <DescriptionText style={styles.googleButtonText}>
                {googleLoading ? "Signing up with Google..." : "Sign up with Google"}
              </DescriptionText>
            </HapticButton>

            {/* Sign In Section */}
            <View style={styles.authAlternatives}>
              <DescriptionText style={styles.alternativeText}>Already have an account?</DescriptionText>
              <Link href="/(auth)/sign-in" asChild>
                <HapticButton style={styles.secondaryButton}>
                  <TitleText style={styles.secondaryButtonText}>Sign In</TitleText>
                </HapticButton>
              </Link>
            </View>
          </>
        )}
      </Formik>
          </View>
        </ScreenContainer>
      </AppBackground>
    </AuthErrorBoundary>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.mainText,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: SPACING.sm,
    textAlign: 'left',
  },
  primaryButton: {
    backgroundColor: COLORS.mainText,
    borderRadius: 50,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryButtonText: {
    color: COLORS.defaultBg,
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  authAlternatives: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  alternativeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primaryAction,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primaryAction,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285f4',
    marginRight: SPACING.sm,
    width: 20,
    textAlign: 'center',
  },
  googleButtonText: {
    color: COLORS.defaultBg,
    fontSize: 16,
    fontWeight: '500',
  },
});