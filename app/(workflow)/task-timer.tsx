import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export default function TaskTimer() {
  const { procrastinationText } = useLocalSearchParams<{ procrastinationText: string }>();
  const insets = useSafeAreaInsets();
  
  // Timer state (3 minutes = 180 seconds)
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [microTask, setMicroTask] = useState('');

  // Animation values
  const timerProgress = useSharedValue(1);

  useEffect(() => {
    if (procrastinationText) {
      generateMicroTask(procrastinationText);
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

  const generateMicroTask = (procrastination: string) => {
    // Simple AI-like logic to break down procrastination into micro-task
    const lowerText = procrastination.toLowerCase();
    
    let task = '';
    
    // Common procrastination patterns and their micro-tasks
    if (lowerText.includes('gym') || lowerText.includes('workout') || lowerText.includes('exercise')) {
      task = 'Put away your phone and pack your gym bag';
    } else if (lowerText.includes('study') || lowerText.includes('homework') || lowerText.includes('learn')) {
      task = 'Clear your desk and open your study materials';
    } else if (lowerText.includes('work') || lowerText.includes('project') || lowerText.includes('task')) {
      task = 'Close all distracting tabs and write one sentence about your project';
    } else if (lowerText.includes('clean') || lowerText.includes('tidy') || lowerText.includes('organize')) {
      task = 'Pick up just 5 items and put them in their proper place';
    } else if (lowerText.includes('read') || lowerText.includes('book')) {
      task = 'Find your book and read just the first paragraph';
    } else if (lowerText.includes('cook') || lowerText.includes('meal') || lowerText.includes('food')) {
      task = 'Get out one cooking ingredient and place it on the counter';
    } else if (lowerText.includes('phone') || lowerText.includes('social') || lowerText.includes('scroll')) {
      task = 'Put your phone in another room and take 3 deep breaths';
    } else if (lowerText.includes('call') || lowerText.includes('email') || lowerText.includes('message')) {
      task = 'Open your contacts and find the person you need to reach';
    } else {
      // Default micro-task for any procrastination
      task = 'Stand up, take 3 deep breaths, and prepare your workspace';
    }
    
    setMicroTask(task);
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
    
    router.push({
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
    
    router.push({
      pathname: '/(workflow)/task-complete',
      params: { 
        success: 'false',
        task: microTask,
        timeSpent: (180 - timeLeft).toString()
      }
    });
  };

  const handleTimeUp = () => {
    // Automatically handle when time runs out
    handleTaskFailed();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Animated styles for timer circle
  const timerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      timerProgress.value,
      [0, 1],
      [0, 1]
    );
    
    return {
      transform: [{ scale }],
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
          <Text style={styles.taskTitle}>{microTask}</Text>
          
          {/* Timer Circle - Simplified for React Native */}
          <View style={styles.timerContainer}>
            <View style={styles.timerCircleBg} />
            <Animated.View style={[styles.timerProgress, timerAnimatedStyle]} />
            
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
  timerCircleBg: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 20,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timerProgress: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 20,
    borderColor: '#0284C7',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
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