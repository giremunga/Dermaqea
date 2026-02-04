import { Link, useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function LandingPage() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your Personal Skin Analysis</Text>
        <Text style={styles.heroSubtitle}>Get personalized skincare recommendations with AI-powered analysis</Text>
        
        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/camera' as any)}
          >
            <Text style={styles.buttonText}>Start Analysis</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.heroImage}>
          <Text style={{ fontSize: 60 }}>📱</Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        <View style={styles.featuresGrid}>
          {[
            {
              icon: '📸',
              title: '1. Take a Selfie',
              description: 'Capture a clear photo of your skin using your phone camera'
            },
            {
              icon: '🔍',
              title: '2. AI Analysis',
              description: 'Our advanced AI analyzes your skin concerns'
            },
            {
              icon: '💡',
              title: '3. Get Recommendations',
              description: 'Receive personalized product suggestions'
            },
            {
              icon: '✅',
              title: '4. Verify Products',
              description: 'Check product authenticity with QR codes'
            }
          ].map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View style={[styles.section, styles.ctaSection]}>
        <Text style={styles.ctaTitle}>Ready for Better Skin?</Text>
        <Text style={styles.ctaSubtitle}>Start your personalized skincare journey today</Text>
        <TouchableOpacity 
          style={[styles.primaryButton, styles.ctaButton]}
          onPress={() => router.push('/camera' as any)}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  hero: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#f0f7eb', // Soft green background
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#2e7d32', // Darker green for better contrast
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  heroImage: {
    width: 300,
    height: 300,
    backgroundColor: '#e8f5e9', // Lighter green background
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#dcedc8', // Subtle border
  },
  ctaContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#8bc34a', // Lime green
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#689f38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#1b5e20', // Dark green for better contrast
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#689f38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f1f8e9',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: '#f1f8e9', // Very light green
    borderRadius: 20,
    margin: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#dcedc8', // Subtle border
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    width: '100%',
    maxWidth: 300,
  },
});
