import { Link, useSearchParams } from 'react-router';
import { XCircle, Home, Mail, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PaymentCancel() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  
  // Get product type from URL if available
  const productType = searchParams.get('type') || '';

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Cancel Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <XCircle size={48} className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {t('payment.cancel_title') as string}
        </h1>

        {/* Message */}
        <p className="text-white/70 text-lg mb-8 leading-relaxed">
          {t('payment.cancel_message') as string}
        </p>

        {/* Try Again Section */}
        {productType && (
          <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
              <RefreshCcw size={20} className="text-[#8B00FF]" />
              Încearcă din nou
            </h3>
            <p className="text-white/70 mb-4">
              Poți încerca din nou să finalizezi comanda sau să ne contactezi direct.
            </p>
            <Link
              to="/#servicii"
              className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#8B00FF]/20 text-[#8B00FF] font-semibold rounded-md hover:bg-[#8B00FF]/30 transition-colors"
            >
              <RefreshCcw size={16} />
              Reîncepe Comanda
            </Link>
          </div>
        )}

        {/* Alternative Payment Methods */}
        <div className="bg-white/5 rounded-lg p-6 mb-8 border border-white/10">
          <h3 className="text-white font-semibold mb-4">
            Alte metode de plată
          </h3>
          <ul className="text-white/70 space-y-2 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <span className="text-[#8B00FF]">•</span>
              <span>Transfer bancar</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8B00FF]">•</span>
              <span>Revolut</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8B00FF]">•</span>
              <span>PayPal</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8B00FF]">•</span>
              <span>Plată cash (doar în Alexandria)</span>
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
            Ai nevoie de ajutor? Scrie-ne la{' '}
            <a href="mailto:designerwebinquiry@gmail.com" className="text-[#8B00FF] hover:underline">
              designerwebinquiry@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}