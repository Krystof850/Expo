import React from 'react';
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
import { COLORS, SPACING } from '@/constants/theme';

interface Review {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rating: number;
  review: string;
}

const CLIENT_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Jakub Novák',
    username: '@jakub_novak',
    avatar: '👨‍💻',
    rating: 5,
    review: 'Tato aplikace mi změnila život! Už 2 měsíce dokážu dokončovat projekty na čas. Systém sledování prokrastinace mi pomohl pochopit moje návyky.'
  },
  {
    id: '2', 
    name: 'Anna Svobodová',
    username: '@anna_codes',
    avatar: '👩‍🎓',
    rating: 5,
    review: 'Zpočátku jsem byla skeptická, ale funkce pro boj s prokrastinací skutečně fungují. Konečně dokážu psát diplomku bez nekonečného odkládání!'
  },
  {
    id: '3',
    name: 'Tomáš Černý',
    username: '@tomas_productivity',
    avatar: '👨‍💼',
    rating: 5,
    review: 'Nejlepší investice do mé produktivity. Aplikace mi pomohla identifikovat mé prokrastinační vzory a vybudovat lepší pracovní návyky.'
  }
];

export default function RatingScreen() {
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    // Pokračovat na auth
    router.push('/(auth)/sign-in');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
        style={{ marginRight: 2 }}
      />
    ));
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
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>
                Ohodnoťte nás
              </Text>
              
              {/* Stars with decoration */}
              <View style={styles.starsContainer}>
                <Text style={styles.starDecoration}>🌟</Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={32}
                      color="#FFD700"
                      style={{ marginHorizontal: 2 }}
                    />
                  ))}
                </View>
                <Text style={styles.starDecoration}>🌟</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionText}>
                Tato aplikace byla navržena pro lidi{'\n'}jako jste vy.
              </Text>
              
              {/* User avatars and count */}
              <View style={styles.usersContainer}>
                <View style={styles.avatarsRow}>
                  <Text style={styles.avatar}>👨‍💻</Text>
                  <Text style={styles.avatar}>👩‍🎓</Text>
                  <Text style={styles.avatar}>👨‍💼</Text>
                </View>
                <Text style={styles.usersCount}>+ 50 000 lidí</Text>
              </View>
            </View>

            {/* Reviews */}
            <View style={styles.reviewsSection}>
              {CLIENT_REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <View style={styles.avatarContainer}>
                        <Text style={styles.reviewAvatar}>{review.avatar}</Text>
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{review.name}</Text>
                        <Text style={styles.userHandle}>{review.username}</Text>
                      </View>
                    </View>
                    <View style={styles.ratingContainer}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  
                  <Text style={styles.reviewText}>
                    "{review.review}"
                  </Text>
                </View>
              ))}
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
              Další
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
    paddingHorizontal: SPACING.page,
    paddingBottom: SPACING.small,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
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
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  starDecoration: {
    fontSize: 24,
  },
  starsRow: {
    flexDirection: 'row',
  },
  descriptionSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.questionLabel,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  usersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarsRow: {
    flexDirection: 'row',
    gap: -8,
  },
  avatar: {
    fontSize: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  usersCount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.questionLabel,
  },
  reviewsSection: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  reviewAvatar: {
    fontSize: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.mainText,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.questionLabel,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.mainText,
    lineHeight: 22,
    fontStyle: 'italic',
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
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gradientEnd,
    textAlign: 'center',
  },
});