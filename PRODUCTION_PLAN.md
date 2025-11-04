# Descuentia - Complete Production Plan

## 🎯 Executive Summary

**Descuentia** is a mobile-first marketplace connecting consumers with local businesses through discounts, loyalty programs, and promotional campaigns. The platform helps users save money on everyday purchases while supporting traditional commerce and contributing to cancer research initiatives.

### Mission, Vision & Values

**Mission**: Offer discounts to promote user savings and boost local commerce, supporting cancer research with a portion of our profits from day one.

**Vision**: Become a reference marketplace for savings and responsible consumption in both cities and towns, fostering connections between people while supporting medical causes.

**Values**: 
- Help families save money in their daily lives
- Strengthen traditional commerce and local employment
- Support medical causes, particularly cancer research
- Promote responsible consumption and community engagement

---

## 🏗️ Technical Architecture

### Tech Stack Overview

#### Mobile Application (React Native with Expo)
- **Framework**: Expo SDK 50+ with TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit with RTK Query
- **Maps**: react-native-maps with Google Maps
- **Camera/Scanner**: expo-camera, expo-barcode-scanner
- **Notifications**: expo-notifications
- **Location**: expo-location
- **Image Handling**: expo-image-manipulator, expo-image-picker

#### Backend API
- **Runtime**: Node.js v18+ with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT-based)
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **Real-time**: Supabase Realtime subscriptions
- **Geolocation**: Google Maps Geocoding API

#### Infrastructure & Services
- **Database**: Supabase (hosted PostgreSQL with RLS)
- **File Storage**: Supabase Storage (images, business logos)
- **Authentication**: Supabase Auth
- **Push Notifications**: Expo Push Notifications service
- **Payment Processing**: Stripe
- **Maps & Geocoding**: Google Maps Platform APIs
- **Deployment**: User will handle (Render.com, Vercel, or similar)

---

## 📱 Application Features

### Consumer Application Features

#### 1. Map-Based Discount Discovery
- **Interactive Map Screen** (Main Screen)
  - User location tracking with expo-location
  - Custom map markers for active promotions
  - 3-4 block radius filtering
  - Real-time promotion updates
  - Tap markers to view promotion details
  - Visual indicators for promotion types

#### 2. Featured Promotions Carousel
- **Top Section** (1/3 of screen)
  - Swipeable carousel of weekly featured deals
  - Eye-catching promotions (2x1, 3x2, special offers)
  - Auto-scroll with manual override
  - "Featured" badge and countdown timers
  - Direct navigation to promotion details

#### 3. Discount & Coupon Management
- **Available Coupons View**
  - Browse claimable discounts
  - Filter by category (food, retail, services, etc.)
  - Distance-based sorting
  - Expiration date visibility

- **My Coupons Screen**
  - Claimed/Active coupons tab
  - Redeemed coupons history tab
  - QR code display for validation
  - Expiration tracking and reminders
  - Usage instructions

#### 4. Digital Loyalty Cards
- **Loyalty Cards Screen**
  - All enrolled loyalty programs
  - Visual punch card representation
  - Progress tracking (e.g., "3 of 10 stamps")
  - Reward details and requirements
  - QR code for stamp collection
  - Automatic reward redemption when complete

#### 5. User Profile & Settings
- **Profile Management**
  - Personal information (name, email, phone)
  - Profile picture
  - Notification preferences
  - Location settings
  - Payment methods (future feature)

- **Settings**
  - Push notification toggles
  - Location sharing preferences
  - App language (ES/EN)
  - Terms of service and privacy policy
  - About section with mission and values

#### 6. Welcome & Onboarding
- **Welcome Coupons**
  - Special discounts for new users
  - Onboarding tutorial screens
  - Location permission requests
  - Notification permission requests

### Merchant Application Features

#### 1. Business Dashboard
- **Overview Metrics**
  - Active promotions count
  - Total views (last 7/30 days)
  - Coupon claims and redemptions
  - New loyalty program enrollments
  - Revenue impact estimates

- **Quick Actions**
  - Create new promotion
  - Scan customer QR code
  - View analytics
  - Manage loyalty program

#### 2. Business Profile Management
- **Profile Setup**
  - Business name, description, category
  - Location (address with map pin)
  - Operating hours
  - Contact information (phone, email, website)
  - Logo and cover image upload
  - Social media links

- **Images & Media**
  - Business photo gallery
  - Automatic image compression
  - Supabase Storage integration
  - Maximum 10 images per business

#### 3. Campaign Management (3 Types)

##### Type 1: Time-Based Campaigns
- **Purpose**: Seasonal or limited-time promotions
- **Configuration**:
  - Start and end date/time
  - Discount percentage or fixed amount
  - Applicable products/services
  - Maximum claims per user
  - Total campaign budget (optional)
  - Visibility radius (1-10 km)
- **Example**: "10% off all sandwiches from Jan 1 - Feb 1"

