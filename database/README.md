# Descuentia Database Setup

This directory contains all SQL migrations for the Descuentia application database.

## Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials from Settings > API:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep secret!)

## Setup Instructions

### Step 1: Configure Supabase Auth

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set site URL to your app URL

### Step 2: Run Migrations

Open the Supabase SQL Editor and run the migrations in order:

#### Migration 001: Profiles Table
```sql
-- Copy and paste contents of migrations/001_create_profiles.sql
```

This creates:
- `profiles` table with user roles (consumer/merchant)
- Automatic profile creation on signup
- Row Level Security policies

#### Migration 002: Businesses Table
```sql
-- Copy and paste contents of migrations/002_create_businesses.sql
```

This creates:
- `businesses` table with geolocation
- PostGIS extension for spatial queries
- RLS policies for business owners

#### Migration 003-010: Run remaining migrations

Execute each SQL file in the Supabase SQL Editor in numerical order:
- `003_create_promotions.sql`
- `004_create_coupons.sql`
- `005_create_loyalty.sql`
- `006_create_subscriptions.sql`
- `007_create_analytics.sql`
- `008_create_push_tokens.sql`

### Step 3: Verify Setup

Run this query to verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- analytics_events
- businesses
- coupons
- loyalty_cards
- loyalty_programs
- loyalty_transactions
- profiles
- promotions
- push_tokens
- subscriptions

### Step 4: Enable Realtime (Optional)

For real-time features, enable Realtime for these tables:
1. Go to Database > Replication
2. Enable replication for:
   - `promotions` (for live map updates)
   - `coupons` (for instant coupon updates)

## Database Schema Overview

### Core Tables

1. **profiles** - User information (extends auth.users)
2. **businesses** - Merchant business data
3. **promotions** - All campaign types (time_based, fixed, weekly_special)
4. **coupons** - Individual user coupon claims
5. **loyalty_programs** - Merchant loyalty program definitions
6. **loyalty_cards** - User loyalty card instances
7. **loyalty_transactions** - Stamp award history
8. **subscriptions** - Merchant Stripe subscriptions
9. **analytics_events** - User interaction tracking
10. **push_tokens** - Expo push notification tokens

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- **Profiles**: Users can only access their own data
- **Businesses**: Public can view active businesses, owners can manage their own
- **Promotions**: Public can view active promotions, merchants manage their own
- **Coupons**: Users can only see their own coupons
- **Subscriptions**: Merchants can only see their own subscription

## Testing the Setup

### Test Profile Creation

```sql
-- This should show your profile (run after signing up)
SELECT * FROM profiles WHERE id = auth.uid();
```

### Test Business Query

```sql
-- Get businesses near a location (Madrid city center example)
SELECT 
  id, name, address,
  ST_Distance(
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
    ST_SetSRID(ST_MakePoint(-3.7038, 40.4168), 4326)::geography
  ) / 1000 as distance_km
FROM businesses
WHERE active = true
ORDER BY distance_km
LIMIT 10;
```

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran all previous migrations first
- Check that you're running queries in the correct order

### Error: "permission denied"
- Verify RLS policies are created
- Make sure you're authenticated when testing

### Error: "function auth.uid() does not exist"
- This means you're not using Supabase Auth properly
- Make sure to include the auth token in your requests

## Environment Variables

After setup, add these to your `.env` files:

```env
# From Supabase Dashboard > Settings > API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Next Steps

1. ✅ Complete all migrations
2. ✅ Verify tables in Supabase dashboard
3. ✅ Add credentials to `.env` files
4. ➡️ Proceed to Phase 2: Authentication implementation
