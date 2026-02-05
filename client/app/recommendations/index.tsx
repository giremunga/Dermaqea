import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock product recommendations - replace with actual API data
const mockProducts = [
  {
    id: 1,
    name: 'CeraVe Foaming Facial Cleanser',
    category: 'Cleanser',
    price: '$14.99',
    rating: 4.5,
    reviews: 12453,
    description: 'Gentle foaming cleanser for normal to oily skin',
    verified: true,
    keyIngredients: ['Ceramides', 'Niacinamide', 'Hyaluronic Acid'],
    suitableFor: ['Oily Skin', 'Acne-Prone'],
    image: '🧴',
  },
  {
    id: 2,
    name: 'Paula\'s Choice 2% BHA',
    category: 'Treatment',
    price: '$32.00',
    rating: 4.7,
    reviews: 8932,
    description: 'Salicylic acid exfoliant for acne and blackheads',
    verified: true,
    keyIngredients: ['Salicylic Acid', 'Green Tea Extract'],
    suitableFor: ['Acne', 'Large Pores'],
    image: '💧',
  },
  {
    id: 3,
    name: 'Neutrogena Hydro Boost',
    category: 'Moisturizer',
    price: '$18.99',
    rating: 4.4,
    reviews: 15672,
    description: 'Oil-free gel moisturizer with hyaluronic acid',
    verified: true,
    keyIngredients: ['Hyaluronic Acid', 'Glycerin'],
    suitableFor: ['All Skin Types', 'Oil-Free'],
    image: '🧊',
  },
  {
    id: 4,
    name: 'La Roche-Posay Anthelios',
    category: 'Sunscreen',
    price: '$36.99',
    rating: 4.8,
    reviews: 9821,
    description: 'SPF 50+ broad spectrum sunscreen',
    verified: true,
    keyIngredients: ['Titanium Dioxide', 'Vitamin E'],
    suitableFor: ['Sensitive Skin', 'Daily Use'],
    image: '☀️',
  },
  {
    id: 5,
    name: 'The Ordinary Niacinamide 10%',
    category: 'Serum',
    price: '$5.90',
    rating: 4.3,
    reviews: 21003,
    description: 'Reduces appearance of blemishes and congestion',
    verified: true,
    keyIngredients: ['Niacinamide', 'Zinc'],
    suitableFor: ['Blemish-Prone', 'Budget-Friendly'],
    image: '🔬',
  },
];

export default function RecommendationsScreen() {
  const { imageUri, skinType } = useLocalSearchParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const productAnims = useRef(
    mockProducts.map(() => new Animated.Value(0))
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

    // Staggered product animations
    mockProducts.forEach((_, index) => {
      Animated.spring(productAnims[index], {
        toValue: 1,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const filters = ['all', 'cleanser', 'treatment', 'moisturizer', 'sunscreen'];

  const filteredProducts = selectedFilter === 'all'
    ? mockProducts
    : mockProducts.filter(p => p.category.toLowerCase() === selectedFilter);

  const handleVerifyProduct = (productId: number) => {
    router.push({
      pathname: '/qrscanner',
      params: { productId },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
            <Text style={styles.headerTitle}>Recommendations</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.headerLabel}>Personalized for</Text>
            <Text style={styles.headerValue}>{skinType || 'Your Skin Type'}</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Filters */}
      <Animated.View
        style={[
          styles.filtersContainer,
          { opacity: fadeAnim },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Products List */}
      <ScrollView
        style={styles.productsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.productsContent}>
          {/* Info Banner */}
          <Animated.View
            style={[
              styles.infoBanner,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#e3f2fd', '#f1f8e9']}
              style={styles.infoBannerGradient}
            >
              <Text style={styles.infoBannerIcon}>🌿</Text>
              <View style={styles.infoBannerContent}>
                <Text style={styles.infoBannerTitle}>DeSci Verified</Text>
                <Text style={styles.infoBannerText}>
                  All products backed by scientific research
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Product Cards */}
          {filteredProducts.map((product, index) => (
            <Animated.View
              key={product.id}
              style={[
                {
                  opacity: productAnims[index],
                  transform: [
                    {
                      translateY: productAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: productAnims[index],
                    },
                  ],
                },
              ]}
            >
              <View style={styles.productCard}>
                <View style={styles.productHeader}>
                  <View style={styles.productImageContainer}>
                    <Text style={styles.productImage}>{product.image}</Text>
                  </View>
                  <View style={styles.productHeaderInfo}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{product.category}</Text>
                    </View>
                    {product.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={styles.star}>
                        {i < Math.floor(product.rating) ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.ratingText}>
                    {product.rating} ({product.reviews.toLocaleString()} reviews)
                  </Text>
                </View>

                {/* Key Ingredients */}
                <View style={styles.ingredientsContainer}>
                  <Text style={styles.ingredientsLabel}>Key Ingredients:</Text>
                  <View style={styles.ingredientsTags}>
                    {product.keyIngredients.map((ingredient, idx) => (
                      <View key={idx} style={styles.ingredientTag}>
                        <Text style={styles.ingredientTagText}>{ingredient}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Suitable For */}
                <View style={styles.suitableContainer}>
                  <Text style={styles.suitableLabel}>Best for:</Text>
                  <View style={styles.suitableTags}>
                    {product.suitableFor.map((item, idx) => (
                      <View key={idx} style={styles.suitableTag}>
                        <Text style={styles.suitableTagText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.productActions}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>{product.price}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={() => handleVerifyProduct(product.id)}
                  >
                    <LinearGradient
                      colors={['#66bb6a', '#4caf50']}
                      style={styles.verifyButtonGradient}
                    >
                      <Text style={styles.verifyButtonText}>Verify with QR</Text>
                      <Text style={styles.verifyButtonIcon}>📱</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}

          {/* Bottom Message */}
          <View style={styles.bottomMessage}>
            <Text style={styles.bottomMessageText}>
              💡 Tip: Always verify products using QR codes to ensure authenticity
            </Text>
          </View>
        </View>
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
    marginBottom: 16,
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
  headerInfo: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  headerLabel: {
    fontSize: 13,
    color: '#558b2f',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
  },
  filtersContainer: {
    paddingVertical: 16,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f8e9',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  filterChipActive: {
    backgroundColor: '#66bb6a',
    borderColor: '#66bb6a',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#558b2f',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  productsContainer: {
    flex: 1,
  },
  productsContent: {
    padding: 24,
  },
  infoBanner: {
    marginBottom: 20,
  },
  infoBannerGradient: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c5e1a5',
    alignItems: 'center',
  },
  infoBannerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 2,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#558b2f',
    fontWeight: '500',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#f1f8e9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c5e1a5',
  },
  productImage: {
    fontSize: 32,
  },
  productHeaderInfo: {
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976d2',
  },
  verifiedBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  ingredientsContainer: {
    marginBottom: 12,
  },
  ingredientsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  ingredientsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: '#f1f8e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  ingredientTagText: {
    fontSize: 12,
    color: '#558b2f',
    fontWeight: '600',
  },
  suitableContainer: {
    marginBottom: 16,
  },
  suitableLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  suitableTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suitableTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  suitableTagText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  priceContainer: {
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2e7d32',
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  verifyButtonIcon: {
    fontSize: 16,
  },
  bottomMessage: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffcc80',
    marginTop: 8,
    marginBottom: 32,
  },
  bottomMessageText: {
    fontSize: 13,
    color: '#e65100',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
});