##### Type 2: Fixed Discounts
- **Purpose**: Permanent discounts for app users
- **Configuration**:
  - Always-active discount
  - Discount percentage or fixed amount
  - Applicable products/services
  - Usage frequency limits (daily, weekly)
  - Visibility radius
- **Example**: "10% off coffee for all Descuentia users"

##### Type 3: Weekly Specials
- **Purpose**: Eye-catching impulse deals
- **Configuration**:
  - Featured promotion badge
  - High-value offers (2x1, 3x2, 50% off)
  - Short duration (typically 1 week)
  - Limited quantity
  - Priority placement in carousel
  - Visibility radius
- **Example**: "Buy 2 Get 1 Free - This Week Only!"

#### 4. Loyalty Program Management
- **Program Setup**
  - Program name and description
  - Reward threshold (e.g., 10 stamps = 1 free item)
  - Reward details
  - Stamp value (per purchase amount or fixed)
  - Expiration policy

- **Stamp Management**
  - QR code scanning for stamp awards
  - Manual stamp adjustment
  - Automatic reward issuance
  - Customer loyalty history

#### 5. QR Code Scanner & Validation
- **Coupon Redemption**
  - Real-time QR code scanning
  - Coupon validation and deactivation
  - Redemption confirmation screen
  - Transaction logging

- **Loyalty Stamp Award**
  - Customer QR code scanning
  - Stamp award confirmation
  - Progress notification to customer

#### 6. Analytics & Reports
- **Performance Metrics**
  - Campaign-specific analytics
  - Customer engagement rates
  - Peak redemption times
  - Geographic distribution of customers
  - Comparative campaign performance

- **Data Exports**
  - CSV/Excel export functionality
  - Date range filtering
  - Campaign-specific reports

#### 7. Subscription & Payments (Stripe)
- **Subscription Tiers**
  - **Free Tier**: 1 active promotion, basic analytics
  - **Basic Tier** ($19/month): 3 active promotions, loyalty program
  - **Pro Tier** ($49/month): 10 active promotions, advanced analytics
  - **Premium Tier** ($99/month): Unlimited promotions, featured placement

- **Payment Management**
  - Stripe checkout integration
  - Subscription status display
  - Payment history
  - Plan upgrade/downgrade
  - Card management
  - Automatic renewal

- **Feature Limits Enforcement**
  - Active promotion count limits
  - Loyalty program access
  - Analytics depth
  - Featured promotion placement

---

## 🗄️ Database Schema (Supabase PostgreSQL)

### Core Tables

#### 1. `profiles`
Extended user information beyond Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('consumer', 'merchant')),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  notification_preferences JSONB DEFAULT '{"push": true, "email": true, "proximity": true}'::jsonb,
  location_permission BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `businesses`
Merchant business profiles.

```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  operating_hours JSONB,
  social_media JSONB,
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_businesses_location ON businesses USING GIST (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
```

#### 3. `promotions`
All types of campaigns/promotions.

```sql
CREATE TYPE promotion_type AS ENUM ('time_based', 'fixed', 'weekly_special');
CREATE TYPE promotion_status AS ENUM ('draft', 'active', 'paused', 'expired');

CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type promotion_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount', 'special_offer')),
  discount_value DECIMAL(10, 2),
  special_offer_text TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  max_claims_per_user INTEGER,
  total_claim_limit INTEGER,
  current_claims INTEGER DEFAULT 0,
  visibility_radius_km DECIMAL(5, 2) DEFAULT 5.0,
  applicable_items TEXT[],
  terms_conditions TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status promotion_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promotions_business ON promotions(business_id);
CREATE INDEX idx_promotions_status ON promotions(status);
CREATE INDEX idx_promotions_type ON promotions(type);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
```

#### 4. `coupons`
Individual user coupon claims.

```sql
CREATE TYPE coupon_status AS ENUM ('claimed', 'redeemed', 'expired');

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code TEXT UNIQUE NOT NULL,
  status coupon_status DEFAULT 'claimed',
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  redemption_location POINT,
  UNIQUE(promotion_id, user_id)
);

CREATE INDEX idx_coupons_user ON coupons(user_id);
CREATE INDEX idx_coupons_promotion ON coupons(promotion_id);
CREATE INDEX idx_coupons_status ON coupons(status);
CREATE INDEX idx_coupons_qr ON coupons(qr_code);
```

#### 5. `loyalty_programs`
Merchant loyalty program definitions.

```sql
CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  stamps_required INTEGER NOT NULL,
  reward_description TEXT NOT NULL,
  stamp_value_type VARCHAR(20) CHECK (stamp_value_type IN ('per_purchase', 'per_amount')),
  stamp_value DECIMAL(10, 2),
  expiration_days INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id)
);

CREATE INDEX idx_loyalty_programs_business ON loyalty_programs(business_id);
```

#### 6. `loyalty_cards`
Individual user loyalty card instances.

