import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { Protected } from "../../src/components/Protected";
import { usePlacement, useSuperwallEvents } from "expo-superwall";

export default function Home() {
  const { user, logout } = useAuth();
  
  // Hook pro zobrazení paywallu
  const { registerPlacement, state } = usePlacement({
    onError: (error) => {
      console.error("[Superwall] Placement error:", error);
      Alert.alert("Chyba", "Nepodařilo se zobrazit paywall.");
    },
    onPresent: (info) => {
      console.log("[Superwall] Paywall presented:", info);
    },
    onDismiss: (info, result) => {
      console.log("[Superwall] Paywall dismissed:", info, result);
      
      if (result.purchased) {
        Alert.alert("Děkujeme za nákup!", "Nyní máte přístup ke všem prémiových funkcím!");
      } else if (result.restored) {
        Alert.alert("Nákup obnoven", "Vaše předplatné bylo úspěšně obnoveno!");
      }
    }
  });
  
  // Listener pro obecné Superwall events
  useSuperwallEvents({
    onSuperwallEvent: (eventInfo) => {
      console.log("[Superwall] Event:", eventInfo.event, eventInfo.params);
    },
    onSubscriptionStatusChange: (newStatus) => {
      console.log("[Superwall] Subscription status changed:", newStatus.status);
    }
  });

  const handleShowPaywall = async () => {
    try {
      console.log("[Superwall] Registering placement: example-paywall-e1c0-2025-06-16");
      await registerPlacement({ 
        placement: "example-paywall-e1c0-2025-06-16",
        params: { 
          feature: "premium_access",
          userId: user?.uid || "anonymous",
          userEmail: user?.email || "anonymous"
        }
      });
    } catch (error) {
      console.error("[Superwall] Error registering placement:", error);
      Alert.alert(
        "Chyba", 
        "Nepodařilo se zobrazit paywall. Zkontrolujte konzoli pro více informací."
      );
    }
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
            title="Zobrazit Example Paywall" 
            onPress={handleShowPaywall}
            color="#007AFF"
          />
          <Text style={styles.templateInfo}>
            Paywall: example-paywall-e1c0-2025-06-16
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