import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TitleText, DescriptionText } from '../../components/Text';
import { NextButton } from '../../components/Button';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

interface Goal {
  id: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const PROCRASTINATION_GOALS: Goal[] = [
  { id: 'better_time_management', text: 'Better time management', icon: 'time-outline', color: '#E53E3E' },
  { id: 'increased_productivity', text: 'Increased productivity', icon: 'trending-up-outline', color: '#4A90E2' },
  { id: 'reduced_stress', text: 'Reduced stress and anxiety', icon: 'happy-outline', color: '#F6E05E' },
  { id: 'better_focus', text: 'Better concentration and focus', icon: 'eye-outline', color: '#ED8936' },
  { id: 'goal_achievement', text: 'Achieving personal goals', icon: 'trophy-outline', color: '#9F7AEA' },
  { id: 'self_discipline', text: 'Strengthening self-discipline', icon: 'shield-checkmark-outline', color: '#38B2AC' },
  { id: 'work_life_balance', text: 'Better work-life balance', icon: 'library-outline', color: '#68D391' },
  { id: 'improve_confidence', text: 'Improve my confidence', icon: 'star-outline', color: '#FF6B6B' },
];

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      // Save selected goals
      await AsyncStorage.setItem('selected_goals', JSON.stringify(selectedGoals));
      console.log('🎯 Goals saved:', selectedGoals);
      
      // Pokračovat na referral
      router.push('/(onboarding)/referral');
    } catch (error) {
      console.log('Error saving goals:', error);
      // Continue to referral even on error
      router.push('/(onboarding)/referral');
    }
  };

  return (
    <AppBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.gradientStart} />
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.mainText} />
          </TouchableOpacity>
          <TitleText animated={false} style={styles.headerTitle}>Select Your Goals</TitleText>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Instructions */}
            <DescriptionText animated={false} style={styles.instructionText}>
              Select the goals you want to track during your journey to change.
            </DescriptionText>

            {/* Goals */}
            <View style={styles.goalsContainer}>
              {PROCRASTINATION_GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalItem,
                    { backgroundColor: goal.color },
                    selectedGoals.includes(goal.id) && styles.selectedGoalItem
                  ]}
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.goalContent}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={goal.icon} size={24} color="white" />
                    </View>
                    <Text style={styles.goalText}>
                      {goal.text}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.checkbox,
                    selectedGoals.includes(goal.id) && styles.selectedCheckbox
                  ]}>
                    {selectedGoals.includes(goal.id) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <NextButton
            title="Track These Goals"
            onPress={handleContinue}
            disabled={selectedGoals.length === 0}
            style={styles.continueButton}
          />
        </View>
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    paddingBottom: SPACING.small,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensation for back button
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: SPACING.page,
    paddingTop: 20,
  },
  instructionText: {
    textAlign: 'center',
    marginBottom: 32,
  },
  goalsContainer: {
    gap: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 24,
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedGoalItem: {
    opacity: 1,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  goalContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    lineHeight: 22,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckbox: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonContainer: {
    paddingHorizontal: SPACING.page,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
    // NextButton will handle its own styling
  },
});