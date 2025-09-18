import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { generateMicroTask } from '../../src/utils/openai';
import { TemptationService } from '../../src/services/temptationService';
import { useAuth } from '../../src/context/AuthContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TaskTimer() {
  const { procrastinationText } = useLocalSearchParams<{ procrastinationText: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  // Timer state (3 minutes = 180 seconds)
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [microTask, setMicroTask] = useState('');
  const [isGeneratingTask, setIsGeneratingTask] = useState(true);

  // Animation values
  const timerProgress = useSharedValue(1);

  useEffect(() => {
    if (procrastinationText) {
      generateTask(procrastinationText);
    }
  }, [procrastinationText]);

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        // Update progress animation (from 1 to 0)
        timerProgress.value = withTiming(newTime / 180, { duration: 1000 });
        
        if (newTime <= 0) {
          setIsTimerRunning(false);
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const generateTask = async (procrastination: string) => {
    try {
      setIsGeneratingTask(true);
      const aiTask = await generateMicroTask(procrastination);
      setMicroTask(aiTask);
      
      // Track temptation generation for time of day statistics
      if (user?.uid) {
        await TemptationService.trackTemptationGenerated(user.uid);
      }
    } catch (error) {
      console.error('Failed to generate AI task:', error);
      // Fallback is handled in the generateMicroTask function
    } finally {
      setIsGeneratingTask(false);
    }
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      'Stop Timer?',
      'Are you sure you want to go back? Your progress will be lost.',
      [
        {
          text: 'Continue Timer',
          style: 'cancel',
        },
        {
          text: 'Go Back',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleTaskCompleted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsTimerRunning(false);
    
    router.replace({
      pathname: '/(workflow)/task-complete',
      params: { 
        success: 'true',
        task: microTask,
        timeSpent: (180 - timeLeft).toString()
      }
    });
  };

  const handleTaskFailed = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsTimerRunning(false);
    
    router.replace({
      pathname: '/(workflow)/task-complete',
      params: { 
        success: 'false',
        task: microTask,
        timeSpent: (180 - timeLeft).toString()
      }
    });
  };

  const handleTimeUp = () => {
    // Automatically handle when time runs out and add timeout haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    router.replace({
      pathname: '/(workflow)/task-complete',
      params: { 
        success: 'false',
        task: microTask,
        timeSpent: (180 - timeLeft).toString()
      }
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Constants for circle progress
  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  // Animated props for SVG circle progress
  const circleAnimatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      timerProgress.value,
      [1, 0], // From full (1) to empty (0)
      [0, circumference] // From 0 offset (full circle) to full circumference offset (empty circle)
    );
    
    return {
      strokeDashoffset,
    };
  });

  return (
    <LinearGradient
      colors={['#E0F2FE', '#BFDBFE', '#93C5FD', '#BFDBFE', '#E0F2FE']}
      style={styles.container}
      locations={[0, 0.25, 0.5, 0.75, 1]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#0C4A6E" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {isGeneratingTask ? (
            <View style={styles.generatingContainer}>
              <Text style={styles.generatingText}>Generating your micro-task...</Text>
            </View>
          ) : (
            <Text style={styles.taskTitle}>{microTask}</Text>
          )}
          
          {/* Timer Circle with SVG Progress */}
          <View style={styles.timerContainer}>
            <Svg width={220} height={220} style={styles.svgTimer}>
              {/* Background circle */}
              <Circle
                cx={110}
                cy={110}
                r={100}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={20}
                fill="none"
              />
              {/* Animated progress circle */}
              <AnimatedCircle
                cx={110}
                cy={110}
                r={radius}
                stroke="#0284C7"
                strokeWidth={20}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animatedProps={circleAnimatedProps}
                transform="rotate(-90 110 110)"
              />
            </Svg>
            
            <View style={styles.timerContent}>
              <Text style={styles.timerTime}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>remaining</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.completedButton} 
              onPress={handleTaskCompleted}
            >
              <Text style={styles.completedButtonText}>Task Completed</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.failedButton} 
              onPress={handleTaskFailed}
            >
              <Text style={styles.failedButtonText}>Task Failed</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    alignItems: 'flex-start',
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 40,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#082F49',
    textAlign: 'center',
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timerContainer: {
    position: 'relative',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgTimer: {
    position: 'absolute',
  },
  generatingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  generatingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C4A6E',
    textAlign: 'center',
  },
  timerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTime: {
    fontSize: 48,
    fontWeight: '800',
    color: '#082F49',
    letterSpacing: -2,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0C4A6E',
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 340,
    gap: 16,
  },
  completedButton: {
    backgroundColor: '#34D399',
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: 'rgba(52, 211, 153, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  completedButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  failedButton: {
    backgroundColor: '#F87171',
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: 'rgba(248, 113, 113, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  failedButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});