import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle, Home, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PaymentSuccess() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  
  // Get customer info from URL if passed by Stripe
  const customerName = searchParams.get('name') || '';
  const customerPhone = searchParams.get('phone') || '';

  useEffect(() => {
    // You can add analytics or tracking here
    console.log('Payment successful', { name: customerName, phone: customerPhone });
  }, [customerName, customerPhone]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#8B00FF]/20 flex items-center justify-center">
            <CheckCircle size={48} className="text-[#8B00FF]" />
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {t('payment.success_title') as string}
        </h1>

        {/* Message */}
        <p className="text-white/70 text-lg mb-8 leading-relaxed">
          {t('payment.success_message') as string}
        </p>

        {/* Customer Info (if available) */}
        {(customerName || customerPhone) && (
          <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
            <h3 className="text-[#8B00FF] font-semibold mb-4">
              {t('contact.form_title') as string}
            </h3>
            {customerName && (
              <p className="text-white/80 mb-2">
                <span className="text-[#888]">{t('contact.name_placeholder') as string}:</span> {customerName}
              </p>
            )}
            {customerPhone && (
              <p className="text-white/80">
                <span className="text-[#888]">{t('contact.phone_placeholder') as string}:</span> {customerPhone}
              </p>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
          <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
            <Mail size={20} className="text-[#8B00FF]" />
            Ce urmează?
          </h3>
          <ul className="text-white/70 text-left space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#8B00FF] font-bold">1.</span>
              <span>Un designer te va contacta în 24 de ore</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8B00FF] font-bold">2.</span>
              <span>Vom discuta detaliile proiectului: culori, logo, conținut</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8B00FF] font-bold">3.</span>
              <span>Primești website-ul finalizat în 1-2 zile</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#8B00FF] text-white font-semibold rounded-md hover:bg-[#6B00CC] transition-colors"
          >
            <Home size={18} />
            {t('payment.back_home') as string}
          </Link>
          <a
            href="mailto:designerwebinquiry@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#8B00FF] text-[#8B00FF] font-semibold rounded-md hover:bg-[#8B00FF] hover:text-white transition-colors"
          >
            <Mail size={18} />
            {t('payment.contact_support') as string}
          </a>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-[#888] text-sm">
            Ai întrebări? Scrie-ne la{' '}
            <a href="mailto:designerwebinquiry@gmail.com" className="text-[#8B00FF] hover:underline">
              designerwebinquiry@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}