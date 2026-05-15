import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { ArrowLeft, Lock, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';

// Load Stripe outside of components to avoid recreating the Stripe object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFormProps {
  productType: string;
  productName: string;
  productPhone: string;
  amount: number;
  currency: string;
  language: string;
}

// Card Element styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function CheckoutForm({ productType, productName, productPhone, amount, currency, language }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [name, setName] = useState(productName);
  const [phone, setPhone] = useState(productPhone);

  // Create payment intent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            currency,
            name,
            phone,
            type: productType,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error:', error);
        toast.error(language === 'ro' ? 'Eroare la inițializarea plății' : 'Error initializing payment');
      }
    };

    createPaymentIntent();
  }, [amount, currency, name, phone, productType, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!name.trim()) {
      toast.error(language === 'ro' ? 'Numele este obligatoriu' : 'Name is required');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error(language === 'ro' ? 'Numărul de telefon este invalid' : 'Phone number is invalid');
      return;
    }

    setIsProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: name,
          phone: phone,
        },
      },
    });

    if (error) {
      toast.error(error.message || (language === 'ro' ? 'Plată eșuată' : 'Payment failed'));
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      toast.success(language === 'ro' ? 'Plată reușită!' : 'Payment successful!');
      navigate(`/success?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ro' ? 'Nume complet' : 'Full name'}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === 'ro' ? 'Ion Popescu' : 'John Doe'}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900 placeholder-gray-400"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ro' ? 'Număr de telefon' : 'Phone number'}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder={language === 'ro' ? '07XX XXX XXX' : '+40 7XX XXX XXX'}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900 placeholder-gray-400"
          required
        />
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ro' ? 'Informații card' : 'Card information'}
        </label>
        <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-[#635bff] focus-within:border-transparent">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {language === 'ro' 
            ? 'Cardul este procesat securizat prin Stripe'
            : 'Card is securely processed through Stripe'}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full py-4 bg-[#635bff] text-white font-semibold rounded-md hover:bg-[#4f49cc] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {language === 'ro' ? 'Se procesează...' : 'Processing...'}
          </>
        ) : (
          <>
            <Lock size={18} />
            {language === 'ro' ? 'Plătește' : 'Pay'} {amount / 100} {currency.toUpperCase()}
          </>
        )}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  
  const productType = searchParams.get('type') || 'prezentare';
  const productName = searchParams.get('name') || '';
  const productPhone = searchParams.get('phone') || '';

  const productInfo = {
    prezentare: {
      name: language === 'ro' ? 'Pagină Prezentare Unicat' : 'Unique Landing Page',
      price: language === 'ro' ? '1.000 RON' : '€200',
      amount: language === 'ro' ? 100000 : 20000, // Amount in smallest unit (bani or cents)
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

  const currentProduct = productInfo[productType as keyof typeof productInfo] || productInfo.prezentare;

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/#servicii" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">
              {language === 'ro' ? 'Înapoi' : 'Back'}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-green-600" />
            <span className="text-sm text-gray-600">
              {language === 'ro' ? 'Securizat' : 'Secure'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column - Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Brand Logo */}
              <div className="px-6 py-4 border-b border-gray-100">
                <img 
                  src="/images/logo.png" 
                  alt="Designer-Web.ro" 
                  className="h-12 object-contain"
                />
              </div>

              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {language === 'ro' ? 'Detalii plată' : 'Payment details'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {language === 'ro' 
                    ? 'Completează datele pentru a finaliza comanda'
                    : 'Complete your details to finalize the order'}
                </p>

                {/* Stripe Elements */}
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    productType={productType}
                    productName={productName}
                    productPhone={productPhone}
                    amount={currentProduct.amount}
                    currency={currentProduct.currency}
                    language={language}
                  />
                </Elements>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-6 border-t border-gray-100 mt-6">
                  <Shield size={14} />
                  <span>
                    {language === 'ro' 
                      ? 'Plăți procesate securizat prin Stripe'
                      : 'Payments securely processed by Stripe'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ro' ? 'Sumar comandă' : 'Order summary'}
              </h3>
              
              {/* Product */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{currentProduct.name}</p>
                  <ul className="mt-2 space-y-1">
                    {currentProduct.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-semibold text-gray-900">{currentProduct.price}</p>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">
                  {language === 'ro' ? 'Subtotal' : 'Subtotal'}
                </span>
                <span className="font-medium text-gray-900">{currentProduct.price}</span>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-gray-600">
                  {language === 'ro' ? 'Total' : 'Total'}
                </span>
                <span className="text-xl font-bold text-gray-900">{currentProduct.price}</span>
              </div>

              {/* Guarantee */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <div className="flex items-start gap-3">
                  <Shield className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {language === 'ro' ? 'Garanție 100%' : '100% Guarantee'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {language === 'ro'
                        ? 'Satisfacție garantată sau banii înapoi în 14 zile'
                        : 'Satisfaction guaranteed or money back within 14 days'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}