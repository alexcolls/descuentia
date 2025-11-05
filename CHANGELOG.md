# Changelog

All notable changes to the Descuentia project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Progress
- Merchant dashboard (Phase 5)
- Loyalty programs (Phase 4)

### Planned Features
- Payment integration with Stripe
- Push notifications
- Analytics dashboard

---

## [0.5.0] - 2025-11-05

### Added - Phase 3 Part 3: Coupon Claiming & Management 🎫

#### Coupon Service (235 lines)
- ✅ claimPromotion: Generate unique QR codes and create coupons
- 🔐 Check for existing active coupons (prevent duplicates)
- 🏷️ QR code format: COUPON-{promoId}-{userId}-{timestamp}-{random}
- 📅 Auto-expiration (30 days from claim)
- 📊 Track analytics events on claim
- 📝 getUserCoupons: Fetch with filters (claimed/redeemed/expired)
- 🔍 getCouponById: Single coupon with full details
- ⏰ isCouponExpired: Check expiration status
- 📆 getTimeUntilExpiration: Human-readable time remaining

#### Coupons Redux Slice (240 lines)
- 📦 State management for coupons (active, redeemed, selected)
- ⚡ claimCoupon async thunk
- 🔄 fetchUserCoupons, fetchActiveCoupons, fetchRedeemedCoupons
- 📌 fetchCouponDetails for single coupon
- ❌ clearSelectedCoupon, clearError actions
- 💾 Integrated with Redux store

#### CouponDetailScreen (302 lines)
- 🖼️ Hero image with status badge (Active/Redeemed/Expired)
- 📱 QR Code display using react-native-qrcode-svg (280px responsive)
- 🎯 Large discount badge
- ⏰ Countdown timer (days/hours/minutes left)
- 📅 Claimed and redeemed timestamps
- 📝 Full promotion description and terms
- 🏢 Business information card
- 📞 Tap-to-call business
- 🧭 Get directions button
- 👁️ Different states for active/redeemed/expired coupons

#### CouponsScreen (245 lines)
- 🃏 List view with tabs (Active / Redeemed)
- 📄 Coupon cards with discount badges
- ⏰ Time remaining for active coupons
- ✅ Redemption date for used coupons
- 🔄 Pull-to-refresh
- 🎭 Empty states for both tabs
- 📊 Counter in header (X active • Y redeemed)
- 🖼️ Image thumbnails with category fallback emojis

#### Promotion Claiming Integration
- ✅ "Claim This Offer" button in PromotionDetailsScreen
- ⏳ Loading state during claim
- ✅ Success alert with "View Coupon" option
- ⚠️ Error handling (duplicate, auth, network)
- 🧭 Direct navigation to claimed coupon

#### Navigation Updates
- 🔗 Added CouponsScreen and CouponDetailScreen routes
- 🎫 "My Coupons" button in MapScreen header
- 📦 Seamless flow: Browse → Claim → View Coupon → Redeem

#### Dependencies
- 📦 Installed react-native-qrcode-svg for QR code generation
- 📦 Installed react-native-svg (peer dependency)

#### Features
- Claim promotions with one tap
- Generate unique QR codes for each coupon
- View all coupons in organized tabs
- Display QR codes for merchant scanning
- Track expiration with countdown timers
- Prevent duplicate claims
- Analytics tracking on claims
- Beautiful UI with status indicators
- Smooth navigation flow

**Phase 3: Consumer Core Features**: 100% COMPLETE 🎉
- ✅ Location service with distance calculation
- ✅ Promotions Redux slice with nearby/featured fetching
- ✅ PromotionCard & FeaturedCarousel components
- ✅ MapScreen with Google Maps integration
- ✅ Custom promotion markers
- ✅ PromotionDetailsScreen
- ✅ Coupon claiming with QR codes
- ✅ CouponsScreen with tabs
- ✅ CouponDetailScreen with QR display
- ✅ Full navigation flow

---

