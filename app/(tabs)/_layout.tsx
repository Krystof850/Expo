import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 8,
          right: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: 50,
          height: 64,
          paddingBottom: 4,
          paddingTop: 4,
          paddingHorizontal: 4,
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
          paddingVertical: 6,
          paddingHorizontal: 20,
          borderRadius: 50,
        },
        tabBarActiveTintColor: '#0284C7',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
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
              size={30} 
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
              size={30} 
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
              size={30} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}