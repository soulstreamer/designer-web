import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { ArrowLeft, Lock, Shield, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Element styles for Stripe inputs
const elementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

interface PaymentFormProps {
  amount: number;
  currency: string;
  language: string;
  productType: string;
}

function PaymentForm({ amount, currency, language, productType }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cardBrand, setCardBrand] = useState('');

  // Create payment intent when component mounts
  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Creating payment intent...', { amount, currency });
      
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          name: name || 'Customer',
          phone: phone || '',
          type: productType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      console.log('Payment intent created successfully');
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      console.error('Error creating payment intent:', err);
      setError(language === 'ro' 
        ? 'Eroare la inițializarea plății. Încearcă din nou.' 
        : 'Error initializing payment. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe not loaded. Please refresh the page.');
      return;
    }

    if (!clientSecret) {
      toast.error('Payment not initialized. Please refresh the page.');
      return;
    }

    // Validate form
    if (!name.trim()) {
      toast.error(language === 'ro' ? 'Numele este obligatoriu' : 'Name is required');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error(language === 'ro' ? 'Numărul de telefon este invalid' : 'Invalid phone number');
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement)!,
            billing_details: {
              name: name,
              phone: phone,
            },
          },
        }
      );

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
        toast.error(confirmError.message || (language === 'ro' ? 'Plată eșuată' : 'Payment failed'));
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        toast.success(language === 'ro' ? 'Plată reușită!' : 'Payment successful!');
        
        // Redirect to success page
        navigate(`/success?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
      } else {
        toast.error(language === 'ro' ? 'Status plată necunoscut' : 'Unknown payment status');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.message || (language === 'ro' ? 'A apărut o eroare' : 'An error occurred'));
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff]"></div>
        <p className="mt-4 text-gray-600">
          {language === 'ro' ? 'Se pregătește plata...' : 'Preparing payment...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={createPaymentIntent}
          className="px-6 py-2 bg-[#635bff] text-white rounded-md hover:bg-[#4f49cc] transition-colors"
        >
          {language === 'ro' ? 'Încearcă din nou' : 'Try again'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ro' ? 'Nume complet' : 'Full name'} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === 'ro' ? 'Ion Popescu' : 'John Doe'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900"
          required
        />
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ro' ? 'Număr de telefon' : 'Phone number'} *
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder={language === 'ro' ? '07XX XXX XXX' : '+40 7XX XXX XXX'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900"
          required
        />
        {phone.length > 0 && phone.length < 10 && (
          <p className="text-xs text-amber-600 mt-1">
            {language === 'ro' 
              ? `${10 - phone.length} cifre rămase` 
              : `${10 - phone.length} digits remaining`}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ro' ? 'Număr card' : 'Card number'} *
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <CreditCard size={20} />
          </div>
          <div className="border border-gray-300 rounded-lg p-3 pl-10 focus-within:ring-2 focus-within:ring-[#635bff] focus-within:border-transparent bg-white">
            <CardNumberElement 
              options={elementOptions}
              onChange={(e) => setCardBrand(e.brand || '')}
            />
          </div>
          {cardBrand && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-xs font-semibold text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded">
                {cardBrand}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ro' ? 'Data expirare' : 'Expiry date'} *
          </label>
          <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#635bff] focus-within:border-transparent bg-white">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC *
          </label>
          <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#635bff] focus-within:border-transparent bg-white">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">
          {language === 'ro' ? '💳 Card de test' : '💳 Test card'}
        </p>
        <p className="text-blue-800 font-mono text-lg tracking-wider">4242 4242 4242 4242</p>
        <p className="text-blue-700 text-sm mt-1">
          {language === 'ro' ? 'Orice dată viitoare, orice CVC' : 'Any future date, any CVC'}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full py-4 bg-[#635bff] text-white font-semibold rounded-lg hover:bg-[#4f49cc] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            {language === 'ro' ? 'Se procesează...' : 'Processing...'}
          </>
        ) : (
          <>
            <Lock size={18} />
            {language === 'ro' ? 'Plătește acum' : 'Pay now'}
          </>
        )}
      </button>

      {/* Security Note */}
      <p className="text-xs text-center text-gray-500">
        {language === 'ro' 
          ? 'Plată securizată prin Stripe. Cardul nu este stocat pe serverele noastre.'
          : 'Secure payment via Stripe. Card is not stored on our servers.'}
      </p>
    </form>
  );
}

export default function Checkout() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  
  const productType = searchParams.get('type') || 'prezentare';

  const products = {
    prezentare: {
      name: language === 'ro' ? 'Pagină Prezentare Unicat' : 'Unique Landing Page',
      price: language === 'ro' ? '1.000 RON' : '€200',
      amount: language === 'ro' ? 100000 : 20000,
      currency: language === 'ro' ? 'ron' : 'eur',
      features: language === 'ro' 
        ? ['Design 100% Unicat', 'Până la 5 Secțiuni', 'Formular Contact', 'Optimizare SEO']
        : ['100% Unique Design', 'Up to 5 Sections', 'Contact Form', 'SEO Optimization'],
    },
    magazin: {
      name: language === 'ro' ? 'Pagină Magazin Online' : 'Online Store Page',
      price: language === 'ro' ? '1.500 RON' : '€300',
      amount: language === 'ro' ? 150000 : 30000,
      currency: language === 'ro' ? 'ron' : 'eur',
      features: language === 'ro'
        ? ['Coș de Cumpărături', 'Plăți Online', 'Panou Administrare', 'Facturare Automată']
        : ['Shopping Cart', 'Online Payments', 'Admin Panel', 'Automatic Invoicing'],
    },
  };

  const product = products[productType as keyof typeof products] || products.prezentare;

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/#servicii" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-green-600" />
            <span className="text-sm text-gray-600">{language === 'ro' ? 'Securizat' : 'Secure'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column - Payment Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Logo */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <img src="/images/logo.png" alt="Designer-Web.ro" className="h-10 object-contain" />
              </div>

              <div className="p-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">
                  {language === 'ro' ? 'Finalizare plată' : 'Complete payment'}
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                  {language === 'ro' ? 'Introdu datele cardului pentru a finaliza comanda' : 'Enter your card details to complete the order'}
                </p>

                {/* Stripe Elements Provider */}
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    amount={product.amount}
                    currency={product.currency}
                    language={language}
                    productType={productType}
                  />
                </Elements>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ro' ? 'Sumar comandă' : 'Order summary'}
              </h2>
              
              {/* Product */}
              <div className="py-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className="font-semibold text-gray-900">{product.price}</span>
                </div>
                <ul className="space-y-1">
                  {product.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">{language === 'ro' ? 'Subtotal' : 'Subtotal'}</span>
                <span className="font-medium text-gray-900">{product.price}</span>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-gray-900 font-medium">{language === 'ro' ? 'Total' : 'Total'}</span>
                <span className="text-2xl font-bold text-gray-900">{product.price}</span>
              </div>

              {/* Guarantee */}
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-start gap-3">
                  <Shield className="text-green-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-green-900 text-sm">
                      {language === 'ro' ? 'Plată 100% securizată' : '100% secure payment'}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {language === 'ro'
                        ? 'Datele cardului sunt criptate și procesate de Stripe'
                        : 'Card data is encrypted and processed by Stripe'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}