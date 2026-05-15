import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { ArrowLeft, Lock, Shield, AlertCircle, CreditCard } from 'lucide-react';
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

// Load Stripe
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log('Stripe Key:', stripeKey ? 'Found' : 'Missing');

const stripePromise = loadStripe(stripeKey || '');

// Element styles
const elementStyles = {
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

interface CheckoutFormProps {
  amount: number;
  currency: string;
  language: string;
  productName: string;
}

function CheckoutForm({ amount, currency, language, productName }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cardBrand, setCardBrand] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe not loaded');
      return;
    }

    if (!name.trim()) {
      toast.error(language === 'ro' ? 'Numele este obligatoriu' : 'Name is required');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error(language === 'ro' ? 'Număr invalid' : 'Invalid phone');
      return;
    }

    setIsProcessing(true);

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement)!,
      billing_details: {
        name: name,
        phone: phone,
      },
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
      setIsProcessing(false);
      return;
    }

    // SUCCESS! In a real app, you'd send paymentMethod.id to your backend
    console.log('Payment Method created:', paymentMethod.id);
    
    // For demo, just show success
    toast.success(language === 'ro' ? 'Plată reușită!' : 'Payment successful!');
    
    // Redirect to success page
    setTimeout(() => {
      navigate(`/success?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ro' ? 'Nume complet' : 'Full name'} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={language === 'ro' ? 'Ion Popescu' : 'John Doe'}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ro' ? 'Telefon' : 'Phone'} *
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="07XX XXX XXX"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
          required
        />
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'ro' ? 'Număr card' : 'Card number'} *
        </label>
        <div className="border border-gray-300 rounded-md p-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#635bff]">
          <CreditCard size={20} className="text-gray-400" />
          <CardNumberElement 
            options={elementStyles}
            onChange={(e) => setCardBrand(e.brand || '')}
            className="flex-1"
          />
          {cardBrand && (
            <span className="text-xs text-gray-500 uppercase">{cardBrand}</span>
          )}
        </div>
      </div>

      {/* Expiry & CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ro' ? 'Data exp.' : 'Expiry'} *
          </label>
          <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-[#635bff]">
            <CardExpiryElement options={elementStyles} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVC *
          </label>
          <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-[#635bff]">
            <CardCvcElement options={elementStyles} />
          </div>
        </div>
      </div>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
        <p className="font-medium text-blue-900 mb-1">
          {language === 'ro' ? '💳 Card de test:' : '💳 Test card:'}
        </p>
        <p className="text-blue-800 font-mono">4242 4242 4242 4242</p>
        <p className="text-blue-700 text-xs mt-1">
          {language === 'ro' ? 'Orice dată viitoare, orice CVC' : 'Any future date, any CVC'}
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-[#635bff] text-white font-semibold rounded-md hover:bg-[#4f49cc] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
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
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  
  const productType = searchParams.get('type') || 'prezentare';
  const productName = searchParams.get('name') || '';

  const products = {
    prezentare: {
      name: language === 'ro' ? 'Pagină Prezentare' : 'Landing Page',
      amount: language === 'ro' ? 100000 : 20000,
      currency: language === 'ro' ? 'ron' : 'eur',
      price: language === 'ro' ? '1.000 RON' : '€200',
    },
    magazin: {
      name: language === 'ro' ? 'Magazin Online' : 'Online Store',
      amount: language === 'ro' ? 150000 : 30000,
      currency: language === 'ro' ? 'ron' : 'eur',
      price: language === 'ro' ? '1.500 RON' : '€300',
    },
  };

  const product = products[productType as keyof typeof products] || products.prezentare;

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/#servicii" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            <span className="font-medium">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-green-600" />
            <span className="text-sm text-gray-600">{language === 'ro' ? 'Securizat' : 'Secure'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <img src="/images/logo.png" alt="Designer-Web.ro" className="h-12 object-contain" />
              </div>

              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {language === 'ro' ? 'Detalii plată' : 'Payment details'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {language === 'ro' ? 'Completează datele cardului' : 'Enter your card details'}
                </p>

                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    amount={product.amount}
                    currency={product.currency}
                    language={language}
                    productName={product.name}
                  />
                </Elements>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-6 border-t border-gray-100 mt-6">
                  <Shield size={14} />
                  <span>Powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ro' ? 'Sumar comandă' : 'Order summary'}
              </h3>
              
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                </div>
                <p className="font-semibold text-gray-900">{product.price}</p>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-gray-600">{language === 'ro' ? 'Total' : 'Total'}</span>
                <span className="text-xl font-bold text-gray-900">{product.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}