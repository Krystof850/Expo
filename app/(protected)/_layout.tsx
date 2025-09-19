import { Stack } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, Platform } from 'react-native';
import React from 'react';

export default function ProtectedLayout() {
  // Block hardware back button on Android and gesture navigation
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') {
        return; // BackHandler only works on Android
      }
      
      const onBackPress = () => {
        return true; // Block hardware back - only logout can exit protected zone
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        fullScreenGestureEnabled: false, // Disable swipe gestures to go back
        gestureEnabled: false, // Disable all gesture navigation
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}