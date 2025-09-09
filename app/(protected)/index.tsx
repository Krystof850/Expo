import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { Protected } from "../../src/components/Protected";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <Protected>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Text style={{ fontSize: 20 }}>Ahoj, {user?.email}</Text>
        <Button title="Odhlásit" onPress={logout} />
      </View>
    </Protected>
  );
}