```sql
CREATE TABLE loyalty_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_program_id UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code TEXT UNIQUE NOT NULL,
  current_stamps INTEGER DEFAULT 0,
  total_rewards_earned INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_stamp_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  UNIQUE(loyalty_program_id, user_id)
);

CREATE INDEX idx_loyalty_cards_user ON loyalty_cards(user_id);
CREATE INDEX idx_loyalty_cards_program ON loyalty_cards(loyalty_program_id);
```

#### 7. `loyalty_transactions`
Stamp award history.

```sql
CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_card_id UUID NOT NULL REFERENCES loyalty_cards(id) ON DELETE CASCADE,
  stamps_awarded INTEGER NOT NULL,
  transaction_amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_loyalty_transactions_card ON loyalty_transactions(loyalty_card_id);
```

#### 8. `subscriptions`
Merchant subscription management (Stripe integration).

```sql
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier subscription_tier DEFAULT 'free',
  status subscription_status DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id)
);

CREATE INDEX idx_subscriptions_business ON subscriptions(business_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
```

#### 9. `analytics_events`
Track user interactions for merchant analytics.

```sql
CREATE TYPE event_type AS ENUM ('view', 'claim', 'redeem', 'share');

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type event_type NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_business ON analytics_events(business_id);
CREATE INDEX idx_analytics_promotion ON analytics_events(promotion_id);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
```

#### 10. `push_tokens`
Store Expo push notification tokens.

```sql
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  device_type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_push_tokens_user ON push_tokens(user_id);
```

### Row Level Security (RLS) Policies

All tables will have RLS enabled with appropriate policies:

```sql
-- Example: profiles table policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Example: businesses table policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active businesses"
  ON businesses FOR SELECT
  USING (active = true);

CREATE POLICY "Business owners can update their business"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id);

-- Similar policies for all other tables...
```

---

## 🎨 User Interface & Navigation

### Consumer App Navigation Structure

```
Root Navigator (Stack)
├── Auth Stack (if not authenticated)
│   ├── WelcomeScreen
│   ├── LoginScreen
│   ├── SignupScreen
│   └── OnboardingScreen
│
└── Main Drawer Navigator (if authenticated as consumer)
    ├── Home Tab Navigator
    │   ├── MapScreen (Default)
    │   ├── CouponsScreen
    │   └── LoyaltyCardsScreen
    │
    ├── ProfileScreen
    ├── SettingsScreen
    └── AboutScreen
```

### Merchant App Navigation Structure

```
Root Navigator (Stack)
├── Auth Stack (if not authenticated)
│   ├── WelcomeScreen
│   ├── LoginScreen
│   ├── SignupScreen (with merchant option)
│   └── BusinessSetupScreen
│
└── Main Tab Navigator (if authenticated as merchant)
    ├── DashboardScreen
    ├── Promotions Tab
    │   ├── PromotionListScreen
    │   ├── CreatePromotionScreen
    │   └── EditPromotionScreen
    │
    ├── QRScannerScreen (Modal)
    ├── AnalyticsScreen
    ├── LoyaltyProgramScreen
    ├── BusinessProfileScreen
    └── SubscriptionScreen
```

### Key UI Components

#### Shared Components
- `Button` - Primary, secondary, outline variants with loading states
- `Input` - Text, email, password, number with validation
- `Card` - Container for content with shadow and rounded corners
- `Avatar` - User/business profile images with fallback
- `Badge` - Status indicators (featured, new, expiring)
- `BottomSheet` - Modal content from bottom
- `Loading` - Skeleton screens and spinners
- `ErrorBoundary` - Graceful error handling

#### Consumer-Specific Components
- `MapMarker` - Custom promotion markers with type icons
- `PromotionCard` - Card displaying promotion details
- `FeaturedCarousel` - Horizontal scrollable featured deals
- `CouponItem` - Coupon list item with QR preview
- `LoyaltyCardItem` - Digital punch card representation
- `QRCodeDisplay` - Full-screen QR code for validation

#### Merchant-Specific Components
- `MetricCard` - Dashboard metric display
- `PromotionForm` - Multi-step promotion creation
- `QRScanner` - Camera-based QR scanner
- `ChartView` - Analytics visualizations (line, bar charts)
- `SubscriptionCard` - Pricing tier display
- `ImageUploader` - Drag-and-drop image upload

---

## 🔐 Authentication & Security

### Supabase Auth Implementation

#### Authentication Flow
1. User signs up with email/password through Supabase Auth
2. User selects role (consumer/merchant) during signup
3. Profile record created with role in `profiles` table
4. JWT token issued by Supabase
5. Token stored securely using Expo SecureStore
6. Token attached to all API requests
7. Backend validates token with Supabase
8. Automatic token refresh handled by Supabase client

#### Security Measures
- **Row Level Security (RLS)**: All tables protected
- **API Authentication**: JWT validation on all protected endpoints
- **Role-Based Access Control**: Consumer/merchant permissions
- **Secure Token Storage**: Expo SecureStore for JWT
- **HTTPS Only**: All API communication encrypted
- **Input Validation**: Client and server-side validation
- **Rate Limiting**: Prevent API abuse
- **QR Code Security**: Unique, single-use codes with expiration

