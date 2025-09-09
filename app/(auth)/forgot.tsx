import React, { useState } from "react";
import { Link } from "expo-router";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { sendResetEmail } from "../../src/services/auth";

const schema = Yup.object({
  email: Yup.string().email("Neplatný email").required("Povinné"),
});

export default function Forgot() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Obnovení hesla</Text>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={schema}
        onSubmit={async ({ email }) => {
          try {
            setSubmitting(true);
            await sendResetEmail(email.trim());
            Alert.alert("Hotovo", "Poslali jsme ti email s odkazem na obnovení hesla.");
          } catch (e: any) {
            Alert.alert("Chyba", e.message || "Nepodařilo se odeslat reset email.");
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
            <Button title={submitting ? "Odesílám..." : "Odeslat reset email"} onPress={() => handleSubmit()} disabled={submitting} />
            <Link href="/(auth)/sign-in" style={{ marginTop: 12 }}>Zpět na přihlášení</Link>
          </>
        )}
      </Formik>
    </View>
  );
}