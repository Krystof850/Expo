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

interface Symptom {
  id: string;
  text: string;
}

const PROCRASTINATION_SYMPTOMS: Symptom[] = [
  { id: 'overwhelmed', text: 'Cítím se zahlcený úkoly' },
  { id: 'lack_motivation', text: 'Nedostatek motivace začít projekty' },
  { id: 'difficulty_concentrating', text: 'Obtížné soustředění na důležitou práci' },
  { id: 'easy_tasks_priority', text: 'Dávám přednost snadným úkolům před důležitými' },
  { id: 'guilt_feelings', text: 'Chronické pocity viny kvůli odložené práci' },
  { id: 'perfectionism', text: 'Perfekcionismus vedoucí k odkladům' },
  { id: 'fear_of_failure', text: 'Strach z neúspěchu brání jednání' },
  { id: 'time_management', text: 'Obtíže s řízením času' },
];

export default function SymptomsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const handleContinue = async () => {
    try {
      // Uložit vybrané symptomy
      await AsyncStorage.setItem('selected_symptoms', JSON.stringify(selectedSymptoms));
      console.log('💾 Symptoms saved:', selectedSymptoms);
      
      // Pokračovat na goals
      router.push('/(onboarding)/goals');
    } catch (error) {
      console.log('Error saving symptoms:', error);
      // I při chybě pokračovat na goals
      router.push('/(onboarding)/goals');
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
          <Text style={styles.headerTitle}>Symptomy</Text>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Prokrastinace může mít negativní dopady na váš osobní a profesní život.
              </Text>
            </View>

            {/* Instructions */}
            <Text style={styles.instructionText}>
              Vyberte jakékoliv symptomy níže:
            </Text>

            {/* Mental Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mentální</Text>
              
              <View style={styles.symptomsContainer}>
                {PROCRASTINATION_SYMPTOMS.map((symptom) => (
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
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Restartovat můj mozek
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
  infoBox: {
    backgroundColor: '#E53E3E',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.mainText,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.mainText,
    marginBottom: 16,
  },
  symptomsContainer: {
    gap: 12,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  selectedSymptomItem: {
    backgroundColor: '#E53E3E',
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
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.mainText,
    lineHeight: 22,
  },
  selectedSymptomText: {
    color: 'white',
  },
  buttonContainer: {
    paddingHorizontal: SPACING.page,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
});