### Environment Variables Security

Never commit `.env` files. Use `.env.sample` for documentation.

---

## 💳 Payment Integration (Stripe)

### Stripe Implementation Strategy

#### Subscription Flow
1. Merchant selects subscription plan
2. App creates Stripe Checkout Session via backend
3. User redirected to Stripe hosted checkout
4. Payment processed by Stripe
5. Webhook received by backend
6. Subscription record created/updated in database
7. User redirected back to app
8. Subscription features unlocked

#### Webhook Events to Handle
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

#### Feature Limits by Tier
```typescript
const SUBSCRIPTION_LIMITS = {
  free: {
    maxPromotions: 1,
    analyticsDepth: 7, // days
    loyaltyProgram: false,
    featuredPlacement: false
  },
  basic: {
    maxPromotions: 3,
    analyticsDepth: 30,
    loyaltyProgram: true,
    featuredPlacement: false
  },
  pro: {
    maxPromotions: 10,
    analyticsDepth: 90,
    loyaltyProgram: true,
    featuredPlacement: false
  },
  premium: {
    maxPromotions: -1, // unlimited
    analyticsDepth: 365,
    loyaltyProgram: true,
    featuredPlacement: true
  }
};
```

---

## 🔔 Push Notifications Strategy

### Expo Notifications Implementation

#### Notification Types

**For Consumers:**
1. **Proximity Notifications**: "3 new deals within 500m of your location!"
2. **Weekly Featured**: "This week's top deals are here!"
3. **Coupon Expiring**: "Your 10% off coupon expires tomorrow!"
4. **Loyalty Reward**: "Congratulations! You've earned a free coffee!"
5. **New Business**: "A new business joined Descuentia near you!"

**For Merchants:**
1. **Coupon Redeemed**: "Customer redeemed your 15% off coupon"
2. **Low Subscription**: "Your subscription will expire in 3 days"
3. **Campaign Performance**: "Your promotion was viewed 100 times today!"
4. **New Enrollment**: "A customer joined your loyalty program"

#### Implementation Steps
1. Request permission on app launch (after onboarding)
2. Register Expo Push Token with backend
3. Store token in `push_tokens` table
4. Backend sends notifications via Expo Push API
5. Handle notification tap to navigate to relevant screen
6. Respect user notification preferences

---

## 📊 Analytics & Monitoring

### Merchant Analytics Dashboard

#### Key Metrics
- **Views**: Total promotion views with trend chart
- **Claims**: Coupon claims with conversion rate
- **Redemptions**: Actual usage with redemption rate
- **Engagement Score**: Combined metric of above
- **Geographic Data**: Where customers are coming from
- **Time Analysis**: Peak hours/days for engagement
- **Campaign Comparison**: Performance across promotions

#### Data Visualization
- Line charts for trends over time
- Bar charts for campaign comparisons
- Pie charts for geographic distribution
- Heat maps for peak times

### App Performance Monitoring
- API response times
- Error rates and crash reports
- User engagement metrics
- Feature adoption rates

---

## 🚀 Development Roadmap

### Phase 1: Project Setup & Infrastructure (Week 1)
**Goal**: Complete project foundation with all configuration

**Tasks**:
- Initialize Expo project with TypeScript
- Configure NativeWind (Tailwind CSS)
- Set up folder structure (screens, components, services, navigation, store, utils, types, constants)
- Initialize Node.js/Express backend with TypeScript
- Create Supabase project and configure environment
- Set up `.env.sample` files for mobile-app and backend
- Configure absolute imports in `tsconfig.json`
- Initialize Git with proper `.gitignore`
- Create `README.md` and `CHANGELOG.md` (v0.1.0)
- Set up Redux Toolkit store structure
- Configure React Navigation with type safety

**Deliverables**:
- Running Expo app with navigation
- Backend API responding to health check
- Supabase project created
- Documentation initialized

---

### Phase 2: Database Schema & Authentication (Week 2)
**Goal**: Complete database setup with working authentication

**Tasks**:
- Create all database tables in Supabase
- Implement Row Level Security policies
- Set up Supabase Auth configuration
- Create authentication screens (Welcome, Login, Signup, Role Selection)
- Implement JWT token management
- Create auth Redux slice
- Build auth middleware for backend API
- Implement role-based access control
- Create profile management functionality
- Test authentication flows on both platforms

**Deliverables**:
- Complete database schema deployed
- Working login/signup flows
- Protected routes in app and API
- Profile CRUD operations

---

### Phase 3: Consumer Core Features - Map & Promotions (Week 3-4)
**Goal**: Build the main consumer interface

**Tasks**:
- Integrate react-native-maps with Google Maps
- Implement user location tracking
- Create custom map markers for promotions
- Build MapScreen with 3-4 block radius filtering
- Create FeaturedCarousel component
- Build PromotionCard and PromotionDetailsScreen
- Implement distance calculations
- Create BusinessDetailsScreen
- Handle location permissions
- Implement promotion claiming with QR generation
- Build API endpoints for promotions and businesses
- Test on iOS and Android

