import React, { useState } from "react";
import { Link, Redirect } from "expo-router";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { signInWithEmail, signInWithGoogle } from "../../src/services/auth";
import { useAuth } from "../../src/context/AuthContext";
import { FirebaseConfigBanner } from "../../src/components/FirebaseConfigBanner";
import { AuthErrorBoundary } from "../../src/components/AuthErrorBoundary";

const schema = Yup.object({
  email: Yup.string().email("Neplatný email").required("Povinné"),
  password: Yup.string().min(6, "Min. 6 znaků").required("Povinné"),
});

export default function SignIn() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (e: any) {
      Alert.alert("Chyba", e.message || "Nepodařilo se přihlásit přes Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (user) return <Redirect href="/(protected)/" />;

  return (
    <AuthErrorBoundary>
      <View style={{ flex: 1 }}>
        <FirebaseConfigBanner />
        <View style={styles.container}>
        <Text style={styles.title}>Přihlášení</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={schema}
        onSubmit={async ({ email, password }) => {
          try {
            setSubmitting(true);
            await signInWithEmail(email.trim(), password);
          } catch (e: any) {
            Alert.alert("Chyba", e.message || "Nepodařilo se přihlásit.");
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
            />
            {touched.email && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
              placeholder="Heslo"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              style={styles.input}
            />
            {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <TouchableOpacity 
              style={[styles.primaryButton, submitting && styles.disabledButton]}
              onPress={() => handleSubmit()}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? "Přihlašuji..." : "Přihlásit se"}
              </Text>
            </TouchableOpacity>

            {/* Oddělovač */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>nebo</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In tlačítko */}
            <TouchableOpacity 
              style={[styles.googleButton, googleLoading && styles.disabledButton]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading || submitting}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>
                {googleLoading ? "Přihlašuji přes Google..." : "Přihlásit se přes Google"}
              </Text>
            </TouchableOpacity>

            {/* Sekce pro registraci - velmi výrazná */}
            <View style={styles.authAlternatives}>
              <Text style={styles.alternativeText}>Nemáte ještě účet?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Vytvořit nový účet</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Odkaz na zapomenuté heslo */}
            <View style={styles.forgotSection}>
              <Link href="/(auth)/forgot" asChild>
                <TouchableOpacity style={styles.linkButton}>
                  <Text style={styles.linkText}>Zapomněli jste heslo?</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        )}
      </Formik>
        </View>
      </View>
    </AuthErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authAlternatives: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  alternativeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: '#3498db',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285f4',
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});