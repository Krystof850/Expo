import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { Protected } from "../../src/components/Protected";

export default function Home() {
  const { user, logout } = useAuth();

  const handleShowPaywall = () => {
    Alert.alert(
      "Paywall", 
      "Pro Expo Go verzi je paywall zakázán. Používejte development build pro plnou funkcionalitat.",
      [
        { text: "OK", style: "default" }
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
            Získejte přístup k pokročilým funkcím pro zvýšení produktivity.
          </Text>
          <Button 
            title="Zobrazit Paywall (Demo)" 
            onPress={handleShowPaywall}
            color="#007AFF"
          />
          <Text style={styles.templateInfo}>
            Pozn.: Paywall je zakázán v Expo Go
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
  templateInfo: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  logoutSection: {
    marginTop: 20,
  },
});