**Deliverables**:
- Fully functional map with real-time promotions
- Working featured carousel
- Promotion claiming flow complete
- QR code generation working

---

### Phase 4: Consumer Secondary Features (Week 5)
**Goal**: Complete consumer experience

**Tasks**:
- Build CouponsScreen with tabs
- Create QR code display for validation
- Implement LoyaltyCardsScreen
- Build loyalty card progress UI
- Create ProfileScreen
- Implement SettingsScreen
- Build drawer navigation
- Implement coupon expiration tracking
- Create loyalty reward redemption flow
- Add coupon history view

**Deliverables**:
- Complete consumer feature set
- All screens navigable and functional
- Data persisting correctly

---

### Phase 5: Merchant Core Features (Week 6-7)
**Goal**: Build merchant dashboard and campaign management

**Tasks**:
- Create MerchantDashboardScreen
- Build BusinessProfileScreen
- Implement image upload to Supabase Storage
- Create three campaign type forms
- Build CreateCampaignScreen with validation
- Implement CampaignListScreen
- Create QRScannerScreen with expo-barcode-scanner
- Build coupon validation flow
- Implement image compression
- Create campaign management API endpoints
- Test QR scanning on real devices

**Deliverables**:
- Working merchant dashboard
- Campaign creation for all 3 types
- QR code scanning and validation
- Business profile management

---

### Phase 6: Merchant Advanced Features & Payments (Week 8-9)
**Goal**: Add analytics and Stripe subscriptions

**Tasks**:
- Build AnalyticsScreen with charts
- Create LoyaltyProgramScreen
- Integrate Stripe SDK
- Build SubscriptionScreen
- Implement Stripe checkout flow
- Create subscription management API
- Set up Stripe webhooks
- Build loyalty stamp scanning
- Create analytics aggregation service
- Implement feature limits based on subscription

**Deliverables**:
- Working analytics dashboard
- Stripe payment integration complete
- Subscription tiers enforced
- Loyalty program management

---

### Phase 7: Push Notifications & Real-time (Week 10)
**Goal**: Implement notifications and live updates

**Tasks**:
- Set up Expo Notifications
- Implement push token registration
- Build backend notification service
- Create proximity-based notifications
- Implement weekly featured notifications
- Set up loyalty reward notifications
- Create expiring coupon reminders
- Implement Supabase Realtime subscriptions
- Update map markers in real-time
- Build notification preferences

**Deliverables**:
- Working push notifications
- Real-time map updates
- Notification preference management

---

### Phase 8: Performance Optimization & Polish (Week 11)
**Goal**: Optimize and refine the application

**Tasks**:
- Implement pagination for lists
- Add React.memo optimizations
- Optimize map marker rendering
- Implement offline mode handling
- Create error boundaries
- Add loading states and skeletons
- Implement automatic retry logic
- Cache user location and data
- Add comprehensive form validation
- Create smooth transitions and animations

**Deliverables**:
- Performant application
- Graceful error handling
- Professional UI polish

---

### Phase 9: Testing & Deployment Prep (Week 12)
**Goal**: Final testing and deployment preparation

**Tasks**:
- Write unit tests for utilities
- Test on physical iOS and Android devices
- Fix edge cases and bugs
- Configure EAS Build
- Create app icons and splash screens
- Update all documentation
- Prepare app store assets
- Integrate mission/vision into onboarding
- Final CHANGELOG update
- Create production environment configs

**Deliverables**:
- Tested, production-ready application
- Complete documentation
- App store submission assets
- Deployment instructions

---

## 📁 Project Structure

### Mobile App Structure (`/mobile-app`)

