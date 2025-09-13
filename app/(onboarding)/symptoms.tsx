import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingHeader, OnboardingHeaderRef } from '../../components/OnboardingHeader';
import { AnimatedQuestionPage, AnimatedContent, AnimatedQuestionPageRef } from '../../components/AnimatedQuestionPage';
import { TitleText, DescriptionText } from '../../components/Text';
import { NextButton } from '../../components/Button';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme';

interface Symptom {
  id: string;
  text: string;
}

const PROCRASTINATION_SYMPTOMS: Symptom[] = [
  { id: 'overwhelmed', text: 'I feel overwhelmed by tasks' },
  { id: 'lack_motivation', text: 'Lack of motivation to start projects' },
  { id: 'difficulty_concentrating', text: 'Difficulty concentrating on important work' },
  { id: 'easy_tasks_priority', text: 'I prioritize easy tasks over important ones' },
  { id: 'guilt_feelings', text: 'Chronic feelings of guilt about postponed work' },
  { id: 'perfectionism', text: 'Perfectionism leading to delays' },
  { id: 'fear_of_failure', text: 'Fear of failure preventing action' },
  { id: 'time_management', text: 'Difficulties with time management' },
];

export default function SymptomsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const animationRef = useRef<AnimatedQuestionPageRef>(null);
  const headerRef = useRef<OnboardingHeaderRef>(null);

  // Block hardware back button on Android only
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') {
        return; // BackHandler only works on Android
      }
      
      const onBackPress = () => {
        return true; // Block hardware back
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const handleBack = () => {
    // Run header exit animation first, then content exit animation
    headerRef.current?.runExitAnimation(() => {
      animationRef.current?.runExitAnimation(() => {
        router.back();
      });
    });
  };

  const handleContinue = async () => {
    // Run header exit animation first, then content exit animation
    headerRef.current?.runExitAnimation(() => {
      animationRef.current?.runExitAnimation(async () => {
        try {
          // Save selected symptoms
          await AsyncStorage.setItem('selected_symptoms', JSON.stringify(selectedSymptoms));
          console.log('💾 Symptoms saved:', selectedSymptoms);
          
          // Continue to trap page
          router.push('/(onboarding)/trap');
        } catch (error) {
          console.log('Error saving symptoms:', error);
          // Continue to trap page even on error
          router.push('/(onboarding)/trap');
        }
      });
    });
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Header with progress bar */}
        <OnboardingHeader 
          ref={headerRef}
          step={11} 
          total={15} 
          questionLabel="Symptoms"
          onBackPress={handleBack}
        />
        
        {/* Animated content wrapper */}
        <AnimatedQuestionPage ref={animationRef}>
          <View style={styles.content}>
            <AnimatedContent delay={100}>
              {/* Info Box - Keep red color */}
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Procrastination can have negative impacts on your personal and professional life.
                </Text>
              </View>
            </AnimatedContent>

            <AnimatedContent delay={200}>
              {/* Instructions */}
              <View style={styles.questionSection}>
                <TitleText animated={false}>Select any symptoms below:</TitleText>
              </View>
            </AnimatedContent>

            <AnimatedContent delay={300}>
              {/* Mental Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mental</Text>
                
                <ScrollView 
                  style={styles.scrollContainer}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.symptomsContainer}>
                    {PROCRASTINATION_SYMPTOMS.map((symptom, index) => (
                      <TouchableOpacity
                        key={symptom.id}
                        style={[
                          styles.symptomItem,
                          selectedSymptoms.includes(symptom.id) && styles.selectedSymptomItem
                        ]}
                        onPress={() => toggleSymptom(symptom.id)}
                        activeOpacity={0.8}
                      >
                        <View style={[
                          styles.checkbox,
                          selectedSymptoms.includes(symptom.id) && styles.selectedCheckbox
                        ]}>
                          {selectedSymptoms.includes(symptom.id) && (
                            <Ionicons name="checkmark" size={16} color="white" />
                          )}
                        </View>
                        <Text style={[
                          styles.symptomText,
                          selectedSymptoms.includes(symptom.id) && styles.selectedSymptomText
                        ]}>
                          {symptom.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </AnimatedContent>
          </View>
        </AnimatedQuestionPage>
        
        {/* Next button - OUTSIDE of animation wrapper */}
        <View style={[styles.nextContainer, { paddingBottom: insets.bottom + SPACING.page }]}>
          <NextButton
            title="Restart My Brain"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.page,
    paddingTop: 8,
    paddingBottom: 120, // Space for Next button to prevent overlap
  },
  infoBox: {
    backgroundColor: '#E53E3E', // Keep red color as requested
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 32,
    ...SHADOWS.text, // Add consistent shadow
  },
  infoText: {
    ...TYPOGRAPHY.description, // Use consistent typography
    fontSize: 16, // Slightly smaller to match other pages
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
  questionSection: {
    width: '100%',
    maxWidth: 384, // Same as other question pages
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title, // Use consistent typography
    fontSize: 20, // Same as other titles
    fontWeight: '700',
    color: COLORS.mainText,
    marginBottom: 16,
    textAlign: 'left',
    ...SHADOWS.text, // Add text shadow for consistency
  },
  scrollContainer: {
    maxHeight: 300, // Limit height to prevent overflow
  },
  scrollContent: {
    paddingBottom: 10,
  },
  symptomsContainer: {
    gap: 12,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.selectButton.background, // Use consistent button style
    borderWidth: 2,
    borderColor: COLORS.selectButton.border, // Use consistent border
    borderRadius: 50, // Same as other buttons
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  selectedSymptomItem: {
    backgroundColor: '#E53E3E', // Keep red color as requested
    borderColor: '#E53E3E',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckbox: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'white',
  },
  symptomText: {
    flex: 1,
    ...TYPOGRAPHY.buttonSelect, // Use consistent typography
    fontSize: 16, // Slightly smaller to fit better
    fontWeight: '600',
    color: COLORS.mainText,
    lineHeight: 20,
  },
  selectedSymptomText: {
    color: 'white',
  },
  nextContainer: {
    paddingHorizontal: SPACING.page,
    zIndex: 10,
  },
  continueButton: {
    backgroundColor: '#E53E3E', // Keep red color as requested
  },
});