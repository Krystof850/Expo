import React, { useState } from "react";
import { Link, Redirect } from "expo-router";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { signUpWithEmail } from "../../src/services/auth";
import { useAuth } from "../../src/context/AuthContext";

const schema = Yup.object({
  email: Yup.string().email("Neplatný email").required("Povinné"),
  password: Yup.string().min(6, "Min. 6 znaků").required("Povinné"),
});

export default function SignUp() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Redirect href="/(protected)/" />;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Registrace</Text>
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
              style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
            />
            {touched.email && errors.email ? <Text style={{ color: "red" }}>{errors.email}</Text> : null}

            <TextInput
              placeholder="Heslo"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
            />
            {touched.password && errors.password ? <Text style={{ color: "red" }}>{errors.password}</Text> : null}

            <Button title={submitting ? "Zakládám..." : "Zaregistrovat"} onPress={() => handleSubmit()} disabled={submitting} />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <Link href="/(auth)/sign-in">Už máš účet? Přihlásit</Link>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}