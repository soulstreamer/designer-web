import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';

// Product price IDs - Replace with your actual Stripe price IDs
export const STRIPE_PRICES = {
  prezentare: 'price_YOUR_LANDING_PAGE_PRICE_ID', // Landing page - €200
  magazin: 'price_YOUR_STORE_PRICE_ID', // Online store - €300
};

// Initialize Stripe
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (priceId: string, formData: { name: string; phone: string }) => {
  try {
    const stripe = await getStripe();
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // For frontend-only apps, we'll use the client-only checkout
    // You need to set up these prices in your Stripe Dashboard
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      successUrl: `${window.location.origin}/success?name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}`,
      cancelUrl: `${window.location.origin}/cancel`,
      customerEmail: '', // Optional: can be collected from customer
      // You can add metadata here
    });

    if (error) {
      console.error('Stripe error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

// Alternative: Use Stripe Payment Links (easier for frontend-only)
export const getPaymentLink = (type: 'prezentare' | 'magazin') => {
  // Your Stripe Payment Links
  const paymentLinks = {
    prezentare: 'https://buy.stripe.com/5kQbJ1cYZ3yMeTXdGH5Ne00',
    magazin: 'https://buy.stripe.com/28E7sL3opd9m5jneKL5Ne01',
  };
  
  return paymentLinks[type];
};