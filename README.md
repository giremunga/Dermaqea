# Dermaqea - Technical Specifications & Features

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Technical Stack](#technical-stack)
4. [Screen Details](#screen-details)
5. [API Integration](#api-integration)
6. [Animation System](#animation-system)
7. [Color System](#color-system)
8. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

Dermaqea is a mobile-first React Native application that provides AI-powered skin analysis and personalized skincare product recommendations. The app combines computer vision, DeSci (Decentralized Science) principles, and QR code verification to deliver a comprehensive skincare solution.

### Key Value Propositions

- **Instant Analysis**: Get skin analysis results in seconds
- **Personalized**: Recommendations tailored to your specific skin type
- **Trust Layer**: QR verification ensures product authenticity
- **Science-Backed**: DeSci approach with transparent research
- **User-Friendly**: Intuitive interface with beautiful animations

---

## ✨ Core Features

### 1. AI Skin Analysis

**Functionality:**
- Capture selfie using device camera
- AI detects multiple skin concerns:
  - Acne and blemishes
  - Hyperpigmentation
  - Skin texture irregularities
  - Oiliness/dryness levels
  - Fine lines and wrinkles
- Confidence score (0-100%)
- Visual pattern detection (not medical diagnosis)

**Technical Details:**
- Image processing with `expo-image-manipulator`
- Compression to optimize upload (max 1024px width)
- JPEG format with 0.8 quality
- Real-time progress feedback
- Multi-stage analysis simulation

### 2. Product Recommendations

**Functionality:**
- Personalized product suggestions based on:
  - Detected skin type
  - Identified concerns
  - User preferences
- Filter by category:
  - Cleansers
  - Treatments
  - Moisturizers
  - Sunscreens
  - Serums
- Product details include:
  - Name, brand, price
  - Ratings and reviews
  - Key ingredients
  - Suitability tags
  - Verification status

**Technical Details:**
- Dynamic filtering system
- Lazy loading for performance
- Product data caching
- Integration with e-commerce APIs

### 3. QR Code Verification

**Functionality:**
- Real-time QR code scanning
- Product authentication check
- Verification results:
  - ✓ Verified: Authentic product
  - ⚠️ Suspicious: Possible counterfeit
  - ✗ Counterfeit: Known fake
- Product details display:
  - Batch number
  - Manufacturer
  - Expiry date
  - Authenticity score
- Counterfeit reporting system

**Technical Details:**
- `expo-camera` barcode scanner
- QR code validation
- Backend verification API
- Secure data transmission

### 4. DeSci Integration

**Principles:**
- Transparent research backing
- Community-driven insights
- Evidence-based recommendations
- Open science approach
- Anonymous data contribution (opt-in)

---

## 🛠️ Technical Stack

### Frontend Framework
```
React Native 0.74.1
Expo SDK 51.0
TypeScript 5.3
```

### Navigation
```
Expo Router 3.5 (File-based routing)
React Navigation (under the hood)
```

### UI Components
```
React Native Core Components
expo-linear-gradient (Gradients)
Animated API (Animations)
```

### Camera & Media
```
expo-camera (Camera access)
expo-image-picker (Photo selection)
expo-image-manipulator (Image processing)
```

### State Management
```
React Hooks (useState, useEffect, useRef)
@react-native-async-storage/async-storage (Local storage)
```

### API Integration
```
Fetch API
FormData for image uploads
JSON for data exchange
```

---

## 📱 Screen Details

### Landing Page (`index.tsx`)

**Purpose:** First impression, explain value proposition

**Components:**
- Hero section with animated phone mockup
- Feature cards (4 steps)
- DeSci information card
- Primary CTA buttons
- Trust badges

**Animations:**
- Fade-in on mount (600ms)
- Slide-up content (800ms)
- Scale animation on phone mockup
- Pulse effect on CTA buttons
- Staggered feature cards (150ms delay)

**Colors:**
- Background: Linear gradient (#d4edda → #e8f5e9 → #f1f8e9)
- Primary button: Gradient (#66bb6a → #4caf50)
- Text: Dark green (#1b5e20, #2e7d32)

### Camera Screen (`camera.tsx`)

**Purpose:** Capture user's facial photo

**Features:**
- Front/back camera toggle
- Face guide overlay (circular, dashed)
- Real-time tips display
- Flash control (placeholder)
- Capture button with animation

**Animations:**
- Fade-in interface
- Pulsing face guide (1.5s loop)
- Corner markers pulse
- Scan line effect

**Validations:**
- Camera permission check
- Image quality validation
- Face detection (future)

### Analysis Screen (`analysis.tsx`)

**Purpose:** Show processing progress

**Features:**
- Image preview with scan effect
- 5-stage analysis progress
- Animated progress bar (0-100%)
- Stage indicators (dots)
- Processing time: ~10 seconds

**Stages:**
1. Processing image (1.5s)
2. Detecting skin features (2s)
3. Analyzing concerns (2.5s)
4. Generating recommendations (2s)
5. Finalizing results (1.5s)

**Animations:**
- Rotating processing icon (3s loop)
- Moving scan line (2s loop)
- Progress bar fill
- Stage transitions

### Results Screen (`results.tsx`)

**Purpose:** Display comprehensive analysis

**Features:**
- 3 tabs: Overview, Concerns, Routine
- Confidence score badge
- Skin type display
- Concern breakdown with severity
- Animated progress bars
- Quick stats cards

**Data Display:**
- **Overview Tab:**
  - Narrative summary
  - Quick stats (concerns, confidence, products)
- **Concerns Tab:**
  - List of detected concerns
  - Severity badges (color-coded)
  - Percentage bars with animation
- **Routine Tab:**
  - Recommended steps (numbered)
  - Ingredients to avoid

### Recommendations Screen (`recommendations.tsx`)

**Purpose:** Show personalized product suggestions

**Features:**
- Horizontal filter chips
- Product cards with:
  - Product image (emoji placeholder)
  - Name, category, price
  - Star rating + review count
  - Key ingredients tags
  - Suitability tags
  - Verify button
- DeSci verified badge
- Bottom tip message

**Filters:**
- All products
- By category (Cleanser, Treatment, etc.)

**Product Card Structure:**
```typescript
{
  id: number,
  name: string,
  category: string,
  price: string,
  rating: number,
  reviews: number,
  description: string,
  verified: boolean,
  keyIngredients: string[],
  suitableFor: string[],
  image: string (emoji)
}
```

### QR Scanner Screen (`qr-scanner.tsx`)

**Purpose:** Scan and verify product QR codes

**Features:**
- Real-time QR scanning
- Scan area with animated corners
- Moving scan line
- Verification progress
- Result modal with details
- Manual code entry option

**Verification Results:**
```typescript
{
  verified: boolean,
  productName: string,
  manufacturer: string,
  batchNumber: string,
  expiryDate: string,
  authenticity: {
    score: number,
    status: 'verified' | 'suspicious' | 'counterfeit',
    details: string
  }
}
```

---

## 🔌 API Integration

### Base Configuration

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.dermaqea.com';
```

### Endpoints

#### 1. Analyze Skin Image

**Endpoint:** `POST /api/v1/analyze`

**Request:**
```typescript
FormData {
  image: File (JPEG, max 1024px width),
  userId?: string
}
```

**Response:**
```typescript
{
  success: boolean,
  data: {
    skinType: string,
    confidence: number,
    concerns: Array<{
      name: string,
      severity: string,
      percentage: number,
      description?: string
    }>,
    recommendations: {
      routine: string[],
      avoid: string[]
    },
    analysisId: string,
    timestamp: string
  }
}
```

#### 2. Verify Product

**Endpoint:** `POST /api/v1/verify`

**Request:**
```typescript
{
  qrData: string,
  productId?: string
}
```

**Response:**
```typescript
{
  success: boolean,
  data: {
    verified: boolean,
    productName: string,
    manufacturer: string,
    batchNumber: string,
    expiryDate: string,
    authenticity: {
      score: number,
      status: string,
      details: string
    }
  }
}
```

#### 3. Get Recommendations

**Endpoint:** `GET /api/v1/recommendations/:analysisId`

**Query Parameters:**
- `category?: string`
- `minPrice?: number`
- `maxPrice?: number`
- `verified?: boolean`

#### 4. Report Counterfeit

**Endpoint:** `POST /api/v1/report`

**Request:**
```typescript
{
  productId: string,
  qrData: string,
  userId: string,
  details?: string,
  timestamp: string
}
```

---

## 🎨 Animation System

### Fade Animations

```typescript
const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 600,
  useNativeDriver: true,
}).start();
```

### Slide Animations

```typescript
const slideAnim = useRef(new Animated.Value(50)).current;

Animated.spring(slideAnim, {
  toValue: 0,
  friction: 8,
  tension: 40,
  useNativeDriver: true,
}).start();
```

### Staggered Animations

```typescript
const anims = [anim1, anim2, anim3, anim4];

Animated.stagger(150, 
  anims.map(anim => 
    Animated.spring(anim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    })
  )
).start();
```

### Loop Animations

```typescript
Animated.loop(
  Animated.sequence([
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(anim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }),
  ])
).start();
```

---

## 🎨 Color System

### Primary Colors

```typescript
const colors = {
  // Primary greens
  primary: '#66bb6a',        // Main brand green
  primaryDark: '#4caf50',    // Darker shade
  primaryDeep: '#388e3c',    // Deepest shade
  
  // Text colors
  textDark: '#1b5e20',       // Headings
  textMedium: '#2e7d32',     // Body text
  textLight: '#558b2f',      // Secondary text
  
  // Background colors
  bgLightMint: '#e8f5e9',    // Light mint
  bgVeryLight: '#f1f8e9',    // Very light
  bgWhite: '#ffffff',        // Pure white
  
  // Border colors
  borderLight: '#c5e1a5',    // Subtle border
  borderMedium: '#dcedc8',   // Medium border
  
  // Accent colors
  accentBlue: '#42a5f5',     // Info/links
  accentOrange: '#ff9800',   // Warnings
  accentRed: '#ef5350',      // Errors
};
```

### Gradients

```typescript
// Primary gradient
['#66bb6a', '#4caf50']

// Hero gradient
['#d4edda', '#e8f5e9', '#f1f8e9']

// Button gradient
['#66bb6a', '#4caf50', '#388e3c']

// Card gradients
['#e8f5e9', '#f1f8e9']
['#ffffff', '#f1f8e9']
```

---

## 🚀 Future Enhancements

### Phase 1: Core Improvements
- [ ] User authentication (email, social login)
- [ ] Analysis history storage
- [ ] Profile customization
- [ ] Save favorite products
- [ ] Share analysis results

### Phase 2: Advanced Features
- [ ] Before/after photo comparison
- [ ] Progress tracking over time
- [ ] Routine reminders
- [ ] Product wishlists
- [ ] Price alerts

### Phase 3: Community Features
- [ ] User reviews and ratings
- [ ] Community forum
- [ ] Expert consultations
- [ ] User-generated content
- [ ] Social sharing

### Phase 4: Premium Features
- [ ] Advanced skin analysis (AI v2)
- [ ] Video consultations
- [ ] Personalized skincare plans
- [ ] Ingredient analyzer
- [ ] Batch scanning

### Phase 5: Platform Expansion
- [ ] Web application
- [ ] Desktop app
- [ ] API for third parties
- [ ] B2B solutions
- [ ] International expansion

---

## 📊 Performance Targets

### App Performance
- Initial load: < 2 seconds
- Camera ready: < 1 second
- Analysis complete: < 15 seconds
- Smooth 60 FPS animations
- Image upload: < 3 seconds (on 4G)

### App Size
- APK size: < 50 MB
- IPA size: < 60 MB
- Asset optimization
- Code splitting

### Battery & Data
- Minimal battery drain
- Efficient image compression
- Cached data reuse
- Background task optimization

---

## 🔐 Security Considerations

### Data Privacy
- Encrypted image transmission
- No permanent image storage (unless user saves)
- Anonymous analytics
- GDPR compliance
- CCPA compliance

### API Security
- HTTPS only
- API key authentication
- Rate limiting
- Input validation
- SQL injection prevention

### User Data
- Secure local storage
- Encrypted user preferences
- No third-party tracking
- Clear privacy policy

---

## 📱 Device Support

### iOS
- iOS 13.0 and above
- iPhone 6S and newer
- iPad support

### Android
- Android 6.0 (API 23) and above
- All screen sizes
- Tablet optimization

---

## 🧪 Testing Strategy

### Unit Tests
- API service functions
- Data validation
- Image processing
- State management

### Integration Tests
- Navigation flows
- API integration
- Camera functionality
- Storage operations

### E2E Tests
- Complete user journeys
- Cross-platform testing
- Performance testing
- Regression testing

---

## 📈 Analytics & Metrics

### Key Metrics
- Daily Active Users (DAU)
- Analysis completion rate
- QR scan success rate
- Product recommendation CTR
- App store rating

### User Behavior
- Time spent per session
- Feature usage frequency
- Drop-off points
- Conversion funnel

---

Built with 💚 by the Dermaqea Team