import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const { productId } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cornerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

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

    // Corner pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(cornerAnim, {
          toValue: 1,
          duration: 1000,
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
            <Text style={{ fontSize: 48 }}>📱</Text>
          </View>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan QR codes
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

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (!scanned) {
      setScanned(true);
      
      // Simulate verification process
      setTimeout(() => {
        const isVerified = Math.random() > 0.3; // 70% chance of being verified
        
        setScanResult({
          verified: isVerified,
          productName: 'CeraVe Foaming Facial Cleanser',
          batchNumber: 'BTC-2024-0123',
          manufacturer: 'L\'Oréal',
          expiryDate: '12/2025',
          qrData: data,
        });

        if (isVerified) {
          Alert.alert(
            '✓ Product Verified',
            'This product is authentic and approved',
            [
              {
                text: 'View Details',
                onPress: () => {/* Show details */},
              },
              {
                text: 'Scan Another',
                onPress: () => {
                  setScanned(false);
                  setScanResult(null);
                },
              },
            ]
          );
        } else {
          Alert.alert(
            '⚠️ Verification Failed',
            'This product could not be verified. It may be counterfeit.',
            [
              {
                text: 'Report',
                onPress: () => {/* Report functionality */},
              },
              {
                text: 'Scan Another',
                onPress: () => {
                  setScanned(false);
                  setScanResult(null);
                },
              },
            ]
          );
        }
      }, 1500);
    }
  };

  const scanLinePosition = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Header */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.header}
        >
          <Animated.View
            style={[
              styles.headerContent,
              { opacity: fadeAnim },
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan Product QR</Text>
            <View style={{ width: 40 }} />
          </Animated.View>
        </LinearGradient>

        {/* Scan Area */}
        <View style={styles.scanAreaContainer}>
          <Animated.View
            style={[
              styles.scanArea,
              { opacity: fadeAnim },
            ]}
          >
            {/* Corners */}
            <Animated.View
              style={[
                styles.corner,
                styles.topLeft,
                { transform: [{ scale: cornerAnim }] },
              ]}
            />
            <Animated.View
              style={[
                styles.corner,
                styles.topRight,
                { transform: [{ scale: cornerAnim }] },
              ]}
            />
            <Animated.View
              style={[
                styles.corner,
                styles.bottomLeft,
                { transform: [{ scale: cornerAnim }] },
              ]}
            />
            <Animated.View
              style={[
                styles.corner,
                styles.bottomRight,
                { transform: [{ scale: cornerAnim }] },
              ]}
            />

            {/* Scan Line */}
            {!scanned && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLinePosition }],
                  },
                ]}
              />
            )}

            {/* Scanning Indicator */}
            {scanned && (
              <View style={styles.scanningIndicator}>
                <Text style={styles.scanningText}>Verifying...</Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Instructions */}
        <Animated.View
          style={[
            styles.instructionsContainer,
            { opacity: fadeAnim },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
            style={styles.instructionsCard}
          >
            <Text style={styles.instructionsTitle}>
              {scanned ? '🔍 Verifying Product' : '📱 How to Scan'}
            </Text>
            <Text style={styles.instructionsText}>
              {scanned
                ? 'Please wait while we verify the product authenticity...'
                : 'Position the QR code within the frame. The scan will happen automatically.'}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Bottom Info */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.bottomInfo}
        >
          <Animated.View
            style={[
              styles.bottomInfoContent,
              { opacity: fadeAnim },
            ]}
          >
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Text style={{ fontSize: 24 }}>🛡️</Text>
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Anti-Counterfeit</Text>
                <Text style={styles.infoDescription}>
                  Verify authenticity and fight fake products
                </Text>
              </View>
            </View>

            {!scanned && (
              <TouchableOpacity
                style={styles.manualButton}
                onPress={() => {
                  Alert.alert(
                    'Manual Entry',
                    'Enter the product code manually',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Enter Code' },
                    ]
                  );
                }}
              >
                <Text style={styles.manualButtonText}>Enter Code Manually</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </LinearGradient>
      </CameraView>

      {/* Result Modal (if needed) */}
      {scanResult && (
        <View style={styles.resultOverlay}>
          <Animated.View
            style={[
              styles.resultCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={
                scanResult.verified
                  ? ['#e8f5e9', '#f1f8e9']
                  : ['#ffebee', '#fff3e0']
              }
              style={styles.resultCardGradient}
            >
              <View style={styles.resultIcon}>
                <Text style={{ fontSize: 48 }}>
                  {scanResult.verified ? '✓' : '⚠️'}
                </Text>
              </View>
              <Text style={styles.resultTitle}>
                {scanResult.verified ? 'Product Verified' : 'Verification Failed'}
              </Text>
              <Text style={styles.resultProductName}>{scanResult.productName}</Text>
              
              {scanResult.verified && (
                <View style={styles.resultDetails}>
                  <View style={styles.resultDetailRow}>
                    <Text style={styles.resultDetailLabel}>Batch:</Text>
                    <Text style={styles.resultDetailValue}>{scanResult.batchNumber}</Text>
                  </View>
                  <View style={styles.resultDetailRow}>
                    <Text style={styles.resultDetailLabel}>Manufacturer:</Text>
                    <Text style={styles.resultDetailValue}>{scanResult.manufacturer}</Text>
                  </View>
                  <View style={styles.resultDetailRow}>
                    <Text style={styles.resultDetailLabel}>Expiry:</Text>
                    <Text style={styles.resultDetailValue}>{scanResult.expiryDate}</Text>
                  </View>
                </View>
              )}

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={styles.resultButton}
                  onPress={() => {
                    setScanned(false);
                    setScanResult(null);
                  }}
                >
                  <LinearGradient
                    colors={['#66bb6a', '#4caf50']}
                    style={styles.resultButtonGradient}
                  >
                    <Text style={styles.resultButtonText}>Scan Another</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      )}
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: '#66bb6a',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 12,
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
  scanningIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -15 }],
  },
  scanningText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: 'rgba(102, 187, 106, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  instructionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  instructionsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#558b2f',
    lineHeight: 20,
  },
  bottomInfo: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  bottomInfoContent: {
    paddingHorizontal: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  manualButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  manualButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultCard: {
    width: '100%',
    maxWidth: 400,
  },
  resultCardGradient: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  resultIcon: {
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
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 8,
  },
  resultProductName: {
    fontSize: 16,
    color: '#558b2f',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultDetails: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  resultDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultDetailLabel: {
    fontSize: 14,
    color: '#558b2f',
    fontWeight: '600',
  },
  resultDetailValue: {
    fontSize: 14,
    color: '#1b5e20',
    fontWeight: '700',
  },
  resultActions: {
    width: '100%',
  },
  resultButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  resultButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  resultButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});