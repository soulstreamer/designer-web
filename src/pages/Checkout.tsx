import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { ArrowLeft, Lock, Shield, CreditCard, User, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function Checkout() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const productType = searchParams.get('type') || 'prezentare';
  const initialName = searchParams.get('name') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [isProcessing, setIsProcessing] = useState(false);

  const products = {
    prezentare: {
      name: language === 'ro' ? 'Pagină Prezentare Unicat' : 'Unique Landing Page',
      price: language === 'ro' ? '1.000 RON' : '€200',
      amount: language === 'ro' ? '1000' : '200',
      currency: language === 'ro' ? 'RON' : 'EUR',
      // Your Stripe Payment Link with client_reference_id for tracking
      paymentLink: `https://buy.stripe.com/test_5kQbJ1cYZ3yMeTXdGH5Ne00?client_reference_id=${encodeURIComponent(`${name}-${phone}`)}&prefilled_name=${encodeURIComponent(name)}`,
      features: language === 'ro' 
        ? ['Design 100% Unicat', 'Până la 5 Secțiuni', 'Formular Contact', 'Optimizare SEO']
        : ['100% Unique Design', 'Up to 5 Sections', 'Contact Form', 'SEO Optimization'],
    },
    magazin: {
      name: language === 'ro' ? 'Pagină Magazin Online' : 'Online Store Page',
      price: language === 'ro' ? '1.500 RON' : '€300',
      amount: language === 'ro' ? '1500' : '300',
      currency: language === 'ro' ? 'RON' : 'EUR',
      // You need to create this payment link in Stripe Dashboard
      paymentLink: `https://buy.stripe.com/28E7sL3opd9m5jneKL5Ne01?client_reference_id=${encodeURIComponent(`${name}-${phone}`)}&prefilled_name=${encodeURIComponent(name)}`,
      features: language === 'ro'
        ? ['Coș de Cumpărături', 'Plăți Online', 'Panou Administrare', 'Facturare Automată']
        : ['Shopping Cart', 'Online Payments', 'Admin Panel', 'Automatic Invoicing'],
    },
  };

  const product = products[productType as keyof typeof products] || products.prezentare;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!name.trim()) {
      toast.error(language === 'ro' ? 'Numele este obligatoriu' : 'Name is required');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error(language === 'ro' ? 'Numărul de telefon trebuie să aibă 10 cifre' : 'Phone number must have 10 digits');
      return;
    }

    setIsProcessing(true);

    // Store customer info in localStorage so we can track it
    localStorage.setItem('payment_customer_name', name);
    localStorage.setItem('payment_customer_phone', phone);
    localStorage.setItem('payment_product_type', productType);
    localStorage.setItem('payment_timestamp', new Date().toISOString());

    // Build payment link with customer data
    const paymentUrl = new URL(product.paymentLink);
    paymentUrl.searchParams.set('client_reference_id', `${name}-${phone}-${Date.now()}`);
    
    // Open Stripe Payment Link in same tab
    window.location.href = paymentUrl.toString();
  };

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
                  {language === 'ro' ? 'Detalii comandă' : 'Order details'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {language === 'ro' 
                    ? 'Completează datele pentru a continua la plată'
                    : 'Fill in your details to continue to payment'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User size={16} className="inline mr-1" />
                      {language === 'ro' ? 'Nume complet' : 'Full name'} *
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
                      <Phone size={16} className="inline mr-1" />
                      {language === 'ro' ? 'Număr de telefon' : 'Phone number'} *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder={language === 'ro' ? '07XX XXX XXX' : '+40 7XX XXX XXX'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent text-gray-900 placeholder-gray-400"
                      required
                    />
                    {phone && phone.replace(/\D/g, '').length > 0 && phone.replace(/\D/g, '').length < 10 && (
                      <p className="text-xs text-amber-600 mt-1">
                        {language === 'ro' 
                          ? `Încă ${10 - phone.replace(/\D/g, '').length} cifre...` 
                          : `${10 - phone.replace(/\D/g, '').length} more digits...`}
                      </p>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <CreditCard className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-medium text-blue-900 text-sm">
                          {language === 'ro' ? 'Plată securizată prin Stripe' : 'Secure payment via Stripe'}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          {language === 'ro'
                            ? 'Vei fi redirecționat către Stripe pentru a finaliza plata în siguranță.'
                            : 'You will be redirected to Stripe to complete the payment securely.'}
                        </p>
                      </div>
                    </div>
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
                        {language === 'ro' ? 'Se pregătește...' : 'Preparing...'}
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        {language === 'ro' ? 'Continuă la Plată' : 'Continue to Payment'}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    {language === 'ro' 
                      ? `Vei plăti ${product.price} prin Stripe` 
                      : `You will pay ${product.price} via Stripe`}
                  </p>
                </form>

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
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <ul className="mt-2 space-y-1">
                    {product.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-semibold text-gray-900">{product.price}</p>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-gray-600">
                  {language === 'ro' ? 'Subtotal' : 'Subtotal'}
                </span>
                <span className="font-medium text-gray-900">{product.price}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4">
                <span className="text-gray-600">
                  {language === 'ro' ? 'Total' : 'Total'}
                </span>
                <span className="text-2xl font-bold text-gray-900">{product.price}</span>
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

              {/* What's Next */}
              <div className="mt-6 p-4 bg-[#635bff]/5 rounded-md border border-[#635bff]/20">
                <p className="font-medium text-[#635bff] text-sm mb-2">
                  {language === 'ro' ? 'Ce urmează?' : 'What happens next?'}
                </p>
                <ol className="text-xs text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-bold text-[#635bff]">1.</span>
                    {language === 'ro' 
                      ? 'Completezi datele și continui la Stripe'
                      : 'Fill in your details and continue to Stripe'}
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#635bff]">2.</span>
                    {language === 'ro'
                      ? 'Introduci datele cardului pe pagina Stripe'
                      : 'Enter your card details on Stripe\'s secure page'}
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#635bff]">3.</span>
                    {language === 'ro'
                      ? 'Primești confirmarea și te contactăm în 24h'
                      : 'Receive confirmation and we\'ll contact you within 24h'}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}