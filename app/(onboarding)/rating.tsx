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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TitleText, DescriptionText } from '../../components/Text';
import { NextButton } from '../../components/Button';
import AppBackground from '../../components/AppBackground';
import { COLORS, SPACING } from '@/constants/theme';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

// Profile images - declared first to avoid TDZ errors
const profileImages = [
  require('@/attached_assets/22_1757748931161.jpg'),
  require('@/attached_assets/2_1757748931159.jpg'),
  require('@/attached_assets/42_1757748931161.jpg'),
  require('@/attached_assets/79_1757748931161.jpg'),
];

interface Review {
  id: string;
  name: string;
  username: string;
  avatar: any; // Changed to any to support require() imports
  rating: number;
  review: string;
}

const CLIENT_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Jake Newman',
    username: '@productivelife22',
    avatar: profileImages[0], // Male profile
    rating: 5,
    review: 'This app changed my life! I\'ve been able to complete projects on time for 2 months now. The procrastination tracking system helped me understand my habits.'
  },
  {
    id: '2', 
    name: 'Anna Stevens',
    username: '@mindful_anna',
    avatar: profileImages[1], // Female profile
    rating: 5,
    review: 'I was skeptical at first, but the anti-procrastination features really work. I can finally write my thesis without endless postponing!'
  },
  {
    id: '3',
    name: 'Tom Collins',
    username: '@focusedtom',
    avatar: profileImages[2], // Male profile
    rating: 5,
    review: 'Best investment in my productivity. The app helped me identify my procrastination patterns and build better work habits.'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    username: '@sarahgetsitdone',
    avatar: profileImages[3], // Female profile
    rating: 5,
    review: 'Unloop completely transformed how I approach my daily tasks. The science-based approach really works - I feel so much more in control now!'
  }
];

export default function RatingScreen() {
  const insets = useSafeAreaInsets();
  
  // Note: require() assets in React Native load instantly, no preloading needed

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Continue to signature
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
    <AppBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.gradientStart} />
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backButton}>
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
              <TitleText animated={false} style={styles.titleText}>
                Give us a rating
              </TitleText>
              
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
              <DescriptionText animated={false} style={styles.descriptionText}>
                This app was designed for people{'\n'}like you.
              </DescriptionText>
              
              {/* User avatars and count */}
              <View style={styles.usersContainer}>
                <View style={styles.avatarsRow}>
                  <View style={styles.avatarCircle}>
                    <Image source={CLIENT_REVIEWS[0].avatar} style={styles.avatarImage} contentFit="cover" transition={0} cachePolicy="memory-disk" />
                  </View>
                  <View style={styles.avatarCircle}>
                    <Image source={CLIENT_REVIEWS[1].avatar} style={styles.avatarImage} contentFit="cover" transition={0} cachePolicy="memory-disk" />
                  </View>
                  <View style={styles.avatarCircle}>
                    <Image source={CLIENT_REVIEWS[2].avatar} style={styles.avatarImage} contentFit="cover" transition={0} cachePolicy="memory-disk" />
                  </View>
                  <View style={styles.avatarCircle}>
                    <Image source={CLIENT_REVIEWS[3].avatar} style={styles.avatarImage} contentFit="cover" transition={0} cachePolicy="memory-disk" />
                  </View>
                </View>
                <Text style={styles.usersCount}>+ 50,000 people</Text>
              </View>
            </View>

            {/* Reviews */}
            <View style={styles.reviewsSection}>
              {CLIENT_REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <View style={styles.avatarContainer}>
                        <Image source={review.avatar} style={styles.reviewAvatarImage} contentFit="cover" transition={0} cachePolicy="memory-disk" />
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
          <NextButton
            title="Next"
            onPress={handleContinue}
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
    paddingTop: 16, // Reduced top padding
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32, // Reduced margin for better fit
    paddingTop: 16, // Reduced padding
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 32,
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
    marginBottom: 24, // Reduced to fit more content
  },
  descriptionText: {
    textAlign: 'center',
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
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  usersCount: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.questionLabel,
    opacity: 0.8,
  },
  reviewsSection: {
    gap: 16, // Reduced gap to fit more reviews
    marginBottom: 20,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20, // Reduced for more compact look
    padding: 20, // Reduced padding
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
    marginBottom: 14, // Reduced margin
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarContainer: {
    width: 48, // Reduced size
    height: 48,
    borderRadius: 24,
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
    overflow: 'hidden', // Ensure proper image clipping
  },
  reviewAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 17, // Slightly smaller
    fontWeight: '700',
    color: COLORS.mainText,
    marginBottom: 3, // Reduced margin
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
    fontSize: 15, // Slightly smaller text
    fontWeight: '500',
    color: COLORS.mainText,
    lineHeight: 22, // Reduced line height
    fontStyle: 'italic',
    opacity: 0.95,
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