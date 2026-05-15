import { Hono } from 'hono';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const app = new Hono();

// Create payment intent
app.post('/create-payment-intent', async (c) => {
  try {
    const body = await c.req.json();
    const { amount, currency, name, phone, type } = body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in smallest currency unit (e.g., cents)
      currency: currency || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_name: name,
        customer_phone: phone,
        product_type: type,
      },
    });

    return c.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return c.json({ error: 'Failed to create payment intent' }, 500);
  }
});

// Webhook to handle payment events (optional but recommended)
app.post('/webhook', async (c) => {
  const sig = c.req.header('stripe-signature');
  const rawBody = await c.req.text();
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig || '',
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return c.json({ error: 'Invalid signature' }, 400);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you can send confirmation emails, update database, etc.
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return c.json({ received: true });
});

export default app;