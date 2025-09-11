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
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '@/constants/theme';

interface Goal {
  id: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const PROCRASTINATION_GOALS: Goal[] = [
  { id: 'better_time_management', text: 'Lepší řízení času', icon: 'time-outline', color: '#E53E3E' },
  { id: 'increased_productivity', text: 'Zvýšená produktivita', icon: 'trending-up-outline', color: '#4A90E2' },
  { id: 'reduced_stress', text: 'Snížený stres a úzkost', icon: 'happy-outline', color: '#F6E05E' },
  { id: 'better_focus', text: 'Lepší koncentrace a soustředění', icon: 'eye-outline', color: '#ED8936' },
  { id: 'goal_achievement', text: 'Dosahování osobních cílů', icon: 'trophy-outline', color: '#9F7AEA' },
  { id: 'self_discipline', text: 'Posílení sebedisciplíny', icon: 'shield-checkmark-outline', color: '#38B2AC' },
  { id: 'work_life_balance', text: 'Lepší work-life balance', icon: 'library-outline', color: '#68D391' },
];

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  const handleContinue = async () => {
    try {
      // Uložit vybrané cíle
      await AsyncStorage.setItem('selected_goals', JSON.stringify(selectedGoals));
      console.log('🎯 Goals saved:', selectedGoals);
      
      // Pokračovat na referral
      router.push('/(onboarding)/referral');
    } catch (error) {
      console.log('Error saving goals:', error);
      // I při chybě pokračovat na referral
      router.push('/(onboarding)/referral');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradientStart} />
      
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.mainText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vyberte své cíle</Text>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Instructions */}
            <Text style={styles.instructionText}>
              Vyberte cíle, které chcete sledovat během{'\n'}vaší cesty za změnou.
            </Text>

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
          <TouchableOpacity 
            style={[
              styles.continueButton,
              selectedGoals.length === 0 && styles.disabledButton
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={selectedGoals.length === 0}
          >
            <Text style={[
              styles.continueButtonText,
              selectedGoals.length === 0 && styles.disabledButtonText
            ]}>
              Sledovat tyto cíle
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradientStart,
  },
  gradient: {
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
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginRight: 40, // Kompenzace pro back button
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
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.questionLabel,
    textAlign: 'center',
    lineHeight: 24,
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
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowOpacity: 0.1,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gradientEnd,
    textAlign: 'center',
  },
  disabledButtonText: {
    color: 'rgba(70, 130, 180, 0.5)',
  },
});