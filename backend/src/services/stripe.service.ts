import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  limits: {
    promotions: number;
    loyaltyProgram: boolean;
    advancedAnalytics: boolean;
    featuredPlacement: boolean;
  };
}

// Subscription plans (prices should be configured in Stripe Dashboard)
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: '', // No Stripe price needed for free tier
    features: ['1 active promotion', 'Basic analytics', 'QR code redemption'],
    limits: {
      promotions: 1,
      loyaltyProgram: false,
      advancedAnalytics: false,
      featuredPlacement: false,
    },
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 19,
    priceId: process.env.STRIPE_PRICE_BASIC || '',
    features: [
      '3 active promotions',
      'Loyalty program',
      'Basic analytics',
      'Email support',
    ],
    limits: {
      promotions: 3,
      loyaltyProgram: true,
      advancedAnalytics: false,
      featuredPlacement: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    priceId: process.env.STRIPE_PRICE_PRO || '',
    features: [
      '10 active promotions',
      'Advanced loyalty program',
      'Advanced analytics',
      'Featured placement',
      'Priority support',
    ],
    limits: {
      promotions: 10,
      loyaltyProgram: true,
      advancedAnalytics: true,
      featuredPlacement: true,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 99,
    priceId: process.env.STRIPE_PRICE_PREMIUM || '',
    features: [
      'Unlimited promotions',
      'Premium loyalty features',
      'Advanced analytics + AI insights',
      'Priority featured placement',
      'Dedicated support',
      'Custom integrations',
    ],
    limits: {
      promotions: -1, // -1 = unlimited
      loyaltyProgram: true,
      advancedAnalytics: true,
      featuredPlacement: true,
    },
  },
};

/**
 * Creates a Stripe customer for a merchant
 */
export const createCustomer = async (
  email: string,
  name: string,
  metadata: Record<string, string>
): Promise<Stripe.Customer> => {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
};

/**
 * Creates a subscription for a customer
 */
export const createSubscription = async (
  customerId: string,
  priceId: string
): Promise<Stripe.Subscription> => {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
};

/**
 * Creates a setup intent for saving payment method without charging
 */
export const createSetupIntent = async (
  customerId: string
): Promise<Stripe.SetupIntent> => {
  return await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });
};

/**
 * Retrieves customer's payment methods
 */
export const getPaymentMethods = async (
  customerId: string
): Promise<Stripe.PaymentMethod[]> => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
  return paymentMethods.data;
};

/**
 * Cancels a subscription
 */
export const cancelSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription> => {
  return await stripe.subscriptions.cancel(subscriptionId);
};

/**
 * Updates a subscription to a new plan
 */
export const updateSubscription = async (
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'always_invoice',
  });
};

/**
 * Retrieves subscription details
 */
export const getSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription> => {
  return await stripe.subscriptions.retrieve(subscriptionId);
};

/**
 * Creates a payment intent for one-time payment
 */
export const createPaymentIntent = async (
  amount: number,
  currency: string,
  customerId: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    customer: customerId,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

/**
 * Handles webhook events from Stripe
 */
export const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string
): Stripe.Event => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
};
