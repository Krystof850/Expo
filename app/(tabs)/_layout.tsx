import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Dimensions, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function TabLayout() {
  // Block hardware back button on Android - only logout can exit protected zone
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          marginHorizontal: 10,
          backgroundColor: 'rgb(215, 220, 235)',
          borderRadius: 32,
          height: 60,
          paddingBottom: 4,
          paddingTop: 4,
          paddingHorizontal: 6,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.05)',
          ...Platform.select({
            ios: {
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 20,
              backdropFilter: 'blur(20px)',
            },
            android: {
              elevation: 12,
            },
          }),
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 4,
          paddingHorizontal: 16,
          borderRadius: 28,
        },
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 1,
        },
        tabBarIconStyle: {
          marginBottom: 1,
        },
        tabBarLabelPosition: 'below-icon',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "bar-chart" : "bar-chart-outline"} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}