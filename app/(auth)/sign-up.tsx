import React, { useState } from "react";
import { Link, Redirect } from "expo-router";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { signUpWithEmail } from "../../src/services/auth";
import { useAuth } from "../../src/context/AuthContext";
import { FirebaseConfigBanner } from "../../src/components/FirebaseConfigBanner";
import { AuthErrorBoundary } from "../../src/components/AuthErrorBoundary";

const schema = Yup.object({
  email: Yup.string().email("Neplatný email").required("Povinné"),
  password: Yup.string().min(6, "Min. 6 znaků").required("Povinné"),
});

export default function SignUp() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Redirect href="/(protected)/" />;

  return (
    <AuthErrorBoundary>
      <View style={{ flex: 1 }}>
        <FirebaseConfigBanner />
        <View style={styles.container}>
        <Text style={styles.title}>Registrace</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={schema}
        onSubmit={async ({ email, password }) => {
          try {
            setSubmitting(true);
            await signUpWithEmail(email.trim(), password);
          } catch (e: any) {
            Alert.alert("Chyba", e.message || "Nepodařilo se vytvořit účet.");
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
              placeholder="Heslo (minimálně 6 znaků)"
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
                {submitting ? "Zakládám účet..." : "Vytvořit účet"}
              </Text>
            </TouchableOpacity>

            {/* Sekce pro přihlášení */}
            <View style={styles.authAlternatives}>
              <Text style={styles.alternativeText}>Již máte účet?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Přihlásit se</Text>
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
    backgroundColor: '#2ecc71',
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
    backgroundColor: '#e8f4fd',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  alternativeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#3498db',
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
});