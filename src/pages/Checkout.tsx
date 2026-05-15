import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowLeft, Lock, Shield, CreditCard, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CheckoutFormData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
  phone: string;
}

interface CheckoutErrors {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
  phone: string;
}

export default function Checkout() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const productType = searchParams.get('type') || 'prezentare';
  const productName = searchParams.get('name') || '';
  const productPhone = searchParams.get('phone') || '';
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: productName,
    phone: productPhone,
  });
  
  const [errors, setErrors] = useState<CheckoutErrors>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    phone: '',
  });

  const productInfo = {
    prezentare: {
      name: language === 'ro' ? 'Pagină Prezentare Unicat' : 'Unique Landing Page',
      price: language === 'ro' ? '1.000 RON' : '€200',
      priceAmount: language === 'ro' ? '1000 RON' : '200 EUR',
      features: language === 'ro' 
        ? ['Design 100% Unicat', 'Până la 5 Secțiuni', 'Formular Contact', 'Optimizare SEO']
        : ['100% Unique Design', 'Up to 5 Sections', 'Contact Form', 'SEO Optimization'],
    },
    magazin: {
      name: language === 'ro' ? 'Pagină Magazin Online' : 'Online Store Page',
      price: language === 'ro' ? '1.500 RON' : '€300',
      priceAmount: language === 'ro' ? '1500 RON' : '300 EUR',
      features: language === 'ro'
        ? ['Coș de Cumpărături', 'Plăți Online', 'Panou Administrare', 'Facturare Automată']
        : ['Shopping Cart', 'Online Payments', 'Admin Panel', 'Automatic Invoicing'],
    },
  };

  const currentProduct = productInfo[productType as keyof typeof productInfo] || productInfo.prezentare;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setFormData({ ...formData, [name]: formatCardNumber(value) });
    } else if (name === 'expiry') {
      setFormData({ ...formData, [name]: formatExpiry(value) });
    } else if (name === 'cvc') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 4) });
    } else if (name === 'phone') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when typing
    if (errors[name as keyof CheckoutErrors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: '',
      phone: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = language === 'ro' ? 'Numele este obligatoriu' : 'Name is required';
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = language === 'ro' ? 'Numărul trebuie să aibă 10 cifre' : 'Phone must have 10 digits';
    }

    const cardDigits = formData.cardNumber.replace(/\s/g, '');
    if (cardDigits.length < 13 || cardDigits.length > 19) {
      newErrors.cardNumber = language === 'ro' ? 'Număr card invalid' : 'Invalid card number';
    }

    if (formData.expiry.length < 7) {
      newErrors.expiry = language === 'ro' ? 'Dată expirare invalidă' : 'Invalid expiry date';
    }

    if (formData.cvc.length < 3) {
      newErrors.cvc = language === 'ro' ? 'CVC invalid' : 'Invalid CVC';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate processing (replace with actual Stripe payment intent)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ro' ? 'Plată Reușită!' : 'Payment Successful!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ro' 
              ? `Mulțumim pentru comandă! Un designer te va contacta în curând.` 
              : `Thank you for your order! A designer will contact you soon.`}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#635bff] text-white font-medium rounded-md hover:bg-[#4f49cc] transition-colors"
          >
            {language === 'ro' ? 'Înapoi Acasă' : 'Back Home'}
          </Link>
        </div>
      </div>
    );
  }

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

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Payment Details Header */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {language === 'ro' ? 'Detalii plată' : 'Payment details'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {language === 'ro' 
                      ? 'Completează datele cardului pentru a finaliza comanda'
                      : 'Complete your card details to finalize the order'}
                  </p>
                </div>

                {/* Card Information */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'ro' ? 'Informații card' : 'Card information'}
                  </label>
                  
                  {/* Card Number */}
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM / YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        maxLength={7}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900 placeholder-gray-400"
                      />
                      {errors.expiry && (
                        <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="cvc"
                        placeholder="CVC"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900 placeholder-gray-400"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      {errors.cvc && (
                        <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name on Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ro' ? 'Nume pe card' : 'Name on card'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={language === 'ro' ? 'Numele complet' : 'Full name'}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Smartphone size={16} className="text-gray-400" />
                    {language === 'ro' ? 'Număr de telefon' : 'Phone number'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={language === 'ro' ? '07XX XXX XXX' : '+40 7XX XXX XXX'}
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
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
                      {language === 'ro' ? 'Plătește' : 'Pay'} {currentProduct.price}
                    </>
                  )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <Shield size={14} />
                  <span>
                    {language === 'ro' 
                      ? 'Plăți securizate cu criptare SSL'
                      : 'Secure payments with SSL encryption'}
                  </span>
                </div>
              </form>
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