import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ProgressService } from '../../src/services/progressService';
import { useAuth } from '../../src/context/AuthContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export default function TaskComplete() {
  const { success, task, timeSpent } = useLocalSearchParams<{ 
    success: string;
    task: string;
    timeSpent: string;
  }>();
  
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isSuccess = success === 'true';
  
  // Animation values
  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Play haptic feedback based on result
    if (isSuccess) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Track successful task completion for temptations overcome stat
      if (user?.uid) {
        ProgressService.trackTemptationOvercome(user.uid);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Start animations
    setTimeout(() => {
      iconScale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
      
      if (isSuccess) {
        iconRotation.value = withSpring(360);
      }
      
      contentOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    }, 100);
  }, [isSuccess, user?.uid]);

  const handleBackToHome = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate back to the protected homepage (tabs)
    router.replace('/(tabs)');
  };

  const formatTimeSpent = (seconds: string): string => {
    const totalSeconds = parseInt(seconds) || 0;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Animated styles
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: iconScale.value },
        { rotate: `${iconRotation.value}deg` }
      ],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [
        { translateY: (1 - contentOpacity.value) * 20 }
      ],
    };
  });

  return (
    <LinearGradient
      colors={['#E0F2FE', '#BFDBFE', '#93C5FD', '#BFDBFE', '#E0F2FE']}
      style={styles.container}
      locations={[0, 0.25, 0.5, 0.75, 1]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        
        {/* Main Content */}
        <View style={styles.mainContent}>
          
          {/* Result Icon */}
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <View style={[
              styles.iconCircle,
              { backgroundColor: isSuccess ? '#34D399' : '#F87171' }
            ]}>
              <Ionicons 
                name={isSuccess ? 'checkmark' : 'close'} 
                size={80} 
                color="#FFFFFF" 
              />
            </View>
          </Animated.View>

          {/* Result Content */}
          <Animated.View style={[styles.resultContent, contentAnimatedStyle]}>
            <Text style={styles.resultTitle}>
              {isSuccess ? 'Task Complete!' : 'Better Luck Next Time!'}
            </Text>
            
            <Text style={styles.resultMessage}>
              {isSuccess 
                ? "Now that you've started, just keep going. You feel motivated when taking action, not otherwise."
                : "Don't worry! Every attempt gets you closer to breaking the procrastination cycle. Try again when you're ready."
              }
            </Text>

            {/* Task Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryLabel}>Task:</Text>
              <Text style={styles.summaryText}>{task}</Text>
              
              <Text style={styles.summaryLabel}>Time spent:</Text>
              <Text style={styles.summaryText}>{formatTimeSpent(timeSpent || '0')}</Text>
            </View>
          </Animated.View>

          {/* Back to Home Button */}
          <Animated.View style={[styles.buttonContainer, contentAnimatedStyle]}>
            <TouchableOpacity 
              style={[
                styles.homeButton,
                { backgroundColor: isSuccess ? '#0284C7' : '#6B7280' }
              ]} 
              onPress={handleBackToHome}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  resultContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#082F49',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resultMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0C4A6E',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 24,
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C4A6E',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#082F49',
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  homeButton: {
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: 'rgba(2, 132, 199, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  homeButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});