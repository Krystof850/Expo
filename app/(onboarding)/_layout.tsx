import React, { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

function SharedBackground() {
  // Floating animace
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  const float4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animace pro floating elementy - jemné pohyby
    const createFloatingAnimation = (animatedValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    // Spuštění animací s různými délkami a zpožděními
    setTimeout(() => createFloatingAnimation(float1, 4000).start(), 0);
    setTimeout(() => createFloatingAnimation(float2, 5000).start(), 1000);
    setTimeout(() => createFloatingAnimation(float3, 6000).start(), 2000);
    setTimeout(() => createFloatingAnimation(float4, 4500).start(), 3000);
  }, []);

  return (
    <View style={styles.backgroundContainer}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#3B82F6', '#1E40AF', '#1E3A8A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Floating background elementy */}
        <Animated.View
          style={[
            styles.floatingElement1,
            {
              transform: [
                {
                  translateY: float1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  }),
                },
                {
                  translateX: float1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15],
                  }),
                },
                {
                  scale: float1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.View
          style={[
            styles.floatingElement2,
            {
              transform: [
                {
                  translateY: float2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -40],
                  }),
                },
                {
                  translateX: float2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
                {
                  scale: float2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.08],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.floatingElement3,
            {
              transform: [
                {
                  translateY: float3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.floatingElement4,
            {
              transform: [
                {
                  translateY: float4.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -25],
                  }),
                },
              ],
            },
          ]}
        />
      </LinearGradient>
    </View>
  );
}

export default function OnboardingLayout() {
  return (
    <View style={styles.container}>
      {/* Shared static background */}
      <SharedBackground />
      
      {/* Content with transparent background and fade transitions */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
          animation: 'fade',
          animationDuration: 300,
        }}
      >
        <Stack.Screen name="question1" />
        <Stack.Screen name="question2" />
        <Stack.Screen name="question3" />
        <Stack.Screen name="question4" />
        <Stack.Screen name="question5" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  // Floating background elementy
  floatingElement1: {
    position: 'absolute',
    left: -width * 0.3,
    top: -height * 0.2,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    opacity: 0.6,
  },
  floatingElement2: {
    position: 'absolute',
    right: -width * 0.2,
    bottom: -height * 0.3,
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(30, 64, 175, 0.15)',
    opacity: 0.5,
  },
  floatingElement3: {
    position: 'absolute',
    bottom: height * 0.3,
    right: width * 0.2,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
  },
  floatingElement4: {
    position: 'absolute',
    left: width * 0.2,
    top: height * 0.35,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
  },
});