```
mobile-app/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── consumer/
│   │   │   ├── MapMarker.tsx
│   │   │   ├── PromotionCard.tsx
│   │   │   ├── FeaturedCarousel.tsx
│   │   │   ├── CouponItem.tsx
│   │   │   ├── LoyaltyCardItem.tsx
│   │   │   └── QRCodeDisplay.tsx
│   │   └── merchant/
│   │       ├── MetricCard.tsx
│   │       ├── PromotionForm.tsx
│   │       ├── QRScanner.tsx
│   │       ├── ChartView.tsx
│   │       ├── SubscriptionCard.tsx
│   │       └── ImageUploader.tsx
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── RoleSelectionScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── consumer/
│   │   │   ├── MapScreen.tsx
│   │   │   ├── PromotionDetailsScreen.tsx
│   │   │   ├── BusinessDetailsScreen.tsx
│   │   │   ├── CouponsScreen.tsx
│   │   │   ├── LoyaltyCardsScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── AboutScreen.tsx
│   │   └── merchant/
│   │       ├── DashboardScreen.tsx
│   │       ├── BusinessProfileScreen.tsx
│   │       ├── PromotionListScreen.tsx
│   │       ├── CreatePromotionScreen.tsx
│   │       ├── EditPromotionScreen.tsx
│   │       ├── QRScannerScreen.tsx
│   │       ├── AnalyticsScreen.tsx
│   │       ├── LoyaltyProgramScreen.tsx
│   │       └── SubscriptionScreen.tsx
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── ConsumerDrawer.tsx
│   │   ├── ConsumerTabs.tsx
│   │   ├── MerchantTabs.tsx
│   │   └── types.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── promotionsSlice.ts
│   │   │   └── notificationsSlice.ts
│   │   └── api/
│   │       ├── baseApi.ts
│   │       ├── authApi.ts
│   │       ├── promotionsApi.ts
│   │       ├── businessApi.ts
│   │       └── subscriptionsApi.ts
│   │
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── stripe.ts
│   │   ├── notifications.ts
│   │   ├── location.ts
│   │   ├── qrCode.ts
│   │   └── storage.ts
│   │
│   ├── utils/
│   │   ├── distance.ts
│   │   ├── validation.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── business.ts
│   │   ├── promotion.ts
│   │   ├── coupon.ts
│   │   ├── loyalty.ts
│   │   └── subscription.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── subscriptionTiers.ts
│   │   └── config.ts
│   │
│   └── App.tsx
│
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── app.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── babel.config.js
├── .env.sample
└── .gitignore
```

### Backend Structure (`/backend`)

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── business.routes.ts
│   │   ├── promotion.routes.ts
│   │   ├── coupon.routes.ts
│   │   ├── loyalty.routes.ts
│   │   ├── subscription.routes.ts
│   │   ├── analytics.routes.ts
│   │   └── webhook.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── business.controller.ts
│   │   ├── promotion.controller.ts
│   │   ├── coupon.controller.ts
│   │   ├── loyalty.controller.ts
│   │   ├── subscription.controller.ts
│   │   ├── analytics.controller.ts
│   │   └── webhook.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── services/
│   │   ├── supabase.service.ts
│   │   ├── stripe.service.ts
│   │   ├── notification.service.ts
│   │   ├── maps.service.ts
│   │   ├── analytics.service.ts
│   │   └── qrCode.service.ts
│   │
│   ├── types/
│   │   ├── express.d.ts
│   │   ├── auth.types.ts
│   │   ├── business.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/
│   │   ├── distance.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── stripe.ts
│   │   └── env.ts
│   │
│   └── index.ts
│
├── package.json
├── tsconfig.json
├── .env.sample
└── .gitignore
```

---

## 🔧 Environment Configuration

### Mobile App `.env.sample`

```env
# ===================================
# Descuentia Mobile App - Environment Variables
# ===================================
# Copy this file to .env and fill in your actual values
# DO NOT commit .env to version control

# ===================================
# SUPABASE CONFIGURATION
# ===================================
# Get these from: https://app.supabase.com/project/_/settings/api
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# ===================================
# BACKEND API
# ===================================
# Your backend API URL
API_URL=http://localhost:3000
# For production:
# API_URL=https://your-backend-domain.com

# ===================================
# GOOGLE MAPS
# ===================================
# Get your key at: https://console.cloud.google.com/google/maps-apis
# Enable: Maps SDK for Android, Maps SDK for iOS, Geocoding API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# ===================================
# STRIPE
# ===================================
# Get your publishable key from: https://dashboard.stripe.com/apikeys
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key-here

# ===================================
# EXPO CONFIGURATION
# ===================================
# Your Expo project ID (from app.json or eas.json)
EXPO_PROJECT_ID=your-expo-project-id-here

# ===================================
# APP CONFIGURATION
# ===================================
# App environment
ENV=development
# Options: development, staging, production

# Default map settings
DEFAULT_LATITUDE=40.416775
DEFAULT_LONGITUDE=-3.703790
DEFAULT_ZOOM_LEVEL=15
DEFAULT_RADIUS_KM=2.0

# QR Code configuration
QR_CODE_EXPIRATION_HOURS=24

# ===================================
# OPTIONAL: DEVELOPMENT SETTINGS
# ===================================
# Enable debug logs
DEBUG=true

# API timeout (milliseconds)
API_TIMEOUT=30000

# Enable mock data for development
USE_MOCK_DATA=false
```

### Backend `.env.sample`

```env
# ===================================
# Descuentia Backend API - Environment Variables
# ===================================
# Copy this file to .env and fill in your actual values
# DO NOT commit .env to version control

# ===================================
# SERVER CONFIGURATION
# ===================================
# Server port
PORT=3000

# Node environment
NODE_ENV=development
# Options: development, staging, production

# API URL (for webhooks and redirects)
API_URL=http://localhost:3000

# Frontend URL (for CORS and redirects)
FRONTEND_URL=exp://192.168.1.100:19000
# For production:
# FRONTEND_URL=https://your-app-url.com

