# 🎁 Descuentia

**Incredible discounts near you!**

Descuentia is a mobile-first marketplace connecting consumers with local businesses through discounts, loyalty programs, and promotional campaigns. Save money on everyday purchases while supporting traditional commerce and contributing to cancer research.

---

## 🎯 Mission, Vision & Values

### Mission
Offer discounts to promote user savings and boost local commerce, supporting cancer research with a portion of our profits from day one.

### Vision
Become a reference marketplace for savings and responsible consumption in both cities and towns, fostering connections between people while supporting medical causes.

### Values
- Help families save money in their daily lives
- Strengthen traditional commerce and local employment
- Support medical causes, particularly cancer research
- Promote responsible consumption and community engagement

---

## 📱 Features

### For Consumers
- 🗺️ **Interactive Map**: Discover discounts within 3-4 blocks using map-based interface
- 🎪 **Featured Deals**: Weekly eye-catching promotions (2x1, 3x2, special offers)
- 🎫 **Digital Coupons**: Claim and redeem coupons with QR codes
- 💳 **Loyalty Cards**: Digital punch cards replacing physical loyalty cards
- 🔔 **Notifications**: Get alerts for nearby deals and expiring coupons
- 👤 **Profile Management**: Manage preferences and track coupon history

### For Merchants
- 📊 **Dashboard**: Overview of active promotions and performance metrics
- 🎯 **Three Campaign Types**:
  - Time-based campaigns (seasonal promotions)
  - Fixed discounts (permanent app user discounts)
  - Weekly specials (impulse-driving deals)
- 📸 **QR Scanner**: Validate customer coupons and award loyalty stamps
- 📈 **Analytics**: Track views, claims, redemptions, and customer engagement
- 🏆 **Loyalty Programs**: Create custom loyalty programs with rewards
- 💰 **Subscriptions**: Flexible pricing tiers with Stripe integration

---

## 🏗️ Tech Stack

### Mobile Application
- **Framework**: Expo SDK 50+ with React Native
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: React Navigation v6
- **Maps**: react-native-maps with Google Maps API
- **Notifications**: expo-notifications

### Backend API
- **Runtime**: Node.js v18+ with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **Real-time**: Supabase Realtime

---

## 📂 Project Structure

See [PRODUCTION_PLAN.md](./PRODUCTION_PLAN.md) for complete project structure and detailed development plan.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Latest version
- **Expo CLI**: `npm install -g expo-cli` (optional, can use npx)
- **Git**: For version control

### Required Services

Before starting, create accounts and obtain API keys for:

1. **Supabase** - Database, Auth, Storage ([supabase.com](https://supabase.com))
2. **Google Maps Platform** - Maps & Geocoding ([console.cloud.google.com](https://console.cloud.google.com))
3. **Stripe** - Payment Processing ([stripe.com](https://stripe.com))
4. **Expo** - Push Notifications & Build Service ([expo.dev](https://expo.dev))

### Quick Start

```bash
# Clone repository
git clone https://github.com/quantium/descuentia.git
cd descuentia

# Install dependencies for all projects
cd backend && npm install && cd ..
cd website && npm install && cd ..
cd mobile-app && npm install && cd ..

# Start all dev servers at once
./start.sh
```

The `start.sh` script will start:
- 📡 Backend API (http://localhost:3001)
- 🌐 Website (http://localhost:3000)
- 📱 Mobile App (Expo Dev Server)

Press `Ctrl+C` to stop all servers.

For detailed setup instructions, see [PRODUCTION_PLAN.md](./PRODUCTION_PLAN.md).

---

## 📚 Documentation

- **[PRODUCTION_PLAN.md](./PRODUCTION_PLAN.md)** - Complete production plan and development roadmap
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes
- **[LICENSE](./LICENSE)** - Commercial License

---

## 🧭 Current Status

**Version**: 0.1.0 (Initial Setup)

See [PRODUCTION_PLAN.md](./PRODUCTION_PLAN.md) for:
- Complete feature specifications
- Database schema
- API documentation
- Development phases (9 phases, 12-14 weeks)
- Tech stack details
- Environment configuration

---

## 🤝 Contributing

This is proprietary software. For contribution inquiries or collaboration opportunities, please contact us:

- **Email**: support@descuentia.eu
- **Website**: https://descuentia.eu

All contributions must be made under a separate written agreement with Descuentia.

---

## 📄 License

This project is proprietary software protected by copyright law. All rights reserved.

This software and associated documentation are the proprietary and confidential information of Descuentia. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without the express written permission of Descuentia.

For licensing inquiries, please contact:
- **Email**: support@descuentia.eu
- **Website**: https://descuentia.eu

See the [LICENSE](./LICENSE) file for full terms and conditions.

---

## 📞 Contact

For questions or support:
- **GitHub Issues**: Report bugs or request features
- **Email**: support@descuentia.eu
- **Website**: https://descuentia.eu

---

**Built with ❤️ for local communities and cancer research**

*Making savings accessible while making a difference*
