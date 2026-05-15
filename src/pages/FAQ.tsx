import { useLanguage } from '@/contexts/LanguageContext';

export default function FAQ() {
  const { t } = useLanguage();

  const faqs = [
    { q: t('faq.q1') as string, a: t('faq.a1') as string },
    { q: t('faq.q2') as string, a: t('faq.a2') as string },
    { q: t('faq.q3') as string, a: t('faq.a3') as string },
    { q: t('faq.q4') as string, a: t('faq.a4') as string },
    { q: t('faq.q5') as string, a: t('faq.a5') as string },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 
          className="text-white font-bold text-4xl mb-8 text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {t('faq.title') as string}
        </h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-[#8B00FF]/50 transition-colors"
            >
              <h2 className="text-[#8B00FF] text-lg font-semibold mb-3">
                {faq.q}
              </h2>
              <p className="text-white/80 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}