import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  return (
    <section ref={sectionRef} className="w-full py-24 bg-[#f5f5f5]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#8B00FF] mb-4 underline underline-offset-4 decoration-2 decoration-[#8B00FF]">
            {t('features.subtitle') as string}
          </p>
          <h2
            className="text-[#050505] font-bold mb-4"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: 1.2,
            }}
          >
            {t('features.title') as string}
          </h2>
          <p className="text-[#888] text-base max-w-md mx-auto">
            {t('features.desc') as string}
          </p>
        </div>
      </div>
    </section>
  );
}