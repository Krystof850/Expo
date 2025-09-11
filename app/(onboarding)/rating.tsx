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
    // Pokračovat na signature
    router.push('/(onboarding)/signature');
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
              
              {/* Stars with elegant decoration */}
              <View style={styles.starsContainer}>
                <View style={styles.starDecoration} />
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={36}
                      color="#FFD700"
                      style={styles.starIcon}
                    />
                  ))}
                </View>
                <View style={styles.starDecoration} />
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
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>👨‍💻</Text>
                  </View>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>👩‍🎓</Text>
                  </View>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>👨‍💼</Text>
                  </View>
                </View>
                <Text style={styles.usersCount}>+ 50,000 lidí</Text>
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
    marginBottom: 40,
    paddingTop: 20,
  },
  titleText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.mainText,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  starDecoration: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 1,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  descriptionSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.questionLabel,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  usersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarsRow: {
    flexDirection: 'row',
    marginLeft: -8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 3,
    borderColor: COLORS.gradientMiddle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  usersCount: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.questionLabel,
    opacity: 0.8,
  },
  reviewsSection: {
    gap: 20,
    marginBottom: 20,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewAvatar: {
    fontSize: 26,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.mainText,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.questionLabel,
    opacity: 0.7,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.mainText,
    lineHeight: 24,
    fontStyle: 'italic',
    opacity: 0.95,
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