## [0.4.0] - 2025-11-05

### Added - Phase 3 Part 2: Map & Promotion Discovery 🗺️

#### Map Screen (260 lines)
- 🗺️ Google Maps integration with react-native-maps
- 📍 Real-time user location tracking
- 📌 Custom promotion markers with discount badges
- 🎨 Beautiful marker design with pin shape
- 🔄 Pull-to-refresh functionality
- 📊 Live promotion counter in header
- 👋 Personalized welcome header with user name
- ⚡ Loading states and empty states
- 🎯 Featured carousel overlay at top of map
- 🃏 Expandable promotion cards on marker tap
- 📱 Smooth animations and transitions
- 🌍 Fallback to Madrid coordinates when location unavailable
- 🔐 Location permission handling with friendly alerts

#### Promotion Details Screen (273 lines)
- 📄 Full promotion information display
- 🖼️ Hero image with fallback emoji icons
- 🏷️ Discount badges (percentage, fixed, special)
- ⏰ Type indicators (Weekly Special, Limited Time, Always On)
- 📅 Expiration date display for time-based offers
- 📝 Description and terms & conditions
- 🏢 Business information card (address, phone, category)
- 📞 Tap-to-call business phone
- 🧭 Get directions via Google Maps integration
- 📏 Distance from user location
- 🎯 "Claim This Offer" primary CTA
- ← Back button navigation
- ✨ Beautiful UI with gradient overlays

#### Navigation Updates
- 🧭 Added Map screen as consumer home
- 🔗 Added PromotionDetails screen to stack
- 🚀 Seamless navigation between screens
- 📱 Proper route parameter passing

#### Features
- Interactive map with promotion discovery
- Featured promotions carousel
- Click markers to see promotion cards
- Navigate to full promotion details
- Call businesses directly from app
- Get directions to business location
- Beautiful empty states
- Responsive design
- Optimized performance

**Phase 3 Map & Discovery Status**: 80% Complete 🎯
- ✅ Location service with distance calculation
- ✅ Promotions Redux slice with nearby/featured fetching
- ✅ PromotionCard component
- ✅ FeaturedCarousel component
- ✅ MapScreen with Google Maps
- ✅ Custom promotion markers
- ✅ PromotionDetailsScreen
- ✅ Navigation integration
- 🔄 Coupon claiming (next up)
- 🔄 Promotion filtering UI

---

## [0.3.0] - 2025-11-05

### Added - Phase 2: Authentication Complete ✅

#### Navigation & App Integration
- 🧭 RootNavigator with auth flow switching
- 🔄 Automatic session checking on app launch
- 👂 Real-time auth state listener (Supabase)
- 🔐 Role-based navigation (consumer vs merchant)
- ⚡ Loading screen during session check
- 📱 App.tsx integrated with Redux Provider
- 🎯 Placeholder screens for Consumer and Merchant

#### Backend Auth Middleware
- 🛡️ JWT token verification middleware
- 👤 User authentication from bearer tokens
- 🎭 Role-based access control (RBAC)
- 🔒 Protected route examples (/api/profile)
- 🏪 Merchant-only route examples (/api/merchant/dashboard)
- ⚙️ Optional auth middleware for public routes
- 📝 TypeScript Request extension with user data

#### Features
- Auto-redirect to appropriate screen based on role
- Session persistence across app restarts
- Token refresh handling
- Sign out clears all auth state
- Backend validates JWT with Supabase
- Role enforcement at API level

**Phase 2 Status**: 100% Complete 🎉
- ✅ Database schema (10 tables with RLS)
- ✅ Supabase client configuration
- ✅ Redux auth state management
- ✅ Login & Signup screens
- ✅ Navigation setup
- ✅ Backend auth middleware

---

## [0.2.0] - 2025-11-05

### Added - Phase 1: Project Setup & Infrastructure