# ===================================
# SUPABASE CONFIGURATION
# ===================================
# Get these from: https://app.supabase.com/project/_/settings/api
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
# WARNING: Service role key bypasses RLS. Keep it secret!

# ===================================
# STRIPE CONFIGURATION
# ===================================
# Get your keys from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here

# Subscription price IDs (create in Stripe Dashboard)
STRIPE_PRICE_BASIC=price_basic_monthly_id
STRIPE_PRICE_PRO=price_pro_monthly_id
STRIPE_PRICE_PREMIUM=price_premium_monthly_id

# ===================================
# GOOGLE MAPS API
# ===================================
# Same key as mobile app or separate server key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# ===================================
# EXPO PUSH NOTIFICATIONS
# ===================================
# Expo access token for sending push notifications
# Get from: https://expo.dev/accounts/[account]/settings/access-tokens
EXPO_ACCESS_TOKEN=your-expo-access-token-here

# ===================================
# SECURITY
# ===================================
# JWT secret for additional token signing (optional)
JWT_SECRET=your-random-secret-string-here

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===================================
# OPTIONAL: DEVELOPMENT SETTINGS
# ===================================
# Enable debug logs
DEBUG=true

# Log level
LOG_LEVEL=info
# Options: error, warn, info, debug

# Enable Stripe test mode
STRIPE_TEST_MODE=true
```

---

## 🧪 Testing Strategy

### Unit Testing
- **Framework**: Jest with React Native Testing Library
- **Coverage**: Utility functions, validators, formatters, distance calculations
- **Target**: 70%+ code coverage on utilities

### Integration Testing
- **Focus**: API endpoints, database operations, Stripe webhooks
- **Tools**: Supertest for API testing
- **Database**: Test database or Supabase test project

### End-to-End Testing (Optional for MVP)
- **Framework**: Detox or Maestro
- **Scenarios**: Critical user flows (signup, claim coupon, create promotion)

### Manual Testing
- **Devices**: Physical iOS and Android devices
- **Scenarios**: All user flows, edge cases, error states
- **Location Testing**: Various locations and permissions states

---

## 📱 App Store Deployment

### iOS (Apple App Store)
1. **Requirements**:
   - Apple Developer Account ($99/year)
   - App icon (1024x1024px)
   - Screenshots for all device sizes
   - App privacy details
   - App description (EN/ES)

2. **Build Process**:
   - Configure `eas.json` for iOS builds
   - Run `eas build --platform ios --profile production`
   - Submit to App Store via EAS Submit or manual upload

3. **Review Considerations**:
   - Clear description of discount/coupon functionality
   - Privacy policy URL
   - Location usage justification
   - Camera usage justification (QR scanning)

### Android (Google Play Store)
1. **Requirements**:
   - Google Play Developer Account ($25 one-time)
   - App icon (512x512px)
   - Feature graphic (1024x500px)
   - Screenshots
   - App description (EN/ES)

2. **Build Process**:
   - Configure `eas.json` for Android builds
   - Run `eas build --platform android --profile production`
   - Submit to Google Play via EAS Submit or manual upload

3. **Review Considerations**:
   - Location permissions justification
   - Camera permissions justification
   - Data safety section completion

---

## 🚨 Risk Management & Considerations

### Technical Risks
- **Map Performance**: Large number of markers may impact performance
  - **Mitigation**: Implement clustering, lazy loading, pagination
  
- **Real-time Sync**: Supabase Realtime has connection limits
  - **Mitigation**: Use polling fallback, batch updates

- **QR Code Security**: Codes could be shared or duplicated
  - **Mitigation**: Single-use codes, expiration, validation logs

### Business Risks
- **Merchant Adoption**: Merchants may not want to pay
  - **Mitigation**: Free tier, clear ROI demonstrations

- **Consumer Trust**: Users may be wary of location tracking
  - **Mitigation**: Clear privacy policy, optional location, transparent usage

- **Competition**: Established players (Groupon, RetailMeNot)
  - **Mitigation**: Focus on local businesses, integrated loyalty, charitable mission

### Legal Considerations
- **GDPR/Privacy**: User data collection and location tracking
  - **Mitigation**: Privacy policy, consent management, data deletion

- **Terms of Service**: Clear terms for merchants and consumers
  - **Mitigation**: Legal review, clear cancellation policies

- **Payment Processing**: PCI compliance through Stripe
  - **Mitigation**: Use Stripe Checkout (Stripe handles compliance)

---

## 💰 Monetization Strategy

### Revenue Streams
1. **Merchant Subscriptions** (Primary)
   - Free: Limited features for trial
   - Basic: $19/month - Small businesses
   - Pro: $49/month - Medium businesses
   - Premium: $99/month - Large businesses with featured placement

2. **Featured Placement** (Secondary)
   - Top carousel placement for non-premium merchants
   - Pay-per-feature model: $50/week

3. **Future Opportunities**
   - Transaction fees (small % of redemptions)
   - Advertising for non-paying businesses
   - White-label solutions for cities/regions
   - B2B analytics and insights

### Cancer Charity Commitment
- 5% of all revenue donated to cancer research
- Display impact metrics in app (total donated)
- Annual impact report
- Partnership with recognized cancer organizations

---

## 📈 Success Metrics (KPIs)

### User Metrics
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User retention rate (D1, D7, D30)
- Average session duration
- Coupons claimed per user
- Loyalty cards enrolled per user

### Merchant Metrics
- Total merchants registered
- Active merchants (with live promotions)
- Paid subscription conversion rate
- Average promotions per merchant
- Merchant retention rate
- Average redemption rate per promotion

### Financial Metrics
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Churn rate
- Total charity contributions

### Engagement Metrics
- Promotion views
- Claim rate (views to claims)
- Redemption rate (claims to redemptions)
- Loyalty program enrollment rate
- Push notification opt-in rate
- Average distance traveled for redemption

---

## 🎯 Post-Launch Roadmap

### Version 0.2.0 (Enhancements)
- Social sharing of promotions
- Friend referral system
- Favorite businesses
- Promotion reminders
- Advanced filtering (category, discount type)

### Version 0.3.0 (Gamification)
- User levels and badges
- Points system
- Leaderboards
- Challenges and quests
- Exclusive rewards for active users

### Version 0.4.0 (Social Features)
- User reviews and ratings
- Photo uploads for redemptions
- Social feed of nearby activity
- Friends system
- Gift coupons to friends

### Version 0.5.0 (Merchant Tools)
- Bulk promotion creation
- Automated campaigns
- A/B testing for promotions
- Advanced segmentation
- Email marketing integration

### Version 1.0.0 (Full Launch)
- Complete feature set
- Multiple languages (ES, EN, FR, PT)
- Multiple countries/regions
- Enterprise features
- White-label options

---

## 📚 Documentation Structure

### Required Documentation Files

1. **README.md** - Project overview, setup instructions, tech stack
2. **CHANGELOG.md** - Version history starting at v0.1.0
3. **API.md** - Complete API documentation with examples
4. **DATABASE_SCHEMA.md** - Database tables, relationships, RLS policies
5. **DEPLOYMENT.md** - Deployment instructions for backend and mobile app
6. **CONTRIBUTING.md** - Contribution guidelines (if open source)
7. **PRIVACY_POLICY.md** - Privacy policy for app stores
8. **TERMS_OF_SERVICE.md** - Terms of service for users and merchants

---

## 🤝 Team & Collaboration

### Recommended Team Structure (if scaling)
- **1 Frontend Developer**: React Native/Expo
- **1 Backend Developer**: Node.js/TypeScript
- **1 Designer**: UI/UX, branding
- **1 QA/Tester**: Manual and automated testing
- **1 Product Manager**: Strategy, roadmap
- **Part-time**: Marketing, legal consultation

### Development Workflow
1. Feature branches from `main`
2. Pull requests with code review
3. Staging environment for testing
4. Production deployment after approval
5. Monitoring and quick hotfixes

### Git Commit Convention (with emojis per user rules)
```
✨ feat: Add weekly featured promotions carousel
🐛 fix: Resolve QR code scanning on Android
📝 docs: Update API documentation
🎨 style: Improve map marker appearance
♻️ refactor: Optimize distance calculations
⚡️ perf: Add pagination to promotion lists
✅ test: Add unit tests for validators
🔧 chore: Update dependencies
```

---

## 🎉 Conclusion

This production plan provides a comprehensive roadmap for building Descuentia from ground up to a production-ready React Native application. The plan emphasizes:

- **User-Centric Design**: Intuitive interfaces for both consumers and merchants
- **Scalable Architecture**: Supabase backend with proper RLS and API structure
- **Revenue Model**: Clear subscription tiers with Stripe integration
- **Social Impact**: Commitment to cancer research donations
- **Production Quality**: Security, performance, testing, and monitoring

### Next Immediate Steps
1. Create Supabase project and get credentials
2. Create Google Maps API key with required APIs enabled
3. Create Stripe account and configure products/prices
4. Initialize mobile app with Expo
5. Set up backend API structure
6. Begin Phase 1 implementation

### Estimated Timeline
- **MVP (Phases 1-4)**: 5-6 weeks
- **Full Feature Set (Phases 1-7)**: 10-12 weeks
- **Production Ready (Phases 1-9)**: 12-14 weeks

### Budget Considerations
- **Development Tools**: Free (Expo, Supabase free tier, Stripe test mode)
- **Production Services**:
  - Supabase: ~$25/month (Pro plan)
  - Google Maps: ~$50-200/month (based on usage)
  - Expo EAS: Free tier initially, $29/month for production
  - Stripe: 2.9% + $0.30 per transaction
  - App Store: $99/year (iOS) + $25 one-time (Android)

**Total Estimated Monthly Costs**: $100-300 depending on usage

---

*This document should be treated as a living document and updated as the project evolves. Version: 0.1.0*
