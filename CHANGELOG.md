# Changelog

All notable changes to the Descuentia project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Progress
- Merchant promotion management (Phase 5)
- QR code scanning (Phase 5)

### Planned Features
- Loyalty programs
- Payment integration with Stripe
- Push notifications
- Advanced analytics

---

## [0.9.0] - 2025-11-05

### Added - Phase 5 Part 1: Merchant Dashboard 📊

#### DashboardScreen (344 lines)
- 🏛️ Comprehensive merchant dashboard
- 📊 Stats grid with 6 key metrics:
  * Active promotions count
  * Total redemptions
  * Today's redemptions
  * Total views
  * Total claims
  * Total shares
- 👋 Personalized header with business name
- 🔄 Pull-to-refresh functionality
- ⚡ Real-time data from Supabase

#### Quick Actions Grid
- ➕ New Promotion (placeholder)
- 📷 Scan QR Code (placeholder)
- 🎯 My Promotions (placeholder)
- 📊 Analytics (placeholder)
- 🎨 Beautiful colored cards
- 💆 Touch-optimized buttons

#### Business Integration
- 🏪 Automatically loads merchant's business
- 🛡️ Handles missing business gracefully
- 📍 Links to business setup if needed
- 🔗 Associates all stats with business ID

#### Analytics & Stats
- 📊 Active promotions count
- ✅ Total redemptions tracking
- 📅 Today's redemptions (time-filtered)
- 👀 View count from analytics_events
- 🎫 Claim count from analytics_events
- 📤 Share count from analytics_events
- 🔍 Complex queries with joins

#### UI Features
- 🎨 Color-coded stats (primary, green, orange, blue, purple)
- 📋 Recent activity section (empty state)
- 💡 Pro tips section with advice
- 📦 Grid layout for quick actions
- 📱 Responsive design
- 🔄 Loading states

#### Navigation Updates
- 🧭 Merchant dashboard as main screen
- 🔗 Integrated into RootNavigator
- 🔀 Role-based routing (merchant vs consumer)

**Phase 5 Progress**: 20% Complete 🚀
- ✅ Dashboard with stats
- 🔄 Promotion creation
- 🔄 QR code scanner
- 🔄 Promotions list
- 🔄 Analytics details

---

## [0.8.0] - 2025-11-05

### Added - Phase 4 Complete: Sharing & Viral Growth 📤

#### Share Utilities (147 lines)
- 📤 sharePromotion: Share deals via native share sheet
  * Creates shareable deep link (descuentia.eu/promo/{id})
  * Beautiful message with emoji and details
  * Works with all native share targets (SMS, WhatsApp, etc.)
  * Analytics tracking
- 🎫 shareCoupon: Share claimed coupons
  * Encourages friends to download app
  * Tracks sharing activity
- 📱 shareApp: Share Descuentia itself
  * Mission-focused message (cancer research)
  * Download link included
- 📋 copyPromotionLink: Copy link to clipboard
  * Quick share via paste
  * Clipboard API integration
  * Success toast notification

#### Integration Points
- 🎯 PromotionDetailsScreen:
  * Share button in header (top-left corner)
  * "Share Deal" button in actions
  * Native share sheet opens
- 🎫 CouponDetailScreen:
  * Share button in header (active coupons only)
  * "Share" button alongside directions
  * Encourages viral growth
- 👤 ProfileScreen:
  * "Share App" in quick actions
  * Easy access to spread the word

#### Analytics Integration
- 📈 Track every share action:
  * promotion shares
  * coupon shares
  * app shares
  * copy link actions
- 📊 Record sharing platform (iOS activityType)
- 🔗 Link share data to promotions and users

#### Features
- One-tap sharing to any app
- Deep linking support
- Beautiful share messages with emojis
- Mission-focused messaging
- Viral growth mechanics
- Analytics for all shares
- Copy to clipboard option
- iOS and Android support

#### Dependencies
- 📦 @react-native-clipboard/clipboard for copy functionality
- 📦 React Native Share API (built-in)

**Phase 4: Consumer Secondary Features** 🎉 100% COMPLETE!
- ✅ Search and filters
- ✅ Favorites/bookmarks  
- ✅ User profile management
- ✅ Tab navigation
- ✅ Promotion sharing

**Complete Consumer Experience** 🚀
- Discovery: Map, search, filters
- Engagement: Claim, redeem, QR codes
- Management: Profile, coupons, favorites
- Growth: Sharing, viral mechanics
- Navigation: Beautiful tabs, smooth flow

---

## [0.7.0] - 2025-11-05

### Added - Phase 4 Part 2: Profile & Tab Navigation 👤

