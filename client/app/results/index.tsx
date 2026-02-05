import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock analysis results - replace with actual API response
const mockResults = {
  skinType: 'Combination',
  concerns: [
    { name: 'Acne', severity: 'Moderate', percentage: 65, color: '#ef5350' },
    { name: 'Hyperpigmentation', severity: 'Mild', percentage: 35, color: '#ff9800' },
    { name: 'Oiliness', severity: 'High', percentage: 75, color: '#66bb6a' },
    { name: 'Texture Irregularity', severity: 'Low', percentage: 25, color: '#42a5f5' },
  ],
  recommendations: {
    routine: ['Gentle Cleanser', 'Salicylic Acid Treatment', 'Oil-Free Moisturizer', 'SPF 30+ Sunscreen'],
    avoid: ['Heavy oils', 'Comedogenic ingredients', 'Harsh scrubs'],
  },
  confidence: 87,
};

export default function ResultsScreen() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'concerns' | 'routine'>('overview');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const concernAnims = useRef(
    mockResults.concerns.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate concern bars
    mockResults.concerns.forEach((_, index) => {
      Animated.timing(concernAnims[index], {
        toValue: 1,
        duration: 800,
        delay: index * 150,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  const handleViewRecommendations = () => {
    router.push({
      pathname: '/recommendations',
      params: { 
        imageUri: imageUri as string,
        skinType: mockResults.skinType,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with Image */}
      <LinearGradient
        colors={['#e8f5e9', '#f1f8e9']}
        style={styles.header}
      >
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Analysis Results</Text>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => {/* Share functionality */}}
            >
              <Text style={styles.shareButtonText}>📤</Text>
            </TouchableOpacity>
          </View>

          {/* Result Preview */}
          <View style={styles.resultPreview}>
            <View style={styles.resultImageContainer}>
              {imageUri && (
                <Image
                  source={{ uri: imageUri as string }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.resultSummary}>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{mockResults.confidence}% Accurate</Text>
              </View>
              <Text style={styles.skinTypeLabel}>Skin Type</Text>
              <Text style={styles.skinTypeValue}>{mockResults.skinType}</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Tabs */}
      <Animated.View
        style={[
          styles.tabsContainer,
          { opacity: fadeAnim },
        ]}
      >
        {(['overview', 'concerns', 'routine'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.contentInner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {selectedTab === 'overview' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skin Analysis Overview</Text>
              <LinearGradient
                colors={['#ffffff', '#f1f8e9']}
                style={styles.overviewCard}
              >
                <Text style={styles.overviewText}>
                  Based on AI analysis, your skin shows characteristics of{' '}
                  <Text style={styles.overviewHighlight}>{mockResults.skinType}</Text> skin type
                  with moderate acne concerns and mild hyperpigmentation. We recommend
                  products that are lightweight and non-comedogenic.
                </Text>
              </LinearGradient>

              {/* Quick Stats */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{mockResults.concerns.length}</Text>
                  <Text style={styles.statLabel}>Concerns</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{mockResults.confidence}%</Text>
                  <Text style={styles.statLabel}>Confidence</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{mockResults.recommendations.routine.length}</Text>
                  <Text style={styles.statLabel}>Products</Text>
                </View>
              </View>
            </View>
          )}

          {selectedTab === 'concerns' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detected Concerns</Text>
              {mockResults.concerns.map((concern, index) => (
                <View key={index} style={styles.concernCard}>
                  <View style={styles.concernHeader}>
                    <Text style={styles.concernName}>{concern.name}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: concern.color + '20' }]}>
                      <Text style={[styles.severityText, { color: concern.color }]}>
                        {concern.severity}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.concernBarContainer}>
                    <View style={styles.concernBarBackground}>
                      <Animated.View
                        style={[
                          styles.concernBarFill,
                          {
                            backgroundColor: concern.color,
                            width: concernAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', `${concern.percentage}%`],
                            }),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.concernPercentage}>{concern.percentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {selectedTab === 'routine' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended Routine</Text>
              
              {/* Recommended Steps */}
              <View style={styles.routineCard}>
                <Text style={styles.routineCardTitle}>✨ Daily Routine</Text>
                {mockResults.recommendations.routine.map((step, index) => (
                  <View key={index} style={styles.routineStep}>
                    <View style={styles.routineStepNumber}>
                      <Text style={styles.routineStepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.routineStepText}>{step}</Text>
                  </View>
                ))}
              </View>

              {/* Avoid List */}
              <View style={[styles.routineCard, styles.avoidCard]}>
                <Text style={styles.routineCardTitle}>⚠️ Ingredients to Avoid</Text>
                {mockResults.recommendations.avoid.map((item, index) => (
                  <View key={index} style={styles.avoidItem}>
                    <Text style={styles.avoidItemBullet}>•</Text>
                    <Text style={styles.avoidItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleViewRecommendations}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#66bb6a', '#4caf50']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaButtonText}>View Product Recommendations</Text>
              <Text style={styles.ctaButtonIcon}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  backButtonText: {
    fontSize: 20,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b5e20',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  shareButtonText: {
    fontSize: 18,
  },
  resultPreview: {
    flexDirection: 'row',
    gap: 16,
  },
  resultImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#66bb6a',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultSummary: {
    flex: 1,
    justifyContent: 'center',
  },
  confidenceBadge: {
    backgroundColor: '#66bb6a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  confidenceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  skinTypeLabel: {
    fontSize: 13,
    color: '#558b2f',
    fontWeight: '500',
    marginBottom: 4,
  },
  skinTypeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1b5e20',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f8e9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  tabActive: {
    backgroundColor: '#66bb6a',
    borderColor: '#66bb6a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#558b2f',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 16,
  },
  overviewCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#c5e1a5',
    marginBottom: 20,
  },
  overviewText: {
    fontSize: 15,
    color: '#558b2f',
    lineHeight: 24,
    fontWeight: '500',
  },
  overviewHighlight: {
    fontWeight: '700',
    color: '#2e7d32',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f1f8e9',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#558b2f',
    fontWeight: '600',
  },
  concernCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  concernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  concernName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  concernBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  concernBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  concernBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  concernPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1b5e20',
    width: 45,
    textAlign: 'right',
  },
  routineCard: {
    backgroundColor: '#f1f8e9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  routineCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 16,
  },
  routineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routineStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#66bb6a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routineStepNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  routineStepText: {
    flex: 1,
    fontSize: 15,
    color: '#2e7d32',
    fontWeight: '600',
  },
  avoidCard: {
    backgroundColor: '#fff3e0',
    borderColor: '#ffcc80',
  },
  avoidItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avoidItemBullet: {
    fontSize: 20,
    color: '#f57c00',
    marginRight: 8,
    fontWeight: 'bold',
  },
  avoidItemText: {
    fontSize: 15,
    color: '#e65100',
    fontWeight: '600',
  },
  ctaButton: {
    marginTop: 8,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  ctaButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});