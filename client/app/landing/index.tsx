import { Link, useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const feature1Anim = useRef(new Animated.Value(0)).current;
  const feature2Anim = useRef(new Animated.Value(0)).current;
  const feature3Anim = useRef(new Animated.Value(0)).current;
  const feature4Anim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered feature animations
    const featureDelay = 150;
    Animated.stagger(featureDelay, [
      Animated.spring(feature1Anim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
        delay: 400,
      }),
      Animated.spring(feature2Anim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(feature3Anim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(feature4Anim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for CTA
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const features = [
    {
      icon: '📸',
      title: 'Capture',
      description: 'Take a simple selfie with your phone camera',
      anim: feature1Anim,
      gradient: ['#e8f5e9', '#f1f8e9'],
    },
    {
      icon: '🔍',
      title: 'Analyze',
      description: 'AI detects acne, texture, and skin concerns',
      anim: feature2Anim,
      gradient: ['#f1f8e9', '#e8f5e9'],
    },
    {
      icon: '💡',
      title: 'Recommend',
      description: 'Get personalized product suggestions',
      anim: feature3Anim,
      gradient: ['#e8f5e9', '#f1f8e9'],
    },
    {
      icon: '✅',
      title: 'Verify',
      description: 'Check product authenticity with QR codes',
      anim: feature4Anim,
      gradient: ['#f1f8e9', '#e8f5e9'],
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* Hero Section with Gradient */}
      <LinearGradient
        colors={['#d4edda', '#e8f5e9', '#f1f8e9']}
        style={styles.hero}
      >
        <Animated.View
          style={[
            styles.heroContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🌿 AI-Powered</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Your Personal{'\n'}
            <Text style={styles.heroTitleAccent}>Skin Analysis</Text>
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Discover personalized skincare with AI-powered analysis and verified products
          </Text>

          {/* Animated Phone Mockup */}
          <Animated.View
            style={[
              styles.phoneMockup,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.phoneScreen}>
              <View style={styles.phoneNotch} />
              <View style={styles.phoneContent}>
                <Text style={styles.phoneEmoji}>🌿</Text>
                <View style={styles.shimmerLine} />
                <View style={styles.shimmerLine} />
                <View style={[styles.shimmerLine, { width: '60%' }]} />
              </View>
            </View>
          </Animated.View>

          {/* Primary CTA */}
          <Animated.View style={[styles.ctaContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/camera' as any)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#66bb6a', '#4caf50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Start Your Analysis</Text>
                <Text style={styles.buttonIcon}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.heroFootnote}>No special equipment needed</Text>
        </Animated.View>
      </LinearGradient>

      {/* How It Works Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>SIMPLE PROCESS</Text>
          <Text style={styles.sectionTitle}>How Dermaqea Works</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                {
                  opacity: feature.anim,
                  transform: [
                    {
                      translateY: feature.anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: feature.anim,
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={feature.gradient as [string, string]}
                style={styles.featureCard}
              >
                <View style={styles.featureNumber}>
                  <Text style={styles.featureNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* DeSci Badge Section */}
      <View style={styles.deSciSection}>
        <LinearGradient
          colors={['#f1f8e9', '#e8f5e9']}
          style={styles.deSciCard}
        >
          <View style={styles.deSciIcon}>
            <Text style={{ fontSize: 32 }}>🔬</Text>
          </View>
          <Text style={styles.deSciTitle}>Powered by DeSci</Text>
          <Text style={styles.deSciDescription}>
            Transparent research, community insights, and evidence-based skincare recommendations
          </Text>
        </LinearGradient>
      </View>

      {/* Final CTA Section */}
      <View style={styles.finalCta}>
        <LinearGradient
          colors={['#66bb6a', '#4caf50', '#388e3c']}
          style={styles.finalCtaGradient}
        >
          <Text style={styles.finalCtaTitle}>Ready for Better Skin?</Text>
          <Text style={styles.finalCtaSubtitle}>
            Join thousands discovering their perfect skincare routine
          </Text>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/camera' as any)}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>Get Started Free</Text>
            <Text style={styles.secondaryButtonIcon}>✨</Text>
          </TouchableOpacity>

          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeEmoji}>🔒</Text>
              <Text style={styles.trustBadgeText}>Secure</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeEmoji}>⚡</Text>
              <Text style={styles.trustBadgeText}>Fast</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeEmoji}>🎯</Text>
              <Text style={styles.trustBadgeText}>Accurate</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1b5e20',
    lineHeight: 44,
  },
  heroTitleAccent: {
    color: '#4caf50',
  },
  heroSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#558b2f',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  phoneMockup: {
    width: width * 0.7,
    maxWidth: 280,
    aspectRatio: 9 / 19,
    marginBottom: 32,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    borderWidth: 8,
    borderColor: '#2e7d32',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  phoneNotch: {
    width: 120,
    height: 24,
    backgroundColor: '#2e7d32',
    alignSelf: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  phoneContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f8e9',
  },
  phoneEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  shimmerLine: {
    width: '80%',
    height: 12,
    backgroundColor: '#c5e1a5',
    borderRadius: 6,
    marginBottom: 12,
  },
  ctaContainer: {
    width: '100%',
    marginBottom: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroFootnote: {
    fontSize: 13,
    color: '#689f38',
    fontWeight: '500',
  },
  section: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#66bb6a',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1b5e20',
    textAlign: 'center',
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#c5e1a5',
    shadowColor: '#66bb6a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureNumber: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#66bb6a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#c5e1a5',
  },
  featureIcon: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1b5e20',
  },
  featureDescription: {
    fontSize: 14,
    color: '#558b2f',
    lineHeight: 20,
    fontWeight: '500',
  },
  deSciSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  deSciCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  deSciIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#c5e1a5',
  },
  deSciTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 8,
  },
  deSciDescription: {
    fontSize: 14,
    color: '#558b2f',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  finalCta: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  finalCtaGradient: {
    padding: 32,
    alignItems: 'center',
  },
  finalCtaTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  finalCtaSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButtonText: {
    color: '#2e7d32',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  secondaryButtonIcon: {
    fontSize: 16,
  },
  trustBadges: {
    flexDirection: 'row',
    gap: 20,
  },
  trustBadge: {
    alignItems: 'center',
  },
  trustBadgeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  trustBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});