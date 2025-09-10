import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { Protected } from "../../src/components/Protected";

export default function Home() {
  const { user, logout } = useAuth();

  const handleShowPaywall = () => {
    Alert.alert(
      "Paywall Demo", 
      "Toto je demo verze. Pro plnou funkcionalnost s paywallem použijte development build.",
      [
        { text: "Simulovat nákup", onPress: () => Alert.alert("Simulace", "Předplatné aktivováno!") },
        { text: "Zrušit", style: "cancel" }
      ]
    );
  };

  return (
    <Protected>
      <View style={styles.container}>
        <Text style={styles.title}>Vítejte v chráněné oblasti!</Text>
        <Text style={styles.email}>Přihlášen jako: {user?.email}</Text>
        
        <View style={styles.paywallSection}>
          <Text style={styles.subtitle}>Prémiové funkce</Text>
          <Text style={styles.description}>
            Pro přístup k prémiové funkcím potřebujete předplatné.
          </Text>
          <Button 
            title="Demo prémiové funkce" 
            onPress={handleShowPaywall}
            color="#007AFF"
          />
        </View>

        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Expo Go verze:</Text>
          <Text style={styles.debugText}>
            Paywall je zakázán pro kompatibilitu s Expo Go
          </Text>
        </View>
        
        <View style={styles.logoutSection}>
          <Button title="Odhlásit se" onPress={logout} color="#FF3B30" />
        </View>
      </View>
    </Protected>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  paywallSection: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    marginBottom: 16,
    color: "#666",
  },
  debugInfo: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    maxWidth: 300,
  },
  debugTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  logoutSection: {
    marginTop: 20,
  },
});