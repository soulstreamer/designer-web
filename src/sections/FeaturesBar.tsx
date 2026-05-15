import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ShieldCheck, CheckCircle, Headphones } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesBar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLDivElement>('.feature-bar-item');
      gsap.from(items, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16 bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 - Delivery */}
          <div className="feature-bar-item flex flex-col items-center text-center p-6">
            <div className="w-14 h-14 rounded-full bg-[#8B00FF]/10 flex items-center justify-center mb-4">
              <Clock size={28} className="text-[#8B00FF]" />
            </div>
            <h3
              className="text-white font-semibold text-base mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {t('featuresbar.delivery') as string}
            </h3>
            <p className="text-[#888] text-sm leading-relaxed">
              {t('featuresbar.delivery_desc') as string}
            </p>
          </div>

          {/* Feature 2 - Payments */}
          <div className="feature-bar-item flex flex-col items-center text-center p-6">
            <div className="w-14 h-14 rounded-full bg-[#8B00FF]/10 flex items-center justify-center mb-4">
              <ShieldCheck size={28} className="text-[#8B00FF]" />
            </div>
            <h3
              className="text-white font-semibold text-base mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {t('featuresbar.payments') as string}
            </h3>
            <p className="text-[#888] text-sm leading-relaxed">
              {t('featuresbar.payments_desc') as string}
            </p>
          </div>

          {/* Feature 3 - Projects */}
          <div className="feature-bar-item flex flex-col items-center text-center p-6">
            <div className="w-14 h-14 rounded-full bg-[#8B00FF]/10 flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-[#8B00FF]" />
            </div>
            <h3
              className="text-white font-semibold text-base mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {t('featuresbar.projects') as string}
            </h3>
            <p className="text-[#888] text-sm leading-relaxed">
              {t('featuresbar.projects_desc') as string}
            </p>
          </div>

          {/* Feature 4 - Support */}
          <div className="feature-bar-item flex flex-col items-center text-center p-6">
            <div className="w-14 h-14 rounded-full bg-[#8B00FF]/10 flex items-center justify-center mb-4">
              <Headphones size={28} className="text-[#8B00FF]" />
            </div>
            <h3
              className="text-white font-semibold text-base mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {t('featuresbar.support') as string}
            </h3>
            <p className="text-[#888] text-sm leading-relaxed">
              {t('featuresbar.support_desc') as string}
            </p>
          </div>
        </div>
      </div>
      <div className="section-divider mt-12" />
    </section>
  );
}