import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, Animated, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AnalysisScreen() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();
  const [analysisStage, setAnalysisStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const stages = [
    { icon: '📸', text: 'Processing image...', duration: 1500 },
    { icon: '🔍', text: 'Detecting skin features...', duration: 2000 },
    { icon: '🧬', text: 'Analyzing skin concerns...', duration: 2500 },
    { icon: '💡', text: 'Generating recommendations...', duration: 2000 },
    { icon: '✨', text: 'Finalizing results...', duration: 1500 },
  ];

  useEffect(() => {
    // Initial fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Scan line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Simulate analysis progress
    let currentProgress = 0;
    let currentStage = 0;

    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: currentProgress / 100,
        duration: 100,
        useNativeDriver: false,
      }).start();

      // Update stage based on progress
      const newStage = Math.floor((currentProgress / 100) * stages.length);
      if (newStage !== currentStage && newStage < stages.length) {
        currentStage = newStage;
        setAnalysisStage(newStage);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Navigate to results after a brief delay
        setTimeout(() => {
          // Use the object form to satisfy the router.replace type and pass imageUri as a param
          router.replace({
            pathname: '/results',
            params: { imageUri: imageUri as string },
          });
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scanLinePosition = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 350],
  });

  return (
    <LinearGradient
      colors={['#e8f5e9', '#f1f8e9', '#ffffff']}
      style={styles.container}
    >
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>AI Analysis</Text>
        <Text style={styles.headerSubtitle}>Please wait while we analyze your skin</Text>
      </Animated.View>

      {/* Image with Scan Effect */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          {imageUri && (
            <Image
              source={{ uri: imageUri as string }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          {/* Scan Line Overlay */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{ translateY: scanLinePosition }],
              },
            ]}
          />
          {/* Processing Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(102, 187, 106, 0.2)']}
            style={styles.imageOverlay}
          >
            <Animated.View
              style={[
                styles.processingIcon,
                { transform: [{ rotate: spin }] },
              ]}
            >
              <Text style={styles.processingIconText}>🔄</Text>
            </Animated.View>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Progress Section */}
      <Animated.View style={[styles.progressSection, { opacity: fadeAnim }]}>
        {/* Current Stage */}
        <View style={styles.stageContainer}>
          <Text style={styles.stageIcon}>{stages[analysisStage].icon}</Text>
          <Text style={styles.stageText}>{stages[analysisStage].text}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={['#66bb6a', '#4caf50', '#388e3c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {/* Analysis Steps Indicators */}
        <View style={styles.stepsContainer}>
          {stages.map((stage, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index <= analysisStage && styles.stepDotActive,
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* AI Info Card */}
      <Animated.View
        style={[
          styles.infoCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }) }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
          style={styles.infoCardGradient}
        >
          <View style={styles.infoIcon}>
            <Text style={{ fontSize: 24 }}>🤖</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>AI-Powered Analysis</Text>
            <Text style={styles.infoDescription}>
              Using advanced computer vision to detect skin patterns and concerns
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1b5e20',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#558b2f',
    fontWeight: '500',
  },
  imageContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  imageWrapper: {
    width: width - 48,
    height: width - 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#66bb6a',
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#66bb6a',
    shadowColor: '#66bb6a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#66bb6a',
  },
  processingIconText: {
    fontSize: 32,
  },
  progressSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  stageIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  stageText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2e7d32',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#c5e1a5',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2e7d32',
    textAlign: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  stepDotActive: {
    backgroundColor: '#66bb6a',
    borderColor: '#66bb6a',
  },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 'auto',
    marginBottom: 32,
  },
  infoCardGradient: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c5e1a5',
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#c5e1a5',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: '#558b2f',
    lineHeight: 18,
  },
});