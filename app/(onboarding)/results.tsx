import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { COLORS, SPACING } from '@/constants/theme';

export default function ResultsScreen() {
  const handleContinue = () => {
    // Pro teď přejdeme na auth screens
    router.push('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradientStart} />
      
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
        style={styles.gradient}
      >
        <OnboardingHeader 
          onBack={() => router.back()}
          showProgress={false}
        />

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.titleText}>
                Analýza dokončena ✓
              </Text>
              <Text style={styles.subtitleText}>
                Máme pro vás některé poznatky...
              </Text>
            </View>

            {/* Result Statement */}
            <View style={styles.resultSection}>
              <Text style={styles.resultText}>
                Vaše odpovědi ukazují na{'\n'}
                <Text style={styles.highlightText}>významnou tendenci k prokrastinaci*</Text>
              </Text>
            </View>

            {/* Chart Section */}
            <View style={styles.chartSection}>
              <View style={styles.chartContainer}>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, styles.yourScoreBar]}>
                    <Text style={styles.barPercentage}>78%</Text>
                  </View>
                  <Text style={styles.barLabel}>Vaše skóre</Text>
                </View>
                
                <View style={styles.barContainer}>
                  <View style={[styles.bar, styles.averageBar]}>
                    <Text style={styles.barPercentage}>45%</Text>
                  </View>
                  <Text style={styles.barLabel}>Průměr</Text>
                </View>
              </View>
              
              <Text style={styles.comparisonText}>
                <Text style={styles.percentageHighlight}>78%</Text> vyšší tendence k prokrastinaci 📊
              </Text>
            </View>

            {/* Disclaimer */}
            <Text style={styles.disclaimerText}>
              * Tento výsledek je pouze orientační, nejedná se o lékařskou diagnózu.
            </Text>
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
              Zjistěte více o vašich návycích
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerSection: {
    width: '100%',
    maxWidth: 384,
    alignItems: 'center',
    marginBottom: 32,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.questionLabel,
    textAlign: 'center',
    lineHeight: 24,
  },
  resultSection: {
    width: '100%',
    maxWidth: 384,
    alignItems: 'center',
    marginBottom: 48,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.mainText,
    textAlign: 'center',
    lineHeight: 28,
  },
  highlightText: {
    fontWeight: '700',
    color: COLORS.mainText,
  },
  chartSection: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    marginBottom: 32,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 60,
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  yourScoreBar: {
    height: 156, // 78% of 200px
    backgroundColor: '#E53E3E', // Red color for higher score
  },
  averageBar: {
    height: 90, // 45% of 200px  
    backgroundColor: '#38A169', // Green color for average
  },
  barPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  barLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.questionLabel,
    textAlign: 'center',
  },
  comparisonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.questionLabel,
    textAlign: 'center',
    lineHeight: 24,
  },
  percentageHighlight: {
    color: '#E53E3E',
    fontWeight: '700',
  },
  disclaimerText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingHorizontal: SPACING.page,
    paddingBottom: 40,
    zIndex: 10,
  },
  continueButton: {
    backgroundColor: '#4A90E2',
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