#### ProfileScreen (321 lines)
- 👤 User profile with avatar (first letter of name)
- 📊 Stats cards showing:
  * Active coupons count
  * Redeemed offers count
  * Total savings in euros
- ✏️ Editable profile information:
  * Full name (required)
  * Phone number (optional)
  * Email (read-only)
  * Account type badge
- 💾 Save/Cancel buttons with loading states
- 🔗 Quick action links:
  * My Coupons
  * Favorites
  * Settings
- 📝 About section with mission statement
- 💪 Version display
- 🚪 Sign out with confirmation

#### Bottom Tab Navigation (70 lines)
- 🧭 ConsumerTabs navigator with 3 tabs:
  * 🗺️ Discover (Map)
  * 🎫 Coupons
  * 👤 Profile
- 🎨 Beautiful tab bar design:
  * Primary color for active tabs
  * Gray for inactive tabs
  * Emoji icons for each tab
  * Optimized height and padding
- ⚡ Smooth tab switching
- 📱 Mobile-optimized layout

#### Navigation Updates
- 🎯 ConsumerMain as tab container
- 📱 Detail screens as modals over tabs
- 🔗 Fixed navigation between tabs and screens
- ♻️ Proper back navigation handling

#### Profile Features
- Edit profile inline
- Real-time stats calculation
- Savings estimation based on redeemed coupons
- Profile data persistence
- Form validation
- Error handling with user feedback
- Confirmation dialogs for destructive actions

#### UI Enhancements
- Gradient header with profile info
- Stats cards with visual hierarchy
- Clean section separation
- Consistent spacing and typography
- Responsive layout
- Beautiful color scheme

**Phase 4 Progress**: 90% Complete 🎆
- ✅ Search and filters
- ✅ Favorites/bookmarks
- ✅ User profile management
- ✅ Tab navigation
- 🔄 Promotion sharing (final feature)

---

## [0.6.0] - 2025-11-05

### Added - Phase 4 Part 1: Search, Filters & Favorites 🔍

#### SearchFilters Component (286 lines)
- 🔍 Real-time search bar with clear button
- 🏛️ Filter modal with 3 sections:
  * Categories (6 options: Restaurant, Retail, Services, Entertainment, Health, Beauty)
  * Promotion Types (Weekly Special, Limited Time, Always On)
  * Maximum Distance (1km, 3km, 5km, 10km, 25km)
- 🏷️ Active filter pills with quick removal
- 🔢 Filter counter badge
- ♻️ Reset all filters button
- 📱 Beautiful bottom sheet modal UI
- ⚡ Auto-apply on selection

#### Promotions Slice Enhancements
- 📦 Added filters state (searchQuery, categories, types, maxDistance)
- 🎯 applyFilters helper function:
  * Search across title, business name, description, category
  * Filter by multiple categories
  * Filter by promotion types
  * Filter by distance from user
- 📄 filteredPromotions separate array
- 🔄 Actions: setSearchQuery, toggleCategory, toggleType, setMaxDistance, resetFilters
- ⚡ Auto-apply filters on data fetch

#### Favorites Service (152 lines)
- ❤️ addFavorite: Bookmark promotions
- 🗑️ removeFavorite: Remove bookmarks
- 📚 getFavorites: Fetch user's favorites with full details
- ✔️ isFavorited: Check if promotion is favorited
- 🎯 getFavoriteIds: Quick lookup array
- 🚫 Duplicate prevention
- 📈 Analytics tracking on favorite

#### Database Migration
- 📦 Created favorites table with unique constraint
- 🔐 Row Level Security policies
- 📊 Optimized indexes for performance
- 🔗 Foreign keys to users and promotions

#### PromotionCard Updates
- ❤️/🤍 Favorite toggle button (filled/outlined heart)
- 💆 Tap to favorite without navigating
- 🔴 Visual feedback on favorite status
- 📍 Positioned alongside discount badge

#### MapScreen Integration
- 🔍 Search bar at top of screen
- 🏛️ Filter button with active count badge
- 🎯 Uses filteredPromotions for markers
- 📊 Live counter shows filtered results
- 👀 Active filter pills below search
- 📍 Markers update based on filters

#### Features
- Search promotions by keywords
- Filter by category (restaurant, retail, etc.)
- Filter by promotion type (weekly, limited, always on)
- Filter by distance (1-25km radius)
- Save favorite promotions
- Quick access to favorites
- Real-time search results
- Multiple filters simultaneously
- Filter pills for active filters
- One-tap filter removal

**Phase 4 Progress**: 50% Complete 🚀
- ✅ Search and filters
- ✅ Favorites/bookmarks
- 🔄 User profile management
- 🔄 Settings screen
- 🔄 Sharing promotions

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
