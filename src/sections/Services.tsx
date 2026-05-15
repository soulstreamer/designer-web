import { useState, useRef } from 'react';
import { Monitor, ShoppingCart, Check, User, Phone, CreditCard } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPaymentLink } from '@/lib/stripe';

interface ProductFormData {
  name: string;
  phone: string;
}

interface ProductFormErrors {
  name: string;
  phone: string;
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const [prezentareForm, setPrezentareForm] = useState<ProductFormData>({ name: '', phone: '' });
  const [prezentareErrors, setPrezentareErrors] = useState<ProductFormErrors>({ name: '', phone: '' });
  const [showPrezentareForm, setShowPrezentareForm] = useState(false);
  
  const [magazinForm, setMagazinForm] = useState<ProductFormData>({ name: '', phone: '' });
  const [magazinErrors, setMagazinErrors] = useState<ProductFormErrors>({ name: '', phone: '' });
  const [showMagazinForm, setShowMagazinForm] = useState(false);

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success((t('services.submit_success') as string) || 'Comanda a fost trimisa!');
      setPrezentareForm({ name: '', phone: '' });
      setMagazinForm({ name: '', phone: '' });
      setShowPrezentareForm(false);
      setShowMagazinForm(false);
    },
    onError: (err) => {
      toast.error(err.message || 'Eroare la trimitere. Incerca din nou.');
    },
  });

  const validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'prezentare' | 'magazin'
  ) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (type === 'prezentare') {
      setPrezentareForm((prev) => ({ ...prev, phone: value }));
      if (prezentareErrors.phone) setPrezentareErrors((prev) => ({ ...prev, phone: '' }));
    } else {
      setMagazinForm((prev) => ({ ...prev, phone: value }));
      if (magazinErrors.phone) setMagazinErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'prezentare' | 'magazin'
  ) => {
    if (type === 'prezentare') {
      setPrezentareForm((prev) => ({ ...prev, name: e.target.value }));
      if (prezentareErrors.name) setPrezentareErrors((prev) => ({ ...prev, name: '' }));
    } else {
      setMagazinForm((prev) => ({ ...prev, name: e.target.value }));
      if (magazinErrors.name) setMagazinErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const isFormValid = (form: ProductFormData): boolean => {
    return form.name.trim().length > 0 && validatePhone(form.phone);
  };

  const handleOrder = (type: 'prezentare' | 'magazin') => {
    if (type === 'prezentare') {
      setShowPrezentareForm(true);
      setShowMagazinForm(false);
    } else {
      setShowMagazinForm(true);
      setShowPrezentareForm(false);
    }
  };

  const handlePayment = (type: 'prezentare' | 'magazin') => {
    const form = type === 'prezentare' ? prezentareForm : magazinForm;
    const setErrors = type === 'prezentare' ? setPrezentareErrors : setMagazinErrors;
    
    const newErrors = { name: '', phone: '' };
    if (!form.name.trim()) newErrors.name = (t('services.error_name') as string) || 'Numele este obligatoriu';
    if (!form.phone.trim()) {
      newErrors.phone = (t('services.error_phone') as string) || 'Numarul de telefon este obligatoriu';
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = (t('services.error_phone_digits') as string) || 'Numarul trebuie sa aiba exact 10 cifre';
    }
    
    setErrors(newErrors);

    if (!newErrors.name && !newErrors.phone) {
      // Submit contact form first
      submitContact.mutate({
        name: form.name,
        phone: form.phone,
        service: type,
        message: `Payment initiated for ${type === 'prezentare' ? 'Landing Page' : 'Online Store'}`,
      });

      // Redirect to Stripe Payment Link
      const paymentUrl = getPaymentLink(type);
      
      // Add customer info to the URL as query parameters
      const url = new URL(paymentUrl);
      url.searchParams.append('prefilled_email', '');
      url.searchParams.append('client_reference_id', `${form.name}-${form.phone}`);
      
      // Open Stripe in new tab
      window.open(url.toString(), '_blank');
    }
  };

  const prezentareFeatures = [
    t('services.feature1') as string,
    t('services.feature2') as string,
    t('services.feature3') as string,
    t('services.feature4') as string,
    t('services.feature5') as string,
  ];

  const magazinFeatures = [
    t('services.feature6') as string,
    t('services.feature7') as string,
    t('services.feature8') as string,
    t('services.feature9') as string,
    t('services.feature10') as string,
    t('services.feature11') as string,
  ];

  const phoneCountText = (t('services.phone_count') as string).replace('{count}', String(prezentareForm.phone.length));
  const magazinPhoneCountText = (t('services.phone_count') as string).replace('{count}', String(magazinForm.phone.length));
  const footerNoteText = (t('services.footer_note') as string).replace('{site}', 'www.designer-web.ro');

  return (
    <section id="servicii" ref={sectionRef} className="w-full py-24 bg-[#050505]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-white mb-4 underline underline-offset-4 decoration-2 decoration-white">
            {t('services.subtitle') as string}
          </p>
          <h2
            className="text-white font-bold mb-4"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: 1.2,
            }}
          >
            {t('services.title') as string}
          </h2>
          <p className="text-[#888] text-base max-w-xl mx-auto leading-relaxed">
            {t('services.desc') as string}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pagina Prezentare - Card 1 */}
          <div className="relative rounded-xl overflow-hidden border-2 border-white/30 hover:border-white/60 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
            {/* Video Background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/monitor-typing.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              <Monitor size={48} className="text-[#8B00FF] mb-6" strokeWidth={1.5} />
              <h3
                className="text-white font-semibold text-2xl mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('services.prezentare') as string}
              </h3>
              {/* Price Bar - Full width semi-transparent */}
              <div className="w-full relative bg-black/40 py-4 mb-6 border-y border-white/10">
                <span className="relative z-10 text-white font-bold text-xl drop-shadow-lg">
                  {t('services.prezentare_price') as string}
                </span>
              </div>
              <ul className="space-y-3 mb-8 w-full max-w-[280px] mx-auto">
                {prezentareFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <Check size={16} className="text-[#FFD700] flex-shrink-0 w-4" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {showPrezentareForm ? (
                <div className="w-full p-6 bg-white/90 rounded-lg border border-white/20">
                  <div className="space-y-4">
                    <div>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B00FF]" />
                        <input
                          type="text"
                          placeholder={t('services.name_placeholder') as string}
                          value={prezentareForm.name}
                          onChange={(e) => handleNameChange(e, 'prezentare')}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-[#ddd] rounded-md text-[#050505] placeholder-[#999] text-sm focus:outline-none focus:border-[#8B00FF]"
                        />
                      </div>
                      {prezentareErrors.name && <p className="text-red-500 text-xs mt-1">{prezentareErrors.name}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B00FF]" />
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder={t('services.phone_placeholder') as string}
                          value={prezentareForm.phone}
                          onChange={(e) => handlePhoneChange(e, 'prezentare')}
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-[#ddd] rounded-md text-[#050505] placeholder-[#999] text-sm focus:outline-none focus:border-[#8B00FF]"
                        />
                      </div>
                      {prezentareErrors.phone && <p className="text-red-500 text-xs mt-1">{prezentareErrors.phone}</p>}
                      <p className="text-[#999] text-xs mt-1">{phoneCountText}</p>
                    </div>
                    
                    {/* Stripe Payment Button */}
                    <button
                      onClick={() => handlePayment('prezentare')}
                      disabled={submitContact.isPending || !isFormValid(prezentareForm)}
                      className="w-full py-3 bg-gradient-to-r from-[#8B00FF] to-[#6B00CC] text-white font-semibold text-sm uppercase rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CreditCard size={18} />
                      {submitContact.isPending ? (t('services.sending') as string) : (t('services.pay_now') as string || 'Plătește Acum')}
                    </button>
                    
                    <button
                      onClick={() => setShowPrezentareForm(false)}
                      className="w-full py-2 text-[#888] text-sm hover:text-white transition-colors"
                    >
                      {t('services.cancel') as string || 'Anulează'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleOrder('prezentare')}
                  className="px-8 py-3 bg-[#8B00FF] text-white font-semibold text-sm rounded-md hover:bg-[#6B00CC] transition-colors"
                >
                  {t('services.order_btn') as string}
                </button>
              )}
            </div>
          </div>

          {/* Pagina Magazin Online - Card 2 */}
          <div className="relative rounded-xl overflow-hidden border-2 border-white/30 hover:border-white/60 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
            {/* Video Background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/monitor-typing.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              <ShoppingCart size={48} className="text-[#8B00FF] mb-6" strokeWidth={1.5} />
              <h3
                className="text-white font-semibold text-2xl mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('services.magazin') as string}
              </h3>
              {/* Price Bar - Full width semi-transparent */}
              <div className="w-full relative bg-black/40 py-4 mb-6 border-y border-white/10">
                <span className="relative z-10 text-white font-bold text-xl drop-shadow-lg">
                  {t('services.magazin_price') as string}
                </span>
              </div>
              <ul className="space-y-3 mb-8 w-full max-w-[280px] mx-auto">
                {magazinFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <Check size={16} className="text-[#FFD700] flex-shrink-0 w-4" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {showMagazinForm ? (
                <div className="w-full p-6 bg-white/90 rounded-lg border border-white/20">
                  <div className="space-y-4">
                    <div>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B00FF]" />
                        <input
                          type="text"
                          placeholder={t('services.name_placeholder') as string}
                          value={magazinForm.name}
                          onChange={(e) => handleNameChange(e, 'magazin')}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-[#ddd] rounded-md text-[#050505] placeholder-[#999] text-sm focus:outline-none focus:border-[#8B00FF]"
                        />
                      </div>
                      {magazinErrors.name && <p className="text-red-500 text-xs mt-1">{magazinErrors.name}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B00FF]" />
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder={t('services.phone_placeholder') as string}
                          value={magazinForm.phone}
                          onChange={(e) => handlePhoneChange(e, 'magazin')}
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-[#ddd] rounded-md text-[#050505] placeholder-[#999] text-sm focus:outline-none focus:border-[#8B00FF]"
                        />
                      </div>
                      {magazinErrors.phone && <p className="text-red-500 text-xs mt-1">{magazinErrors.phone}</p>}
                      <p className="text-[#999] text-xs mt-1">{magazinPhoneCountText}</p>
                    </div>
                    
                    {/* Stripe Payment Button */}
                    <button
                      onClick={() => handlePayment('magazin')}
                      disabled={submitContact.isPending || !isFormValid(magazinForm)}
                      className="w-full py-3 bg-gradient-to-r from-[#8B00FF] to-[#6B00CC] text-white font-semibold text-sm uppercase rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CreditCard size={18} />
                      {submitContact.isPending ? (t('services.sending') as string) : (t('services.pay_now') as string || 'Plătește Acum')}
                    </button>
                    
                    <button
                      onClick={() => setShowMagazinForm(false)}
                      className="w-full py-2 text-[#888] text-sm hover:text-white transition-colors"
                    >
                      {t('services.cancel') as string || 'Anulează'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleOrder('magazin')}
                  className="px-8 py-3 bg-[#8B00FF] text-white font-semibold text-sm rounded-md hover:bg-[#6B00CC] transition-colors"
                >
                  {t('services.order_btn') as string}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-[#888] text-[15px] max-w-2xl mx-auto mt-10 leading-relaxed">
          {footerNoteText}
        </p>
      </div>
    </section>
  );
}