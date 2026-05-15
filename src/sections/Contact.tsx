import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success((t('contact.success') as string) || 'Mesajul a fost trimis!');
      setForm({ name: '', email: '', message: '' });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: '', email: '', message: '' };
    if (!form.name.trim()) newErrors.name = (t('contact.error_name') as string) || 'Numele este obligatoriu';
    if (!form.email.trim()) newErrors.email = (t('contact.error_email') as string) || 'Email-ul este obligatoriu';
    if (!form.message.trim()) newErrors.message = (t('contact.error_message') as string) || 'Mesajul este obligatoriu';
    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email && !newErrors.message) {
      submitMutation.mutate({
        name: form.name,
        phone: form.email,
        service: 'prezentare',
        message: form.message,
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-left', {
        x: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
      gsap.from('.contact-right', {
        x: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="w-full py-24 bg-[#050505]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - contact info */}
          <div className="contact-left">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#8B00FF] mb-4 underline underline-offset-4 decoration-2">
              {t('contact.subtitle') as string}
            </p>
            <h2
              className="text-white font-bold mb-8"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.2,
              }}
            >
              {t('contact.title') as string}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-[#8B00FF] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white text-base">{t('contact.address') as string}</p>
                  <p className="text-[#888] text-[15px] mt-1">{t('contact.address_detail') as string}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone size={20} className="text-[#8B00FF] flex-shrink-0" />
                <a href="tel:+40767494319" className="text-white font-medium text-base hover:text-[#8B00FF] transition-colors">
                  {language === 'en' ? '+40 767 494 319' : '0767 494 319'}
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Mail size={20} className="text-[#8B00FF] flex-shrink-0" />
                <a href="mailto:contact@designer-web.ro" className="text-white text-base hover:text-[#8B00FF] transition-colors">
                  contact@designer-web.ro
                </a>
              </div>
            </div>

            <p className="text-[#8B00FF] text-sm mt-6">
              {t('contact.whatsapp') as string}
            </p>
          </div>

          {/* Right - form */}
          <div className="contact-right">
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-8">
              <h3
                className="text-white font-semibold text-xl mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('contact.form_title') as string}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder={t('contact.name_placeholder') as string}
                    value={form.name}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, name: e.target.value }));
                      if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                    }}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#8B00FF] transition-colors"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t('contact.email_placeholder') as string}
                    value={form.email}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, email: e.target.value }));
                      if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                    }}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#8B00FF] transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <textarea
                    placeholder={t('contact.message_placeholder') as string}
                    rows={5}
                    value={form.message}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, message: e.target.value }));
                      if (errors.message) setErrors((p) => ({ ...p, message: '' }));
                    }}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#8B00FF] transition-colors resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full py-4 bg-[#8B00FF] text-white font-semibold text-sm uppercase rounded-md hover:bg-[#6B00CC] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {submitMutation.isPending ? (t('contact.sending') as string) : (t('contact.submit') as string)}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider mt-16" />
    </section>
  );
}