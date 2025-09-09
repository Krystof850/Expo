import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

export const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return <>{children}</>;
};