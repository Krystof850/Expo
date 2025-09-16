import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function ProcrastinationInput() {
  const [procrastinationText, setProcrastinationText] = useState('');
  const insets = useSafeAreaInsets();

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleUnloopMe = async () => {
    if (!procrastinationText.trim()) {
      return; // Don't proceed if input is empty
    }
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Pass the procrastination text to the next screen
    router.push({
      pathname: '/(workflow)/task-timer',
      params: { procrastinationText: procrastinationText.trim() }
    });
  };

  return (
    <LinearGradient
      colors={['#E0F2FE', '#BFDBFE', '#93C5FD', '#BFDBFE', '#E0F2FE']}
      style={styles.container}
      locations={[0, 0.25, 0.5, 0.75, 1]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
          
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back-ios" size={24} color="#0C4A6E" />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>What are you procrastinating with?</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={procrastinationText}
                onChangeText={setProcrastinationText}
                placeholder="Lying on the couch when I should go to the gym..."
                placeholderTextColor="rgba(100, 116, 139, 0.6)"
                multiline
                textAlignVertical="top"
                maxLength={200}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.unloopButton,
                !procrastinationText.trim() && styles.unloopButtonDisabled
              ]} 
              onPress={handleUnloopMe}
              disabled={!procrastinationText.trim()}
            >
              <Text style={styles.unloopButtonText}>Unloop Me</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#082F49',
    textAlign: 'center',
    marginBottom: 48,
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 32,
  },
  textInput: {
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    color: '#082F49',
    fontWeight: '500',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 0,
  },
  unloopButton: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#0284C7',
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: 'rgba(2, 132, 199, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  unloopButtonDisabled: {
    backgroundColor: 'rgba(2, 132, 199, 0.5)',
    shadowOpacity: 0.3,
  },
  unloopButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});