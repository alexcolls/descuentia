# Changelog

All notable changes to the Descuentia project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Progress
- Consumer map-based interface (Phase 3)
- Merchant dashboard (Phase 5)

### Planned Features
- Promotions and coupons functionality
- Loyalty programs
- Payment integration with Stripe
- Push notifications
- Analytics dashboard

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