#### Mobile App (Expo + React Native)
- ✨ Initialized Expo project with TypeScript template
- 📁 Complete folder structure (screens, components, navigation, store, services, utils, types, constants)
- 🎨 NativeWind (Tailwind CSS) configured with custom color scheme
- 📦 Installed core dependencies:
  - React Navigation (native, stack, drawer)
  - Redux Toolkit with RTK Query
  - Supabase client
  - React Native Maps
  - Expo modules (location, notifications, camera, barcode-scanner, image-picker)
- ⚙️ TypeScript configured with absolute imports (@/* paths)
- 🔧 Environment variables template (.env.sample)

#### Backend API (Express + TypeScript)
- 🚀 Express server with TypeScript
- 📁 Complete folder structure (routes, controllers, services, middleware, types, utils, config)
- ✅ Health check endpoint at /health
- 🌐 CORS configured for frontend
- 📦 Installed dependencies:
  - Express, CORS, dotenv
  - Supabase client (service role)
  - Stripe SDK
  - Google Maps Services
- ⚙️ TypeScript configured with absolute imports
- ✔️ Successful TypeScript compilation
- 🔧 Environment variables template (.env.sample)
- 🛠️ NPM scripts: dev (nodemon), build (tsc), start

#### Project Infrastructure
- 🙈 Comprehensive .gitignore (env files, node_modules, builds, IDE files)
- 📝 Documentation updated
- ✅ All dependencies installed with 0 vulnerabilities
- 🔒 Security: No .env files committed
- 🎯 Both frontend and backend ready for Phase 2 development

---

## [0.1.0] - 2025-11-04

### Added
- 📝 Initial project documentation
- 📋 Complete production plan (PRODUCTION_PLAN.md)
- 📖 README with project overview
- 📄 CHANGELOG initialization
- 🎯 Mission, vision, and values definition
- 🏗️ Technical architecture specification
- 🗄️ Complete database schema design
- 🔐 Security and authentication strategy
- 💳 Payment integration plan (Stripe)
- 🔔 Push notification strategy
- 📊 Analytics and monitoring plan
- 🚀 9-phase development roadmap
- 📱 Feature specifications for consumers and merchants
- 🎨 UI/UX navigation structure
- ⚙️ Environment configuration templates

### Project Structure
- Repository initialized with Git
- Basic project structure defined
- Documentation framework established
- Development phases outlined (12-14 weeks timeline)

### Tech Stack Defined
- **Frontend**: Expo SDK 50+, React Native, TypeScript, NativeWind
- **Backend**: Node.js 18+, Express, TypeScript
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth (JWT)
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **Maps**: Google Maps Platform
- **Notifications**: Expo Notifications

### Notes
- This is the planning and documentation phase
- No code implementation yet
- All documentation and code will be in English
- Version will remain in 0.x.x until full production release
- 5% of revenue committed to cancer research from day one

---

## Version History Guidelines

### Version Format
- **0.x.x**: Pre-release versions (current phase)
- **1.x.x**: Production release (when explicitly approved)
- **x.1.x**: Minor version for new features
- **x.x.1**: Patch version for bug fixes

### Commit Message Convention
```
✨ feat: New feature
🐛 fix: Bug fix
📝 docs: Documentation changes
🎨 style: Code formatting
♻️ refactor: Code refactoring
⚡️ perf: Performance improvements
✅ test: Tests
🔧 chore: Configuration/dependencies
```

### Future Milestones
- **0.2.0**: Project setup and infrastructure
- **0.3.0**: Database and authentication
- **0.4.0**: Consumer core features
- **0.5.0**: Consumer secondary features
- **0.6.0**: Merchant core features
- **0.7.0**: Merchant advanced features and payments
- **0.8.0**: Push notifications and real-time
- **0.9.0**: Performance optimization and polish
- **1.0.0**: Production release (pending approval)

---

[Unreleased]: https://github.com/quantium/descuentia/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/quantium/descuentia/releases/tag/v0.2.0
[0.1.0]: https://github.com/quantium/descuentia/releases/tag/v0.1.0
