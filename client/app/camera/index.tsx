import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImageManipulator from 'expo-image-manipulator';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [showTips, setShowTips] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const guideAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial fade-in
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

    // Pulsing guide animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(guideAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(guideAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={['#e8f5e9', '#f1f8e9']}
          style={styles.permissionCard}
        >
          <View style={styles.permissionIcon}>
            <Text style={{ fontSize: 48 }}>📸</Text>
          </View>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to analyze your skin
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <LinearGradient
              colors={['#66bb6a', '#4caf50']}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>Grant Access</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        // Compress and resize image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Navigate to analysis screen with image
        router.push({
          pathname: '/analysis',
          params: { imageUri: manipulatedImage.uri },
        } as any);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        {/* Header */}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.header}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.Text style={[styles.headerTitle, { opacity: fadeAnim }]}>
            Position Your Face
          </Animated.Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        {/* Face Guide Overlay */}
        <View style={styles.guideContainer}>
          <Animated.View
            style={[
              styles.faceGuide,
              {
                transform: [{ scale: guideAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </Animated.View>
        </View>

        {/* Instructions */}
        {showTips && (
          <Animated.View
            style={[
              styles.instructionsContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.instructionsCard}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTips(false)}
                accessibilityLabel="Close tips"
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.instructionsTitle}>📋 Tips for Best Results</Text>
              <View style={styles.instructionsList}>
                <Text style={styles.instructionItem}>• Center your face in the frame</Text>
                <Text style={styles.instructionItem}>• Ensure good lighting</Text>
                <Text style={styles.instructionItem}>• Remove glasses if possible</Text>
                <Text style={styles.instructionItem}>• Keep a neutral expression</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Bottom Controls */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.controls}
        >
          <Animated.View
            style={[
              styles.controlsContent,
              { opacity: fadeAnim, transform: [{ translateY: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }) }] },
            ]}
          >
            {/* Flash Button (Placeholder) */}
            <View style={styles.controlButton}>
              <View style={styles.controlIcon}>
                <Text style={styles.controlIconText}>⚡</Text>
              </View>
            </View>

            {/* Capture Button */}
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isCapturing}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#66bb6a', '#4caf50']}
                style={styles.captureButtonGradient}
              >
                <View style={styles.captureButtonInner}>
                  {isCapturing ? (
                    <Text style={styles.capturingText}>...</Text>
                  ) : (
                    <View style={styles.captureButtonDot} />
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Flip Camera Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraFacing}
            >
              <View style={styles.controlIcon}>
                <Text style={styles.controlIconText}>🔄</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  permissionCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c5e1a5',
    width: '100%',
    maxWidth: 400,
  },
  permissionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#c5e1a5',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 15,
    color: '#558b2f',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
  },
  permissionButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  guideContainer: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.15,
    right: width * 0.15,
    height: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
    borderWidth: 3,
    borderColor: 'rgba(102, 187, 106, 0.8)',
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#66bb6a',
    borderWidth: 4,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
  },
  instructionsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#1b5e20',
    fontWeight: '700',
    lineHeight: 18,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 12,
  },
  instructionsList: {
    gap: 6,
  },
  instructionItem: {
    fontSize: 13,
    color: '#558b2f',
    fontWeight: '500',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingTop: 40,
  },
  controlsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
  },
  controlIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  controlIconText: {
    fontSize: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  captureButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4caf50',
  },
  capturingText: {
    fontSize: 24,
    color: '#4caf50',
    fontWeight: 'bold',
  },
});