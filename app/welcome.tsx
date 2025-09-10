import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  // Animace pro floating elementy
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  const float4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animace pro floating elementy
    const createFloatingAnimation = (animatedValue: Animated.Value, duration: number, delay: number = 0) => {
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

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      router.push('/(auth)/sign-in');
    } catch (error) {
      console.log('Error saving welcome status:', error);
      router.push('/(auth)/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#052e16', '#15803d', '#14532d']}
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
                    outputRange: [0, -40],
                  }),
                },
                {
                  translateX: float1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
                {
                  scale: float1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
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
                    outputRange: [0, -60],
                  }),
                },
                {
                  translateX: float2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  }),
                },
                {
                  scale: float2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
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
                    outputRange: [0, -30],
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

        {/* Hlavní obsah */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Beat Procrastination</Text>
            <Text style={styles.subtitle}>
              Stop scrolling, start doing. Let's build habits that stick and crush your to-do list.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Let's Get Started</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
              Your productive journey begins now.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 64,
    zIndex: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 52,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#bbf7d0',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15803d',
  },
  footerText: {
    fontSize: 12,
    color: '#86efac',
    textAlign: 'center',
    marginTop: 16,
  },
  // Floating background elementy
  floatingElement1: {
    position: 'absolute',
    left: -width * 0.33,
    top: -height * 0.25,
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    opacity: 0.6,
  },
  floatingElement2: {
    position: 'absolute',
    right: -width * 0.25,
    bottom: -height * 0.4,
    width: 700,
    height: 700,
    borderRadius: 350,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    opacity: 0.5,
  },
  floatingElement3: {
    position: 'absolute',
    bottom: height * 0.33,
    right: width * 0.25,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(15, 118, 110, 0.15)',
  },
  floatingElement4: {
    position: 'absolute',
    left: width * 0.25,
    top: height * 0.33,
    width: 224,
    height: 224,
    borderRadius: 112,
    backgroundColor: 'rgba(21, 128, 61, 0.15)',
  },
});